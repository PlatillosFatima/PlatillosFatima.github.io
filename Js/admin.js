const API_URL = "https://backend-ep0u.onrender.com";

// 🔹 Cargar pedidos
function cargarPedidos() {
    fetch(`${API_URL}/pedidos`)
    .then(res => res.json())
    .then(data => {
        const tabla = document.querySelector("#tablaPedidos tbody");
        tabla.innerHTML = "";

        if (data.success && Array.isArray(data.pedidos) && data.pedidos.length > 0) {
            data.pedidos.forEach(p => {
                const fila = `
                    <tr>
                        <td>${p.id_pedido}</td>
                        <td>${p.nombre}</td>
                        <td>${p.direccion}</td>
                        <td>${p.menu}</td>
                        <td>${p.cantidad}</td>
                        <td>${p.estado}</td>
                        <td>
                            <select onchange="cambiarEstado(${p.id_pedido}, this.value)">
                                <option value="">Cambiar estado</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Preparado sin pagar">Preparado sin pagar</option>
                                <option value="Preparado y pagado">Preparado y pagado</option>
                                <option value="Pendiente de pagar">Pendiente de pagar</option>
                                <option value="Entregado">Entregado</option>
                            </select>
                            <button onclick="confirmarEliminar(${p.id_pedido})">🗑️</button>
                        </td>
                    </tr>
                `;
                tabla.innerHTML += fila;
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="7">No hay pedidos</td></tr>';
        }
    })
    .catch(error => {
        console.error("Error cargando pedidos:", error);
    });
}

// 🔹 Contador de pedidos (opcional)
function actualizarContadorPedidos() {
    fetch(`${API_URL}/pedidos/count`)
    .then(res => res.json())
    .then(data => {
        console.log("Pedidos:", data);
    })
    .catch(error => console.error(error));
}

// 🔹 Cambiar estado
function cambiarEstado(id, estado) {
    if (!estado) return;

    fetch(`${API_URL}/pedido/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_pedido: id,
            estado: estado
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            cargarPedidos();
        } else {
            alert("Error al actualizar estado");
        }
    })
    .catch(error => console.error(error));
}

// 🔹 Confirmar eliminación
function confirmarEliminar(id) {
    if (confirm("¿Eliminar pedido?")) {
        eliminarPedido(id);
    }
}

// 🔹 Eliminar pedido
function eliminarPedido(id) {
    fetch(`${API_URL}/pedido`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_pedido: id
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            cargarPedidos();
        } else {
            alert("Error al eliminar");
        }
    })
    .catch(error => console.error(error));
}

// 🔹 Guardar límite
function guardarLimite() {
    const limite = document.getElementById("limite").value;

    if (!limite) {
        alert("Ingresa un límite válido");
        return;
    }

    fetch(`${API_URL}/limite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            limite: parseInt(limite)
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Límite guardado");
            cargarPedidos();
        } else {
            alert("Error al guardar límite");
        }
    })
    .catch(error => console.error(error));
}

// 🔥 Ejecutar al cargar
cargarPedidos();
setInterval(cargarPedidos, 3000);
