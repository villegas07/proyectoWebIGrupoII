
const records = [];

document.getElementById('recordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addRecord();
});

document.getElementById('downloadRecords').addEventListener('click', function() {
    downloadFilteredRecords();
});

function addRecord() {
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);

    records.push({ date, type, amount });
    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById('recordsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    records.forEach(record => {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).innerText = record.date;
        newRow.insertCell(1).innerText = record.type;
        newRow.insertCell(2).innerText = record.amount.toFixed(2);
    });
}

function downloadFilteredRecords() {
    const period = document.getElementById('period').value;
    const filteredRecords = filterRecordsByPeriod(period);

    let csvContent = "Fecha,Tipo,Monto\n";

    filteredRecords.forEach(record => {
        let rowArray = [record.date, record.type, record.amount.toFixed(2)];
        csvContent += rowArray.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registros_${period}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function filterRecordsByPeriod(period) {
    const today = new Date();
    let filteredRecords = [];

    if (period === 'diario') {
        filteredRecords = records.filter(record => isSameDay(new Date(record.date), today));
    } else if (period === 'semanal') {
        filteredRecords = records.filter(record => isSameWeek(new Date(record.date), today));
    } else if (period === 'mensual') {
        filteredRecords = records.filter(record => isSameMonth(new Date(record.date), today));
    }

    return filteredRecords;
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function isSameWeek(date1, date2) {
    const startOfWeek = getStartOfWeek(date2);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return date1 >= startOfWeek && date1 <= endOfWeek;
}

function getStartOfWeek(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
}

function isSameMonth(date1, date2) {
    return date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}