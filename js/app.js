document.addEventListener('DOMContentLoaded', () => {
    cargarComponente('dashboard');
});

function cargarComponente(componente) {
    const contenidoPrincipal = document.getElementById('contenido-principal');
    contenidoPrincipal.innerHTML = '';

    switch (componente) {
        case 'dashboard':
            contenidoPrincipal.innerHTML = obtenerHtmlDashboard();
            break;
        case 'gestionCuentas':
            contenidoPrincipal.innerHTML = obtenerHtmlGestionCuentas();
            cargarCuentas();
            break;
        case 'gestionTipos':
            contenidoPrincipal.innerHTML = obtenerHtmlGestionTipos();
            cargarTipos();
            break;
        case 'gestionTransacciones':
            contenidoPrincipal.innerHTML = obtenerHtmlGestionTransacciones();
            cargarTiposEnTransacciones();
            cargarCuentasEnTransacciones();
            cargarTransacciones();
            break;
        case 'gestionAlertas':
            contenidoPrincipal.innerHTML = obtenerHtmlGestionAlertas();
            cargarAlertas();
            break;
        case 'analisisGastos':
            contenidoPrincipal.innerHTML = obtenerHtmlAnalisisGastos();
            break;
        case 'descargaRegistros':
            contenidoPrincipal.innerHTML = obtenerHtmlDescargaRegistros();
            break;
    }
}

function obtenerHtmlDashboard() {
    return `
        <h2>Inicio</h2>
        <p>Bienvenido a tu aplicación financiera personal. Utiliza el menú para navegar entre las diferentes secciones.</p>
    `;
}

function obtenerHtmlGestionCuentas() {
    return `
        <h2>Gestión de Cuentas</h2>
        <form id="formulario-cuenta">
            <input type="text" id="numero-cuenta" placeholder="Número de Cuenta" required>
            <input type="text" id="nombre-banco" placeholder="Nombre del Banco" required>
            <select id="tipo-cuenta" required>
                <option value="">Seleccionar Tipo de Cuenta</option>
                <option value="corriente">Corriente</option>
                <option value="ahorros">Ahorros</option>
                <option value="inversion">Inversión</option>
            </select>
            <input type="number" id="saldo-actual" placeholder="Saldo Actual" required>
            <select id="estado-cuenta" required>
                <option value="">Seleccionar Estado de la Cuenta</option>
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
                <option value="cerrada">Cerrada</option>
            </select>
            <input type="date" id="fecha-apertura">
            <textarea id="descripcion" placeholder="Descripción"></textarea>
            <button type="submit">Agregar Cuenta</button>
        </form>
        <div id="lista-cuentas"></div>
    `;
}

function obtenerHtmlGestionTipos() {
    return `
        <h2>Gestión de Tipos de Ingresos/Egresos</h2>
        <form id="formulario-tipo">
            <input type="text" id="codigo-tipo" placeholder="Código del Tipo" required>
            <input type="text" id="nombre-tipo" placeholder="Nombre del Tipo" required>
            <textarea id="descripcion-tipo" placeholder="Descripción"></textarea>
            <select id="tipo" required>
                <option value="">Seleccionar Tipo</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
            </select>
            <input type="text" id="categoria-tipo" placeholder="Categoría">
            <button type="submit">Agregar Tipo</button>
        </form>
        <div id="lista-tipos"></div>
    `;
}

function obtenerHtmlGestionTransacciones() {
    return `
        <h2>Gestión de Transacciones</h2>
        <form id="formulario-transaccion">
            <select id="tipo-transaccion" required>
                <option value="">Seleccionar Tipo de Transacción</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
            </select>
            <select id="tipo-ingreso-egreso" required>
                <option value="">Seleccionar Tipo de Ingreso/Egreso</option>
            </select>
            <input type="number" id="valor-transaccion" placeholder="Valor" required>
            <select id="cuenta-bancaria" required>
                <option value="">Seleccionar Cuenta Bancaria</option>
            </select>
            <input type="date" id="fecha-transaccion" required>
            <textarea id="descripcion-transaccion" placeholder="Descripción"></textarea>
            <button type="submit">Agregar Transacción</button>
        </form>
        <div id="lista-transacciones"></div>
    `;
}

function obtenerHtmlGestionAlertas() {
    return `
        <h2>Gestión de Alertas</h2>
        <form id="formulario-alerta">
            <input type="text" id="tipo-alerta" placeholder="Tipo de Alerta" required>
            <textarea id="descripcion-alerta" placeholder="Descripción" required></textarea>
            <input type="datetime-local" id="fecha-alerta" required>
            <select id="repeticion-alerta">
                <option value="">Seleccionar Repetición</option>
                <option value="una vez">Una vez</option>
                <option value="diariamente">Diariamente</option>
                <option value="semanalmente">Semanalmente</option>
                <option value="mensualmente">Mensualmente</option>
            </select>
            <button type="submit">Agregar Alerta</button>
        </form>
        <div id="lista-alertas"></div>
    `;
}

function obtenerHtmlAnalisisGastos() {
    return `
        <h2>Análisis de Gastos</h2>
        <p>Aquí podrás ver un análisis detallado de tus gastos, ingresos, y evaluar tus ganancias y pérdidas.</p>
        <!-- Contenido dinámico del análisis de gastos -->
    `;
}

function obtenerHtmlDescargaRegistros() {
    return `
        <h2>Descargar Registros</h2>
        <p>Aquí podrás descargar el registro de ingresos y egresos (mensuales, semanales y diarios).</p>
        <!-- Contenido dinámico para descarga de registros -->
    `;
}

document.addEventListener('submit', (event) => {
    event.preventDefault();
    const formId = event.target.id;

    switch (formId) {
        case 'formulario-cuenta':
            agregarCuenta();
            break;
        case 'formulario-tipo':
            agregarTipo();
            break;
        case 'formulario-transaccion':
            agregarTransaccion();
            break;
        case 'formulario-alerta':
            agregarAlerta();
            break;
    }
});

function agregarCuenta() {
    const cuenta = {
        numeroCuenta: document.getElementById('numero-cuenta').value,
        nombreBanco: document.getElementById('nombre-banco').value,
        tipoCuenta: document.getElementById('tipo-cuenta').value,
        saldoActual: document.getElementById('saldo-actual').value,
        estadoCuenta: document.getElementById('estado-cuenta').value,
        fechaApertura: document.getElementById('fecha-apertura').value,
        descripcion: document.getElementById('descripcion').value
    };
    
    let cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
    cuentas.push(cuenta);
    localStorage.setItem('cuentas', JSON.stringify(cuentas));
    alert('Cuenta agregada exitosamente');
    cargarCuentas();
}

function agregarTipo() {
    const tipo = {
        codigo: document.getElementById('codigo-tipo').value,
        nombre: document.getElementById('nombre-tipo').value,
        descripcion: document.getElementById('descripcion-tipo').value,
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria-tipo').value
    };

    let tipos = JSON.parse(localStorage.getItem('tipos')) || [];
    tipos.push(tipo);
    localStorage.setItem('tipos', JSON.stringify(tipos));
    alert('Tipo agregado exitosamente');
    cargarTipos();
}

function agregarTransaccion() {
    const transaccion = {
        tipo: document.getElementById('tipo-transaccion').value,
        tipoIngresoEgreso: document.getElementById('tipo-ingreso-egreso').value,
        valor: document.getElementById('valor-transaccion').value,
        cuentaBancaria: document.getElementById('cuenta-bancaria').value,
        fecha: document.getElementById('fecha-transaccion').value,
        descripcion: document.getElementById('descripcion-transaccion').value
    };

    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    transacciones.push(transaccion);
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    alert('Transacción agregada exitosamente');
    cargarTransacciones();
}

function agregarAlerta() {
    const alerta = {
        tipo: document.getElementById('tipo-alerta').value,
        descripcion: document.getElementById('descripcion-alerta').value,
        fecha: document.getElementById('fecha-alerta').value,
        repeticion: document.getElementById('repeticion-alerta').value
    };

    let alertas = JSON.parse(localStorage.getItem('alertas')) || [];
    alertas.push(alerta);
    localStorage.setItem('alertas', JSON.stringify(alertas));
    alert('Alerta agregada exitosamente');
    cargarAlertas();
}

function cargarCuentas() {
    const listaCuentas = document.getElementById('lista-cuentas');
    const cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
    listaCuentas.innerHTML = '';
    cuentas.forEach(cuenta => {
        listaCuentas.innerHTML += `<p>${cuenta.numeroCuenta} - ${cuenta.nombreBanco} - ${cuenta.tipoCuenta} - ${cuenta.saldoActual} - ${cuenta.estadoCuenta} - ${cuenta.fechaApertura} - ${cuenta.descripcion}</p>`;
    });
}

function cargarTipos() {
    const listaTipos = document.getElementById('lista-tipos');
    const tipos = JSON.parse(localStorage.getItem('tipos')) || [];
    listaTipos.innerHTML = '';
    tipos.forEach(tipo => {
        listaTipos.innerHTML += `<p>${tipo.codigo} - ${tipo.nombre} - ${tipo.descripcion} - ${tipo.tipo} - ${tipo.categoria}</p>`;
    });
}

function cargarTransacciones() {
    const listaTransacciones = document.getElementById('lista-transacciones');
    const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    listaTransacciones.innerHTML = '';
    transacciones.forEach(transaccion => {
        listaTransacciones.innerHTML += `<p>${transaccion.tipo} - ${transaccion.tipoIngresoEgreso} - ${transaccion.valor} - ${transaccion.cuentaBancaria} - ${transaccion.fecha} - ${transaccion.descripcion}</p>`;
    });
}

function cargarAlertas() {
    const listaAlertas = document.getElementById('lista-alertas');
    const alertas = JSON.parse(localStorage.getItem('alertas')) || [];
    listaAlertas.innerHTML = '';
    alertas.forEach(alerta => {
        listaAlertas.innerHTML += `<p>${alerta.tipo} - ${alerta.descripcion} - ${alerta.fecha} - ${alerta.repeticion}</p>`;
    });
}

function cargarTiposEnTransacciones() {
    const selectTipo = document.getElementById('tipo-ingreso-egreso');
    const tipos = JSON.parse(localStorage.getItem('tipos')) || [];
    selectTipo.innerHTML = '<option value="">Seleccionar Tipo de Ingreso/Egreso</option>';
    tipos.forEach(tipo => {
        selectTipo.innerHTML += `<option value="${tipo.codigo}">${tipo.nombre}</option>`;
    });
}

function cargarCuentasEnTransacciones() {
    const selectCuenta = document.getElementById('cuenta-bancaria');
    const cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
    selectCuenta.innerHTML = '<option value="">Seleccionar Cuenta Bancaria</option>';
    cuentas.forEach(cuenta => {
        selectCuenta.innerHTML += `<option value="${cuenta.numeroCuenta}">${cuenta.nombreBanco}</option>`;
    });
}
