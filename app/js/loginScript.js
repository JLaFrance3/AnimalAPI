
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
        
        const loginResponse = await login(usernameInput.value, passwordInput.value);
        console.log(loginResponse);
        console.log(loginResponse.status);
        if (loginResponse.status === 401) {
            errorMessage.innerHTML = 'Error: Unauthorized';
        }
        else {
            const errorData = await response.json();
            errorMessage.innerHTML = `Error: ${errorData.error}`;
        }
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

    return response;
}

if(localStorage.getItem('AuthToken')) {
    window.location.href = 'admin.html';
}