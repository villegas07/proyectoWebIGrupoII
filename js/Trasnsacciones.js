document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addTransaction();
});

let isEditing = false;
let currentEditingRow = null;

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `${message}<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>`;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}

function addTransaction() {
    const relatedAccount = document.getElementById('relatedAccount').value;

    if (!accountExists(relatedAccount)) {
        showAlert('La cuenta relacionada no existe. Por favor, ingrese una cuenta bancaria válida.', 'error');
        return;
    }

    const transactionType = document.getElementById('transactionType').value;
    const associatedType = document.getElementById('associatedType').value;
    const transactionValue = parseFloat(document.getElementById('transactionValue').value);
    const transactionDate = document.getElementById('transactionDate').value;
    const description = document.getElementById('description').value;
    const attachment = document.getElementById('attachment').files[0];

    const formattedDate = formatDate(transactionDate);
    const codigo = generarCodigoUnico();

    const transaction = {
        codigo,
        transactionType,
        associatedType,
        transactionValue,
        relatedAccount,
        transactionDate: formattedDate,
        description,
        attachment: attachment ? attachment.src : null
    };

    const table = document.getElementById('transactionsTable');
    const row = table.insertRow();
    row.insertCell(0).innerText = transactionType;
    row.insertCell(1).innerText = associatedType;
    row.insertCell(2).innerText = transactionValue;
    row.insertCell(3).innerText = relatedAccount;
    row.insertCell(4).innerText = formattedDate;
    row.insertCell(5).innerText = description;

    const attachmentCell = row.insertCell(6);
    if (attachment) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            attachmentCell.appendChild(img);
            saveToLocalStorage(transaction);
        };
        reader.readAsDataURL(attachment);
    } else {
        attachmentCell.innerText = 'No hay archivo adjunto';
        saveToLocalStorage(transaction);
    }

    const actionsCell = row.insertCell(7);
    actionsCell.innerHTML = `
        <div class="action-buttons">
            <button class="btn-edit" onclick="editTransaction(this)">Editar</button>
            <button class="btn-delete" onclick="deleteTransaction(this, '${codigo}')">Eliminar</button>
            <button class="btn-update" onclick="updateTransaction(this)">Actualizar</button>
        </div>
    `;

    showAlert('Transacción guardada correctamente.', 'success');
    clearForm();

    // Actualizar el saldo de la cuenta
    updateAccountBalance(transaction);

    // Sincronizar con tipos de ingresos y egresos
    sincronizarConTipos(transaction);
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function clearForm() {
    document.getElementById('transactionForm').reset();
    isEditing = false;
    currentEditingRow = null;
}

function editTransaction(button) {
    const row = button.parentElement.parentElement.parentElement;
    document.getElementById('transactionType').value = row.cells[0].innerText;
    document.getElementById('associatedType').value = row.cells[1].innerText;
    document.getElementById('transactionValue').value = row.cells[2].innerText;
    document.getElementById('relatedAccount').value = row.cells[3].innerText;
    document.getElementById('transactionDate').value = formatDateToInput(row.cells[4].innerText);
    document.getElementById('description').value = row.cells[5].innerText;

    isEditing = true;
    currentEditingRow = row;
}

function formatDateToInput(dateString) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
}

function deleteTransaction(button, codigo) {
    const row = button.parentElement.parentElement.parentElement;
    document.getElementById('transactionsTable').deleteRow(row.rowIndex - 1);

    // Eliminar de localStorage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(t => t.codigo !== codigo);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Emitir evento de sincronización
    localStorage.setItem('transactionDeleted', JSON.stringify({ codigo, timestamp: new Date().getTime() }));

    // Eliminar de tipos de ingresos y egresos
    let tiposIngresosEgresos = JSON.parse(localStorage.getItem('tiposIngresosEgresos')) || [];
    tiposIngresosEgresos = tiposIngresosEgresos.filter(t => t.codigo !== codigo);
    localStorage.setItem('tiposIngresosEgresos', JSON.stringify(tiposIngresosEgresos));

    showAlert('Transacción eliminada correctamente.', 'info');
}

function updateTransaction(button) {
    if (!isEditing || !currentEditingRow) {
        showAlert('Debe seleccionar una transacción para actualizar.', 'warning');
        return;
    }

    const transactionType = document.getElementById('transactionType').value;
    const associatedType = document.getElementById('associatedType').value;
    const transactionValue = parseFloat(document.getElementById('transactionValue').value);
    const relatedAccount = document.getElementById('relatedAccount').value;
    const transactionDate = document.getElementById('transactionDate').value;
    const description = document.getElementById('description').value;

    if (!transactionType || !associatedType || !transactionValue || !relatedAccount || !transactionDate) {
        showAlert('Todos los campos deben estar llenos, excepto el adjunto.', 'warning');
        return;
    }

    currentEditingRow.cells[0].innerText = transactionType;
    currentEditingRow.cells[1].innerText = associatedType;
    currentEditingRow.cells[2].innerText = transactionValue;
    currentEditingRow.cells[3].innerText = relatedAccount;
    currentEditingRow.cells[4].innerText = formatDate(transactionDate);
    currentEditingRow.cells[5].innerText = description;

    const codigo = currentEditingRow.cells[0].innerText;

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionIndex = transactions.findIndex(t => t.codigo === codigo);
    if (transactionIndex !== -1) {
        transactions[transactionIndex] = {
            codigo,
            transactionType,
            associatedType,
            transactionValue,
            relatedAccount,
            transactionDate: formatDate(transactionDate),
            description,
            attachment: currentEditingRow.cells[6].querySelector('img') ? currentEditingRow.cells[6].querySelector('img').src : null
        };
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    isEditing = false;
    currentEditingRow = null;

    showAlert('Transacción actualizada correctamente.', 'success');

    // Actualizar el saldo de la cuenta
    updateAccountBalance({transactionType, transactionValue, relatedAccount});
}

function saveToLocalStorage(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    if (transactions) {
        const table = document.getElementById('transactionsTable');
        table.innerHTML = ''; // Limpiar tabla antes de cargar datos
        transactions.forEach(transaction => {
            const row = table.insertRow();
            row.insertCell(0).innerText = transaction.transactionType;
            row.insertCell(1).innerText = transaction.associatedType;
            row.insertCell(2).innerText = transaction.transactionValue;
            row.insertCell(3).innerText = transaction.relatedAccount;
            row.insertCell(4).innerText = transaction.transactionDate;
            row.insertCell(5).innerText = transaction.description;
            const attachmentCell = row.insertCell(6);
            if (transaction.attachment) {
                const img = document.createElement('img');
                img.src = transaction.attachment;
                attachmentCell.appendChild(img);
            } else {
                attachmentCell.innerText = 'No hay archivo adjunto';
            }
            const actionsCell = row.insertCell(7);
            actionsCell.innerHTML = `
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editTransaction(this)">Editar</button>
                    <button class="btn-delete" onclick="deleteTransaction(this, '${transaction.codigo}')">Eliminar</button>
                    <button class="btn-update" onclick="updateTransaction(this)">Actualizar</button>
                </div>
            `;
        });
    }
}

function accountExists(accountNumber) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    return accounts.some(account => account.accountNumber === accountNumber);
}

function generarCodigoUnico() {
    return 'ID' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function sincronizarConTipos(transaction) {
    let tiposIngresosEgresos = JSON.parse(localStorage.getItem('tiposIngresosEgresos')) || [];
    tiposIngresosEgresos.push({
        codigo: transaction.codigo,
        nombre: transaction.associatedType,
        descripcion: transaction.description,
        tipo: transaction.transactionType,
        categoria: transaction.categoria || ''
    });
    localStorage.setItem('tiposIngresosEgresos', JSON.stringify(tiposIngresosEgresos));
}

function updateAccountBalance(transaction) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountIndex = accounts.findIndex(acc => acc.accountNumber === transaction.relatedAccount);

    if (accountIndex !== -1) {
        if (transaction.transactionType === 'ingreso') {
            accounts[accountIndex].currentBalance = parseFloat(accounts[accountIndex].currentBalance) + transaction.transactionValue;
        } else if (transaction.transactionType === 'egreso') {
            accounts[accountIndex].currentBalance = parseFloat(accounts[accountIndex].currentBalance) - transaction.transactionValue;
        }
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
}

window.onload = loadFromLocalStorage;
