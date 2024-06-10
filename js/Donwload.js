document.getElementById('recordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addRecord();
});

document.getElementById('downloadRecords').addEventListener('click', () => {
    const period = document.getElementById('period').value;
    if (period === 'todo') {
        generatePDF(records, period, 'reporte_completo.pdf');
    } else {
        const filteredRecords = filterRecordsByPeriod(records, period);
        generatePDF(filteredRecords, period, `reporte_${period}.pdf`);
    }
});

let records = [];

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

function addRecord() {
    const date = new Date(document.getElementById('date').value);
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);

    const record = { date, type, amount, codigo: generarCodigoUnico() };
    records.push(record);
    saveRecordsToLocalStorage();

    addRecordToTable(record);
    showAlert('Registro agregado correctamente.', 'success');
    document.getElementById('recordForm').reset();
}

function addRecordToTable(record) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${record.date.toLocaleDateString()}</td>
        <td>${record.type}</td>
        <td>${record.amount.toFixed(2)}</td>
    `;
    row.dataset.codigo = record.codigo;
    document.getElementById('recordsTable').getElementsByTagName('tbody')[0].appendChild(row);
}

function clearRecordsTable() {
    const tbody = document.getElementById('recordsTable').getElementsByTagName('tbody')[0];
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function saveRecordsToLocalStorage() {
    localStorage.setItem('records', JSON.stringify(records));
}

function loadRecordsFromLocalStorage() {
    const storedRecords = JSON.parse(localStorage.getItem('records'));
    if (storedRecords) {
        records = storedRecords.map(record => ({
            ...record,
            date: new Date(record.date)
        }));
        records.forEach(addRecordToTable);
    }
}

function filterRecordsByPeriod(records, period) {
    const today = new Date();
    const startDate = getStartDateForPeriod(today, period);
    return records.filter(record => record.date >= startDate && record.date <= today);
}

function getStartDateForPeriod(endDate, period) {
    switch (period) {
        case 'diario':
            return new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        case 'semanal':
            return new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 6);
        case 'mensual':
            return new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        case 'todo':
            return new Date(0); // Desde el inicio de los tiempos (o un valor muy bajo)
        default:
            return new Date();
    }
}

function generatePDF(records, period, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const title = period === 'todo' ? 'Reporte Completo de Ingresos y Egresos' : `Reporte de Ingresos y Egresos (${period})`;
    const startDate = getStartDateForPeriod(new Date(), period).toLocaleDateString();
    const endDate = new Date().toLocaleDateString();
    const headers = [['Fecha', 'Tipo', 'Monto']];
    const data = records.map(record => [record.date.toLocaleDateString(), record.type, record.amount.toFixed(2)]);

    doc.setFontSize(18);
    doc.text(title, 20, 20);
    if (period !== 'todo') {
        doc.setFontSize(12);
        doc.text(`Periodo: ${startDate} - ${endDate}`, 20, 30);
    }

    doc.autoTable({
        startY: 40,
        head: headers,
        body: data,
        styles: { fontSize: 10 },
        columnStyles: { 0: { halign: 'center' }, 2: { halign: 'right' } },
        margin: { top: 40 }
    });

    doc.save(filename);
}

function loadTransactionData() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    clearRecordsTable(); // Clear the table before loading data
    records = []; // Clear the records array
    transactions.forEach(transaction => {
        const dateParts = transaction.transactionDate.split('-');
        const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        const record = {
            date,
            type: transaction.transactionType,
            amount: transaction.transactionValue,
            codigo: transaction.codigo
        };
        records.push(record);
        addRecordToTable(record);
    });
    saveRecordsToLocalStorage();
}

function deleteRecord(codigo) {
    records = records.filter(record => record.codigo !== codigo);
    saveRecordsToLocalStorage();
    clearRecordsTable();
    records.forEach(addRecordToTable);
}

window.onload = () => {
    loadRecordsFromLocalStorage();
    loadTransactionData();
};

window.addEventListener('storage', (event) => {
    if (event.key === 'transactionDeleted') {
        const { codigo } = JSON.parse(event.newValue);
        deleteRecord(codigo);
    }
});

function generarCodigoUnico() {
    return 'ID' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
