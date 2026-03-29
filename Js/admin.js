// Cargar pedidos
function cargarPedidos() {
    fetch("https://backend-ep0u.onrender.com/login")
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
                            <select class="select-estado" onchange="cambiarEstado(${p.id}, this.value)" title="Cambiar estado">
                                <option value="">Cambiar estado</option>
                                <option value="Pendiente">📌 Pendiente</option>
                                <option value="Preparado sin pagar">👨‍🍳 Preparado sin pagar</option>
                                <option value="Preparado y pagado">✅ Preparado y pagado</option>
                                <option value="Pendiente de pagar">💰 Pendiente de pagar</option>
                                <option value="Entregado">🚚 Entregado</option>
                            </select>
                            <button class="btn-eliminar" onclick="confirmarEliminar(${p.id})" title="Eliminar pedido">🗑️</button>
                        </td>
                    </tr>
                `;
                tabla.innerHTML += fila;
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No hay pedidos</td></tr>';
        }
        
        // Actualizar contador
        actualizarContadorPedidos();
    })
    .catch(error => {
        console.error("Error cargando pedidos:", error);
        mostrarNotificacion("⚠️ Error al cargar pedidos", "error");
    });
}

// Actualizar contador de pedidos
function actualizarContadorPedidos() {
    fetch("http://localhost:5000/pedidos/count")
    .then(res => res.json())
    .then(data => {
        console.log(`Total de pedidos: ${data.cantidad}/${data.limite}`);
        
        // Mostrar en el plan
        let contador = document.getElementById("contador-pedidos");
        if (!contador) {
            contador = document.createElement("div");
            contador.id = "contador-pedidos";
            contador.className = "contador-pedidos";
            const section = document.querySelector(".admin-section");
            if (section) {
                section.insertBefore(contador, section.firstChild);
            }
        }
        
        let porcentaje = (data.cantidad / data.limite) * 100;
        let color = porcentaje < 50 ? "#10b981" : porcentaje < 80 ? "#f59e0b" : "#ef4444";
        
        contador.innerHTML = `
            <div style="margin-bottom: 15px;">
                <p style="margin-bottom: 8px; font-weight: 600;">📊 Total de Pedidos</p>
                <div style="background-color: #e5e7eb; border-radius: 10px; height: 25px; overflow: hidden; position: relative;">
                    <div style="background-color: ${color}; height: 100%; width: ${porcentaje}%; transition: width 0.3s ease;"></div>
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 600; color: #000; font-size: 0.85rem; z-index: 10;">
                        ${data.cantidad}/${data.limite}
                    </span>
                </div>
            </div>
        `;
    })
    .catch(error => console.error("Error al contar pedidos:", error));
}

// Cambiar estado de pedido
function cambiarEstado(id, estado) {
    if (!estado) return;

    fetch("http://localhost:5000/pedido/estado", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, estado: estado })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacion("✓ " + data.mensaje, "success");
            cargarPedidos();
        } else {
            mostrarNotificacion("❌ " + (data.mensaje || "Error al cambiar estado"), "error");
        }
    })
    .catch(error => {
        console.error(error);
        mostrarNotificacion("⚠️ Error de conexión", "error");
    });
}

// Confirmar eliminación de pedido
function confirmarEliminar(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
        eliminarPedido(id);
    }
}

// Eliminar pedido
function eliminarPedido(id) {
    fetch("http://localhost:5000/pedido", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacion("✓ Pedido eliminado correctamente", "success");
            cargarPedidos();
        } else {
            mostrarNotificacion("❌ " + (data.mensaje || "Error al eliminar"), "error");
        }
    })
    .catch(error => {
        console.error(error);
        mostrarNotificacion("⚠️ Error de conexión", "error");
    });
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    const notif = document.createElement("div");
    notif.className = `notificacion notificacion-${tipo}`;
    notif.innerText = mensaje;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = "0";
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Obtener información de límite y pedidos activos
function actualizarInfo() {
    fetch("http://localhost:5000/pedidos/count")
    .then(res => res.json())
    .then(data => {
        console.log(`Estado actual - Pedidos activos: ${data.cantidad}, Límite: ${data.limite}`);
    })
    .catch(error => console.error("Error:", error));
}

// Guardar límite
function guardarLimite() {
    const limite = document.getElementById("limite").value;
    
    if (!limite || parseInt(limite) <= 0) {
        mostrarNotificacion("❌ Por favor ingresa un número válido mayor a 0", "error");
        return;
    }

    fetch("http://localhost:5000/limite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ limite: parseInt(limite) })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacion("✓ Límite actualizado a " + limite, "success");
            document.getElementById("limite").value = "";
            // Recargar después de actualizar
            setTimeout(() => {
                cargarPedidos();
                actualizarContadorPedidos();
            }, 500);
        } else {
            mostrarNotificacion("❌ " + (data.mensaje || "Error al guardar el límite"), "error");
        }
    })
    .catch(error => {
        console.error(error);
        mostrarNotificacion("⚠️ Error de conexión", "error");
    });
}

// Ejecutar al cargar
cargarPedidos();
actualizarInfo();

// Recargar pedidos cada 3 segundos
setInterval(() => {
    cargarPedidos();
}, 3000);
