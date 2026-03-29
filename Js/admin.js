const API_URL = "https://backend-ep0u.onrender.com";

// Cargar pedidos
function cargarPedidos() {
    fetch(`${API_URL}/pedidos`)
    .then(res => res.json())
    .then(data => {
        const tabla = document.querySelector("#tablaPedidos tbody");
        tabla.innerHTML = "";

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(p => {
                const fila = `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.nombre_cliente}</td>
                        <td>${p.direccion}</td>
                        <td>${p.numero_menu}</td>
                        <td>${p.cantidad}</td>
                        <td><span class="estado-${p.estado.toLowerCase().replace(/\s+/g, '-')}">${p.estado}</span></td>
                        <td class="columna-acciones">
                            <select onchange="cambiarEstado(${p.id}, this.value)">
                                <option value="">Cambiar estado</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Preparado sin pagar">Preparado sin pagar</option>
                                <option value="Preparado y pagado">Preparado y pagado</option>
                                <option value="Pendiente de pagar">Pendiente de pagar</option>
                                <option value="Entregado">Entregado</option>
                            </select>
                            <button onclick="confirmarEliminar(${p.id})">🗑️</button>
                        </td>
                    </tr>
                `;
                tabla.innerHTML += fila;
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="7">No hay pedidos</td></tr>';
        }

        actualizarContadorPedidos();
    })
    .catch(error => {
        console.error(error);
    });
}

// Contador
function actualizarContadorPedidos() {
    fetch(`${API_URL}/pedidos/count`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
}

// Cambiar estado
function cambiarEstado(id, estado) {
    if (!estado) return;

    fetch(`${API_URL}/pedido/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, estado })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            cargarPedidos();
        }
    });
}

// Eliminar
function confirmarEliminar(id) {
    if (confirm("¿Eliminar pedido?")) {
        eliminarPedido(id);
    }
}

function eliminarPedido(id) {
    fetch(`${API_URL}/pedido`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            cargarPedidos();
        }
    });
}

// Guardar límite
function guardarLimite() {
    const limite = document.getElementById("limite").value;

    fetch(`${API_URL}/limite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ limite: parseInt(limite) })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            cargarPedidos();
        }
    });
}

// Ejecutar
cargarPedidos();
setInterval(cargarPedidos, 3000);
