import express, { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import {Animal, User, Event, DecodedToken} from "./typeInterfaces"
import sha256 from 'js-sha256';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';

declare module 'js-sha256' {
    export default function sha256(input: string): string;
}

// Include access-control-allow-origin headers
const corsOptions = {
    origin: "http://127.0.0.1:5500"
}

const app = express();
const port = 3000;
app.use(cors(corsOptions));
app.use(express.json());

const jsonDB = fs.readFileSync('./api/data.json', { encoding: 'utf8'});
const parsedDB: {animals: Animal[]; users: User[]} = JSON.parse(jsonDB);
const animals: Animal[] = parsedDB.animals;
const users: User[] = parsedDB.users;

// GET: /animals/all
// Get all animals
app.get('/animals', (req: Request, res: Response, next: NextFunction) => {
    try {
        const animalOutput = JSON.stringify(animals, null, 4);
        res.status(200).send(animalOutput);
    } catch (error) {
        next(error);
    }
});

// GET: /animals/:id
// Get animal by id
app.get('/animals/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate id
        const id: number = parseInt(req.params.id as string, 10);
        if (!Number.isInteger(id)) {
            res.status(400).json({ error: 'Error: id must be a valid whole number' });
            return;
        }

        // Find selected animal by id
        const selectedAnimal = animals.find(animal => animal.id === id);

        // Return error if not found
        if (!selectedAnimal) {
            res.status(404).json({ error: 'Error: animal not found' });
            return;
        }

        // Return animal JSON
        res.status(200).json(selectedAnimal);
    } catch (error) {
        next(error);
    }
});

// POST: /login
// Login returns authentication token valid for 1 hour
app.post('/login', (req: Request, res: Response, next: NextFunction) => {
    interface LoginBody {
        username: String;
        password: string;
    };

    try {
        // Validate request
        if (!req.body.username) {
            res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Missing username' })
            return;
        }
        if (!req.body.password) {
            res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Missing password' })
            return;
        }

        const { username, password } = req.body as LoginBody;

        // Create auth token
        const userhash = sha256(`${username}:${password}`);
        const user = users.find(user => user.hash === userhash);

        if (user) {
            const data = {
                userId: user.id
            }

            // Create token
            const token = jwt.sign(data, process.env.KEY as string, { expiresIn: '1hr' });
            res.status(201).json({ "token": token });
        }
        else {
            res.status(401).json({ error: 'Unauthorized -- login credentials did not match a user record' });
        }
    } catch (error) {
        next(error);
    }
});

// POST: /animals
// Create new animal
app.post('/animals', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate header
        const token = req.headers.token as string;
        if (!token) {
            res.status(401).json({ error: 'Error: Unauthorized' });
            return;
        }

        // Check for valid token
        const decodedToken = jwt.verify(token, process.env.KEY as string) as DecodedToken;
        if (!decodedToken) {
            res.status(401).json({ error: 'Error: Unauthorized' });
            return;
        }

        // Validate body. Check for all fields
        const requiredFields = ['name', 'sciName', 'description', 'images', 'video', 'events'];
        const missingFields = requiredFields.filter(field => !(field in req.body));
        if (missingFields.length > 0) {
            res.status(400).json({ error: `Error: Malformed/Invalid Request Body -- Missing fields: ${missingFields.join(', ')}` });
            return;
        }

        // Name and scientific name length > 0
        if (req.body.name.length === 0) {
            res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Name length should be > 0' });
            return;
        }
        if (req.body.sciName.length === 0) {
            res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Sciname length should be > 0' });
            return;
        }
        // Description array length >= 2
        if (req.body.description.length < 2) {
            res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Description array should contain atleast one element' });
            return;
        }
        // Images array length >= 1
        if (req.body.images.length < 1) {
            res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Images array should contain atleast one element' });
            return;
        }
        // Videos array length >= 1
        if (req.body.video.length < 1) {
            res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Video array should contain atleast one element' });
            return;
        }

        // Validate events
        const reqEventFields = ['name', 'date', 'url'];
        for (const event of req.body.events) {
            // Events must have required fields
            const missingEventFields = reqEventFields.filter(field => !(field in event));
            if (missingEventFields.length > 0) {
                res.status(400).json({ error: `Error: Malformed/Invalid Request Body -- Missing event fields: ${missingFields.join(', ')}` });
                return;
            }
            // Name and url length > 0
            if (event.name.length === 0) {
                res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Event name length should be > 0' });
                return;
            }
            if (event.url.length === 0) {
                res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Event URL length should be > 0' });
                return;
            }
            // Input date must match mm/dd/yyyy regex
            if (!event.date.match(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/)) {
                res.status(400).json({ error: 'Error: Malformed/Invalid Request Body -- Event date format must be mm/dd/yyyy' });
                return;
            }
        }

        // Create unique animal id
        let uniqueID = 0;
        animals.forEach(animal => {
            uniqueID = Math.max(animal.id, uniqueID);
        });
        uniqueID++;

        // Create animal and add to array
        const animal: Animal = {
            id: uniqueID,
            createdByUser: decodedToken.userId,
            ...req.body
        };
        animals.push(animal);

        // Write back to json file
        const newJSON = JSON.stringify({ animals, users }, null, 4);
        fs.writeFileSync('./api/data.json', newJSON);

        res.status(201).json({
            "message": "successfully created new animal record",
            "id": animal.id,
        });

    } catch (error) {
        next(error);
    }
});

// GET: /user
// Get admin user account details
app.get('/user', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate header
        const token = req.headers.token as string;
        if (!token) {
            res.status(401).json({ error: 'Error: Unauthorized' });
            return;
        }

        // Check for valid token
        const decodedToken = jwt.verify(token, process.env.KEY as string) as DecodedToken;
        if (!decodedToken) {
            res.status(401).json({ error: 'Error: Unauthorized' });
            return;
        }

        // Find specific user by token id
        const userDetails = users.find(user => user.id === decodedToken.userId);

        if (userDetails) {
            const userAnimals = animals.filter(animal => animal.createdByUser === userDetails.id);
            res.status(200).json({
                "id": userDetails.id,
                "name": userDetails.name,
                "animals": userAnimals
            });
        }
        else {
            res.status(401).json({ error: 'Error: Unauthorized' });
            return;
        }

    } catch (error) {
        next(error);
    }
});

// Global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});