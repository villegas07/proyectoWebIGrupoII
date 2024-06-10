document.getElementById('accountForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addAccount();
});

let isEditing = false;
let currentEditingAccountNumber = null;

function addAccount() {
    const accountNumber = document.getElementById('accountNumber').value;
    const bankName = document.getElementById('bankName').value;
    const accountType = document.getElementById('accountType').value;
    const currentBalance = document.getElementById('currentBalance').value;
    const accountStatus = document.getElementById('accountStatus').value;
    const openingDate = document.getElementById('openingDate').value;
    const description = document.getElementById('description').value;

    if (accountExists(accountNumber)) {
        alert('La cuenta ya existe. Por favor, ingrese un número de cuenta diferente.');
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts.push({ accountNumber, bankName, accountType, currentBalance, accountStatus, openingDate, description });
    localStorage.setItem('accounts', JSON.stringify(accounts));

    renderTable();
    clearForm();
}

function clearForm() {
    document.getElementById('accountForm').reset();
    document.getElementById('btnUpdate').disabled = true;
    document.getElementById('accountNumber').disabled = false;
    isEditing = false;
    currentEditingAccountNumber = null;
    document.querySelector('.btn-save').disabled = false;
}

function renderTable() {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const table = document.getElementById('accountsTable');
    table.innerHTML = '';

    accounts.forEach(account => {
        const row = table.insertRow();
        row.insertCell(0).innerText = account.accountNumber;
        row.insertCell(1).innerText = account.bankName;
        row.insertCell(2).innerText = account.accountType;
        row.insertCell(3).innerText = account.currentBalance;
        row.insertCell(4).innerText = account.accountStatus;
        row.insertCell(5).innerText = account.openingDate;
        row.insertCell(6).innerText = account.description;
        const actionsCell = row.insertCell(7);
        actionsCell.innerHTML = `
            <button class="btn btn-edit" onclick="editAccount('${account.accountNumber}')">Editar</button>
            <button class="btn btn-delete" onclick="deleteAccount('${account.accountNumber}')">Eliminar</button>
        `;
    });
}

function editAccount(accountNumber) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const account = accounts.find(acc => acc.accountNumber === accountNumber);

    document.getElementById('accountNumber').value = account.accountNumber;
    document.getElementById('bankName').value = account.bankName;
    document.getElementById('accountType').value = account.accountType;
    document.getElementById('currentBalance').value = account.currentBalance;
    document.getElementById('accountStatus').value = account.accountStatus;
    document.getElementById('openingDate').value = account.openingDate;
    document.getElementById('description').value = account.description;

    document.getElementById('accountNumber').disabled = true;
    document.getElementById('btnUpdate').disabled = false;
    document.querySelector('.btn-save').disabled = true;

    isEditing = true;
    currentEditingAccountNumber = accountNumber;
}

function updateAccount() {
    if (!isEditing || !currentEditingAccountNumber) {
        alert('Debe seleccionar una cuenta para actualizar.');
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountIndex = accounts.findIndex(acc => acc.accountNumber === currentEditingAccountNumber);

    const accountNumber = document.getElementById('accountNumber').value;
    const bankName = document.getElementById('bankName').value;
    const accountType = document.getElementById('accountType').value;
    const currentBalance = document.getElementById('currentBalance').value;
    const accountStatus = document.getElementById('accountStatus').value;
    const openingDate = document.getElementById('openingDate').value;
    const description = document.getElementById('description').value;

    accounts[accountIndex] = { accountNumber, bankName, accountType, currentBalance, accountStatus, openingDate, description };
    localStorage.setItem('accounts', JSON.stringify(accounts));

    renderTable();
    clearForm();
}

function deleteAccount(accountNumber) {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts = accounts.filter(acc => acc.accountNumber !== accountNumber);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    renderTable();
}

function accountExists(accountNumber) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    return accounts.some(account => account.accountNumber === accountNumber);
}

document.addEventListener('DOMContentLoaded', renderTable);
