const gridContainer = document.getElementById("animal-cards");

async function getAnimals() {
    const SERVER_DOMAIN = 'http://localhost:3000';

    const requestOptions = {
        method: 'GET'
    };

    const response = await fetch(`${SERVER_DOMAIN}/animals`, requestOptions);
    const animals = await response.json();

    if (animals) {
        animals.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
    
            return 0;
        });

        return animals;
    }
}

async function loadAnimals() {
    const animals = await getAnimals();

    if (animals) {
        animals.forEach(animal => {
            gridContainer.innerHTML += `
                <div class="card">
                    <a href="details.html?id=${animal.id}">
                        <h3>${animal.name}</h2>
                        <div class="card-image-wrapper">
                            <img draggable="false" src=${animal.images[0]}>
                        </div>
                    </a>
                </div>
            `
        });
    }
}

loadAnimals();