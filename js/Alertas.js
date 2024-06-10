document.getElementById('alertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addAlert();
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

function addAlert() {
    const alertType = document.getElementById('alertType').value;
    const alertDescription = document.getElementById('alertDescription').value;
    const alertDateTime = document.getElementById('alertDateTime').value;
    const repeatOptions = document.getElementById('repeatOptions').value;

    if (!alertType || !alertDescription || !alertDateTime || !repeatOptions) {
        showAlert('Todos los campos son obligatorios.', 'warning');
        return;
    }

    const table = document.getElementById('alertsTable');
    const row = table.insertRow();
    row.insertCell(0).innerText = alertType;
    row.insertCell(1).innerText = alertDescription;
    row.insertCell(2).innerText = alertDateTime;
    row.insertCell(3).innerText = repeatOptions;
    const actionsCell = row.insertCell(4);
    actionsCell.innerHTML = `
        <div class="action-buttons">
            <button class="btn btn-edit" onclick="editAlert(this)">Editar</button>
            <button class="btn btn-delete" onclick="deleteAlert(this)">Eliminar</button>
            <button class="btn btn-update" onclick="updateAlert(this)">Actualizar</button>
        </div>
    `;

    saveToLocalStorage();
    showAlert('Alerta guardada correctamente.', 'success');
    clearForm();
}

function clearForm() {
    document.getElementById('alertForm').reset();
    isEditing = false;
    currentEditingRow = null;
    document.querySelector('.btn-save').disabled = false;
}

function editAlert(button) {
    const row = button.parentElement.parentElement.parentElement;
    document.getElementById('alertType').value = row.cells[0].innerText;
    document.getElementById('alertDescription').value = row.cells[1].innerText;
    document.getElementById('alertDateTime').value = row.cells[2].innerText;
    document.getElementById('repeatOptions').value = row.cells[3].innerText;

    document.querySelector('.btn-save').disabled = true;

    isEditing = true;
    currentEditingRow = row;
}

function deleteAlert(button) {
    const row = button.parentElement.parentElement.parentElement;
    document.getElementById('alertsTable').deleteRow(row.rowIndex - 1);
    saveToLocalStorage();
    showAlert('Alerta eliminada correctamente.', 'info');
}

function updateAlert(button) {
    if (!isEditing || !currentEditingRow) {
        showAlert('Debe seleccionar una alerta para actualizar.', 'warning');
        return;
    }

    const alertType = document.getElementById('alertType').value;
    const alertDescription = document.getElementById('alertDescription').value;
    const alertDateTime = document.getElementById('alertDateTime').value;
    const repeatOptions = document.getElementById('repeatOptions').value;

    if (!alertType || !alertDescription || !alertDateTime || !repeatOptions) {
        showAlert('Todos los campos son obligatorios.', 'warning');
        return;
    }

    currentEditingRow.cells[0].innerText = alertType;
    currentEditingRow.cells[1].innerText = alertDescription;
    currentEditingRow.cells[2].innerText = alertDateTime;
    currentEditingRow.cells[3].innerText = repeatOptions;

    saveToLocalStorage();
    showAlert('Alerta actualizada correctamente.', 'success');
    clearForm();
}

function saveToLocalStorage() {
    const table = document.getElementById('alertsTable');
    const rows = table.rows;
    const alerts = [];
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const alert = {
            alertType: cells[0].innerText,
            alertDescription: cells[1].innerText,
            alertDateTime: cells[2].innerText,
            repeatOptions: cells[3].innerText,
            notified: false
        };
        alerts.push(alert);
    }
    localStorage.setItem('alerts', JSON.stringify(alerts));
}

function loadFromLocalStorage() {
    const alerts = JSON.parse(localStorage.getItem('alerts'));
    if (alerts) {
        const table = document.getElementById('alertsTable');
        alerts.forEach(alert => {
            const row = table.insertRow();
            row.insertCell(0).innerText = alert.alertType;
            row.insertCell(1).innerText = alert.alertDescription;
            row.insertCell(2).innerText = alert.alertDateTime;
            row.insertCell(3).innerText = alert.repeatOptions;
            const actionsCell = row.insertCell(4);
            actionsCell.innerHTML = `
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editAlert(this)">Editar</button>
                    <button class="btn btn-delete" onclick="deleteAlert(this)">Eliminar</button>
                    <button class="btn btn-update" onclick="updateAlert(this)">Actualizar</button>
                </div>
            `;
        });
    }
}

function checkNotifications() {
    const alerts = JSON.parse(localStorage.getItem('alerts')) || [];
    const now = new Date();
    let notificationCount = 0;
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '';

    alerts.forEach(alert => {
        const alertDate = new Date(alert.alertDateTime);
        if (alertDate <= now && !alert.notified) {
            notificationCount++;
            alert.notified = true;

            const li = document.createElement('li');
            li.innerHTML = `<a href="Alertas.html"><strong>${alert.alertType}</strong>: ${alert.alertDescription}</a>`;
            notificationsList.appendChild(li);
        }
    });

    if (notificationCount > 0) {
        document.getElementById('notificationBadge').innerText = notificationCount;
        document.getElementById('notificationBadge').style.display = 'inline';
    }

    localStorage.setItem('alerts', JSON.stringify(alerts));
}

function setReloadForAlerts() {
    const alerts = JSON.parse(localStorage.getItem('alerts')) || [];
    const now = new Date();

    alerts.forEach(alert => {
        const alertDate = new Date(alert.alertDateTime);
        if (alertDate > now && !alert.notified) {
            const timeUntilAlert = alertDate - now;
            setTimeout(() => {
                location.reload();
            }, timeUntilAlert);
        }
    });
}

function toggleNotificationsMenu() {
    const menu = document.getElementById('notificationsMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

    if (menu.style.display === 'block') {
        document.getElementById('notificationBadge').style.display = 'none';
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function logout() {
    window.location.href = '../index.html';
}

function switchAccount() {
    window.location.href = '../index.html';
}

document.getElementById('notificationIcon').addEventListener('click', toggleNotificationsMenu);
document.getElementById('userIcon').addEventListener('click', toggleUserMenu);
document.getElementById('logout').addEventListener('click', logout);
document.getElementById('switchAccount').addEventListener('click', switchAccount);

window.onload = function() {
    loadFromLocalStorage();
    checkNotifications();
    setReloadForAlerts();
    setInterval(checkNotifications, 60000);
};
