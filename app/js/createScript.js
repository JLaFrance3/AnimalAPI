// TODO: Redirect to login if user has invalid token

const nameInput = document.getElementById('name');
const sciNameInput = document.getElementById('sciname');
const descriptionInput = document.getElementById('description');
const imageInput = document.getElementById('images');
const videoInput = document.getElementById('video');
const eventsInput = document.getElementById('events');

const fields = [
    nameInput,
    sciNameInput,
    descriptionInput,
    imageInput,
    videoInput,
    eventsInput
];

async function submitForm(event) {
    event.preventDefault();

    const emptyFieldMessage = [
        'Name is invalid: ',
        'Scientific Name is invalid: ',
        'Description is invalid: ',
        'Images is invalid: ',
        'Video is invalid: ',
        'Events is invalid: '
    ];

    const errorMessage = document.getElementById('invalid-input-message');
    let missingField = false;
    fields.forEach((field, index) => {
        if (field.value === '') {
            missingField = true;
            errorMessage.innerHTML = emptyFieldMessage[index] + 'Field cannot be empty.';
        }
    });

    if (missingField) {
        return;
    }

    errorMessage.innerHTML = '';
    const serverResponse = await createAnimal(...fields);

    const status = serverResponse.status;
    const userDetails = await serverResponse.json();
    console.log(status);
    console.log(userDetails)
}

function loadSample() {
    nameInput.value = 'Armadillo';
    sciNameInput.value = 'Dasypodidae';
    descriptionInput.value = 'All species are native to the Americas, where they inhabit a variety of environments.\n' +
        'Living armadillos are characterized by a leathery armor shell and long, sharp claws for digging.';
    imageInput.value = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nine-banded_Armadillo.jpg/220px-Nine-banded_Armadillo.jpg\n' +
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nine-banded_Armadillo.jpg/220px-Nine-banded_Armadillo.jpg';
    videoInput.value = 'https://www.youtube.com/embed/FQH2rISdaWw';
    eventsInput.value = 'Shady Armadillo\n' +
        '04/25/2025\n' +
        'https://www.eventbrite.com/e/shady-armadillo-in-dantes-at-fireflys-tickets-1271136656959\n\n' +
        'Armadillo Christmas Bazaar\n' +
        '12/13/2025\n' +
        'https://armadillobazaar.com/';
}

function logout() {
    localStorage.removeItem('AuthToken');
    window.location.href = 'login.html';
}

// Login and retrieve auth token
async function createAnimal(name, sciname, descriptions, images, video, events) {
    const SERVER_DOMAIN = 'http://localhost:3000';

    const eventArray = events.value.split('\n\n').map(eventDetails => {
        const [name, date, url] = eventDetails.split('\n');
        return {
            name: name,
            date: date,
            url: url
        }
    });

    const formData = {
        name: name.value,
        sciName: sciname.value,
        description: descriptions.value.split('\n'),
        images: images.value.split('\n'),
        video: video.value,
        events: eventArray
    }

    console.log(JSON.stringify(formData));

    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem('AuthToken')).token
        },
        body: JSON.stringify(formData)
    };

    const response = await fetch(`${SERVER_DOMAIN}/animals`, requestOptions);

    if (response) {
        return response;
    }
}