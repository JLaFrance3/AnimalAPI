
async function submitForm(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const invalidUsername = 'Username is invalid: cannot be empty.';
    const invalidPassword = 'Password is invalid: cannot be empty.';
    const errorMessage = document.getElementById('invalid-input-message');

    if (usernameInput.value === '') {
        errorMessage.innerHTML = invalidUsername;
    }
    else if (passwordInput.value === '') {
        errorMessage.innerHTML = invalidPassword;
    }
    else {
        errorMessage.innerHTML = '';
        
        login(usernameInput.value, passwordInput.value);
    }
}

// Login and retrieve auth token
async function login(username, password) {
    const SERVER_DOMAIN = 'http://localhost:3000';

    const formData = {
        username: username,
        password: password
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    };

    const response = await fetch(`${SERVER_DOMAIN}/login`, requestOptions);
    const status = response.status;

    if (status === 201) {
        const token = await response.json();
        localStorage.setItem('AuthToken', JSON.stringify(token));
        window.location.href = 'admin.html';
    }
}

if(localStorage.getItem('AuthToken')) {
    window.location.href = 'admin.html';
}