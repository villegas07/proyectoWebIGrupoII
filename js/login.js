document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        if (user.role === 'administrador') {
            window.location.href = 'html/InicioAdmin.html'; // Redirigir a la página del administrador
        } else {
            window.location.href = 'html/InicioClientes.html'; // Redirigir a la página del usuario
        }
    } else {
        alert('Credenciales inválidas. Por favor, inténtelo de nuevo.');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.username === newUsername);

    if (userExists) {
        alert('El nombre de usuario ya existe. Por favor, elija otro.');
    } else {
        users.push({ username: newUsername, password: newPassword, email: email, role: role });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Usuario registrado con éxito. Ahora puede iniciar sesión.');
        showLogin();
    }
});

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}
