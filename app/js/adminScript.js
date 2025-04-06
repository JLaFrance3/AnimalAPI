
async function loadElements(event) {
    const userInfoContainer = document.getElementById('user-info-container');
    const animalList = document.getElementById('animal-list');
    const userDetails = await getAccountDetails();
    
    if (userDetails) {
        userDetails.animals.forEach(animal => {
            const li = document.createElement('li');
            li.textContent = `Animal: ${animal.name}, id: ${animal.id}`;
            animalList.appendChild(li);
        });

        userInfoContainer.innerHTML = 
            `<p class="greeting">Hello, ${userDetails.name}</p>` + 
            userInfoContainer.innerHTML +
            `
                <div class="bottom-row">
                    <a href="create.html">Create Animal</a>
                    <button onclick="logout()">Logout</button>
                </div>
            `;

        console.log(animalList.innerHTML);
        console.log("Animals:", userDetails.animals);
    }
    else {
        logout();
    }
}

function logout() {
    localStorage.removeItem('AuthToken');
    window.location.href = 'login.html';
}

// Login and retrieve auth token
async function getAccountDetails() {
    if(!localStorage.getItem('AuthToken')) {
        logout();
    }

    const SERVER_DOMAIN = 'http://localhost:3000';

    const requestOptions = {
        method: 'GET',
        headers: {
            "token": JSON.parse(localStorage.getItem('AuthToken')).token
        }
    };

    const response = await fetch(`${SERVER_DOMAIN}/user`, requestOptions);
    const status = response.status;

    if (status === 200) {
        const userDetails = await response.json();
        return userDetails;
    }
}

loadElements();