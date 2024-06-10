
const ctx = document.getElementById('resultsChart').getContext('2d');
const resultsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Costos', 'Gastos', 'Valor de Venta', 'Ganancias/Pérdidas'],
        datasets: [{
            label: 'Análisis de Gastos',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateResults();
});

function calculateResults() {
    const cost = parseFloat(document.getElementById('cost').value);
    const expenses = parseFloat(document.getElementById('expenses').value);
    const saleValue = parseFloat(document.getElementById('saleValue').value);
    
    const totalCost = cost + expenses;
    const profitLoss = saleValue - totalCost;

    // Actualizar la gráfica
    resultsChart.data.datasets[0].data = [cost, expenses, saleValue, profitLoss];
    resultsChart.update();

    // Mostrar resultado
    document.getElementById('results').innerText = `Resultado: ${profitLoss >= 0 ? 'Ganancia' : 'Pérdida'} de ${profitLoss.toFixed(2)}`;
}