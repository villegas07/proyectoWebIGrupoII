let users = JSON.parse(localStorage.getItem('users')) || [];
let editIndex = -1;

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (editIndex === -1) {
        addUser();
    } else {
        saveUser();
    }
});

function addUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    users.push({ username, password, email, role });
    localStorage.setItem('users', JSON.stringify(users));
    updateTable();
    clearForm();
}

function editUser(index) {
    const user = users[index];
    document.getElementById('username').value = user.username;
    document.getElementById('password').value = user.password;
    document.getElementById('email').value = user.email;
    document.getElementById('role').value = user.role;
    editIndex = index;
    document.querySelector('.btn-update').disabled = false;
}

function saveUser() {
    if (editIndex !== -1) {
        users[editIndex] = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value
        };
        localStorage.setItem('users', JSON.stringify(users));
        updateTable();
        clearForm();
        editIndex = -1;
        document.querySelector('.btn-update').disabled = true;
    }
}

function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    updateTable();
}

function queryUserByUsername() {
    const query = document.getElementById('username').value.trim().toLowerCase();
    if (query === "") {
        alert("Por favor, ingrese el nombre de usuario que desea consultar.");
        return;
    }
    const filteredUsers = users.filter(user => user.username.toLowerCase() === query);
    updateTable(filteredUsers);
}

function queryUsers() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) || 
        user.role.toLowerCase().includes(query)
    );
    updateTable(filteredUsers);
}

function filterUsers() {
    queryUsers();
}

function updateTable(filteredUsers = users) {
    const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    filteredUsers.forEach((user, index) => {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).innerText = user.username;
        newRow.insertCell(1).innerText = user.email;
        newRow.insertCell(2).innerText = user.role;

        const actionsCell = newRow.insertCell(3);
        actionsCell.innerHTML = `
            <div class="action-buttons">
                <button class="btn-edit" onclick="editUser(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteUser(${index})">Eliminar</button>
            </div>
        `;
    });
}

function clearForm() {
    document.getElementById('userForm').reset();
    editIndex = -1;
    document.querySelector('.btn-update').disabled = true;
}

// Inicializa la tabla con los usuarios almacenados en localStorage
document.addEventListener('DOMContentLoaded', () => {
    updateTable(users); // Actualiza la tabla con los usuarios almacenados en localStorage
});
