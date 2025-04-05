let slideshowIndex = 0;
const slide = document.getElementById("current-slide");
const slideCounter = document.getElementById("slide-counter");
let images = [];

// Fetch request for animal with given id
async function getAnimal(id) {
    const SERVER_DOMAIN = 'http://localhost:3000';

    const requestOptions = {
        method: 'GET'
    };

    const response = await fetch(`${SERVER_DOMAIN}/animals/${id}`, requestOptions);
    const status = response.status;

    if (status === 200) {
        const animal = await response.json();
        return animal;
    }
}

//Accepts a 1 or -1 from button onClick to get next or previous image
function changeSlide(step) {
    slideshowIndex += step;
    slideshowIndex = ((slideshowIndex % images.length) + images.length) % images.length;
    slide.src = images[slideshowIndex];
    slideCounter.innerText = `${slideshowIndex + 1}/${images.length}`;
}

async function loadElements() {
    const queryStringParams = new URLSearchParams(window.location.search);
    const id = queryStringParams.get('id');
    if (id === null) {
        window.location.href = 'index.html';
        return;
    }

    const animal = await getAnimal(id);
    
    if (animal) {
        images = animal.images;

        // Set browser tab title
        document.title = animal.name;

        // Set animal name as title
        const nameTitle = document.getElementById("title");
        nameTitle.innerHTML = animal.name;

        // Set animal scientific name as subtitle
        const sciName = document.getElementById("sci-name");
        sciName.innerHTML = animal.sciName;

        // Use first image as title image
        const titleImage = document.getElementById("title-image");
        titleImage.src = images[0];

        // Write descriptions in paragraph form
        const aboutDescriptions = document.getElementById("descriptions");
        animal.description.forEach(description => {
            aboutDescriptions.innerHTML += `
                <p class="about-paragraph">${description}</p>
            `;
        });

        changeSlide(1); //Set initial slide

        // Set video
        const videocontainer = document.getElementById("video-container");
        videocontainer.innerHTML = `
            <iframe class="video" src="${animal.video}" frameborder="0"></iframe>
        `;

        //Set date
        const todayDate = new Date();
        const dateDisplay = document.getElementById("date-display");
        dateDisplay.innerText = todayDate.toLocaleDateString();

        //Events
        const upcomingEvents = document.getElementById("upcoming-events");
        const pastEvents = document.getElementById("past-events");
        const events = animal.events;
        
        events.forEach(event => {
            if (new Date(event.date) >= todayDate) {
                if (upcomingEvents.innerHTML === "") {
                    upcomingEvents.classList.add("events-flex-column");
                    upcomingEvents.innerHTML = "<h3>Upcoming Events</h3>";
                }
                upcomingEvents.innerHTML += `
                    <div class="event-card">
                        <a href=${event.url} target="_blank">
                            <h3 class="event">${event.name} - ${event.date}</h3>
                        </a>
                    </div>
                `;
            }
            else {
                if (pastEvents.innerHTML === "") {
                    pastEvents.classList.add("events-flex-column");
                    pastEvents.innerHTML = "<h3>Past Events</h3>";
                }
                pastEvents.innerHTML += `
                    <div class="event-card">
                        <a href=${event.url} target="_blank">
                            <h3 class="event">${event.name} - ${event.date}</h3>
                        </a>
                    </div>
                `;
            }
        });
    }
    else {
        window.location.href = 'index.html';
    }
}

loadElements();

