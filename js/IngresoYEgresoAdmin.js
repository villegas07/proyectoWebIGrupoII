let tiposIngresosEgresos = JSON.parse(localStorage.getItem('tiposIngresosEgresos')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function guardarEnLocalStorage() {
    localStorage.setItem('tiposIngresosEgresos', JSON.stringify(tiposIngresosEgresos));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function cargarTipos() {
    const listaEntradas = document.getElementById('listaEntradas');
    listaEntradas.innerHTML = '';

    tiposIngresosEgresos.forEach(tipo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${tipo.codigo}</td>
            <td>${tipo.nombre}</td>
            <td>${tipo.descripcion}</td>
            <td>${tipo.tipo}</td>
            <td>${tipo.categoria}</td>
            <td>
                <button class="btn btn-edit" onclick="editarTipo('${tipo.codigo}')">Editar</button>
                <button class="btn2" class="btn btn-delete" onclick="eliminarTipo('${tipo.codigo}')">Eliminar</button>
            </td>
        `;
        listaEntradas.appendChild(fila);
    });
}

function agregarTipo() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const codigo = generarCodigoUnico();

    tiposIngresosEgresos.push({ codigo, nombre, descripcion, tipo, categoria });
    guardarEnLocalStorage();
    limpiarFormulario();
    cargarTipos();
}

function editarTipo(codigo) {
    const tipo = tiposIngresosEgresos.find(t => t.codigo === codigo);

    document.getElementById('codigo').value = tipo.codigo;
    document.getElementById('nombre').value = tipo.nombre;
    document.getElementById('descripcion').value = tipo.descripcion;
    document.getElementById('tipo').value = tipo.tipo;
    document.getElementById('categoria').value = tipo.categoria;

    document.getElementById('actualizarButton').style.display = 'block';
    document.getElementById('guardarButton').style.display = 'none';
}

function actualizarTipo() {
    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;

    const tipoIndex = tiposIngresosEgresos.findIndex(t => t.codigo === codigo);
    if (tipoIndex !== -1) {
        tiposIngresosEgresos[tipoIndex] = { codigo, nombre, descripcion, tipo, categoria };
    }

    // Actualizar transacción asociada
    const transIndex = transactions.findIndex(t => t.codigo === codigo);
    if (transIndex !== -1) {
        transactions[transIndex].associatedType = nombre;
        transactions[transIndex].description = descripcion;
        transactions[transIndex].transactionType = tipo;
    }

    guardarEnLocalStorage();
    limpiarFormulario();
    cargarTipos();
}

function eliminarTipo(codigo) {
    tiposIngresosEgresos = tiposIngresosEgresos.filter(t => t.codigo !== codigo);
    transactions = transactions.filter(t => t.codigo !== codigo);
    guardarEnLocalStorage();
    cargarTipos();
}

function limpiarFormulario() {
    document.getElementById('codigo').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('categoria').value = '';

    document.getElementById('actualizarButton').style.display = 'none';
    document.getElementById('guardarButton').style.display = 'block';
}

function generarCodigoUnico() {
    return 'ID' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function sincronizarConTransacciones() {
    transactions.forEach(transaction => {
        const codigoExistente = tiposIngresosEgresos.some(t => t.codigo === transaction.codigo);
        if (!codigoExistente) {
            const codigo = transaction.codigo;  // Usar el código generado en la transacción
            tiposIngresosEgresos.push({
                codigo: codigo,
                nombre: transaction.associatedType,
                descripcion: transaction.description,
                tipo: transaction.transactionType,
                categoria: transaction.categoria || ''
            });
        }
    });
    guardarEnLocalStorage();
    cargarTipos();
}

window.onload = () => {
    sincronizarConTransacciones();
    cargarTipos();
};
