// Definir los costos de los trámites
const costos = {
    comun: 100,
    urgente: 200,
    online: 50
};

// Cargar turnos desde LocalStorage si existen
let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

let turnoActual = null; // Para almacenar el turno actual y hacer el pago

// Función para otorgar un turno
function otorgarTurno(nombre, tipoTramite) {
    // Validar que el tipo de trámite exista en los costos
    if (!costos[tipoTramite]) {
        document.getElementById('mensaje').textContent = "Tipo de trámite no válido.";
        return false;
    }

    let costo = costos[tipoTramite];
    let nuevoTurno = {
        nombre: nombre,
        tramite: tipoTramite,
        costo: costo,
        fecha: new Date().toLocaleString()
    };

    turnoActual = nuevoTurno; // Guardar turno actual para procesar el pago
    mostrarFormularioPago(costo); // Mostrar el formulario de pago

    document.getElementById('mensaje').textContent = `Turno otorgado a ${nombre} para el trámite ${tipoTramite}. Proceda a realizar el pago.`;
    return true;
}

// Función para mostrar el formulario de pago
function mostrarFormularioPago(costo) {
    document.getElementById('monto-pago').textContent = `$${costo}`;
    document.getElementById('pago').style.display = 'block';
}

// Función para realizar el pago y generar la orden
function realizarPago() {
    if (turnoActual) {
        turnos.push(turnoActual); // Agregar el turno actual a la lista de turnos
        localStorage.setItem('turnos', JSON.stringify(turnos)); // Guardar en LocalStorage
        mostrarTurnos(); // Actualizar la lista de turnos en el DOM
        generarOrden(); // Generar la orden

        turnoActual = null; // Resetear turno actual después del pago
        document.getElementById('pago').style.display = 'none'; // Ocultar la sección de pago
    }
}

// Función para generar una orden
function generarOrden() {
    let numeroOrden = Math.floor(Math.random() * 1000000); // Generar número de orden aleatorio
    document.getElementById('numero-orden').textContent = numeroOrden;

    // Mostrar detalles del turno en la orden
    let listaDetalles = document.getElementById('detalles-orden');
    listaDetalles.innerHTML = ''; // Limpiar la lista de detalles
    let li = document.createElement('li');
    li.textContent = `Nombre: ${turnos[turnos.length - 1].nombre}, Trámite: ${turnos[turnos.length - 1].tramite}, Costo: $${turnos[turnos.length - 1].costo}, Fecha: ${turnos[turnos.length - 1].fecha}`;
    listaDetalles.appendChild(li);

    document.getElementById('orden').style.display = 'block'; // Mostrar la orden
}

// Función para mostrar los turnos en el DOM
function mostrarTurnos() {
    let listaTurnos = document.getElementById("lista-turnos");
    listaTurnos.innerHTML = ''; // Limpiar la lista de turnos
    turnos.forEach((turno, index) => {
        let li = document.createElement('li');
        li.textContent = `Turno ${index + 1}: ${turno.nombre} - ${turno.tramite} - $${turno.costo} - ${turno.fecha}`;
        listaTurnos.appendChild(li);
    });
}

// Evento del botón "Solicitar Turno"
document.getElementById("solicitar-turno").addEventListener("click", function() {
    let nombre = document.getElementById("nombre").value;
    let tramite = document.getElementById("tramite").value;

    if (nombre.trim() === "") {
        document.getElementById('mensaje').textContent = "Por favor, ingresa tu nombre.";
    } else {
        otorgarTurno(nombre, tramite);
    }
});

// Evento del botón "Realizar Pago"
document.getElementById("realizar-pago").addEventListener("click", realizarPago);

// Mostrar los turnos al cargar la página
mostrarTurnos();
