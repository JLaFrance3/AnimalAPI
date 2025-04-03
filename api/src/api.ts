import express, { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import {Animal, User, Event, DecodedToken} from "./typeInterfaces"

const app = express();
const port = 3000;

const jsonDB = fs.readFileSync('./api/data.json', { encoding: 'utf8'});
const parsedDB: {animals: Animal[]; users: User[]} = JSON.parse(jsonDB);
const animals: Animal[] = parsedDB.animals;
const users: User[] = parsedDB.users;

// GET: /animals/all
app.get('/animals', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json(animals);
    } catch (error) {
        next(error);
    }
});

// GET: /animals/:id
app.get('/animals/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find selected animal by id
        const id: number = parseInt(req.params.id as string, 10);
        const selectedAnimal = animals.find(animal => animal.id === id);

        // Return error if not found
        if (!selectedAnimal) {
            res.status(404).json({error: 'no animal found with given id'});
            return;
        }

        // Return animal JSON
        res.status(200).json(selectedAnimal);
    } catch (error) {
        next(error);
    }
});

// POST: /animals


// Global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});