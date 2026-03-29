const API_URL = "https://backend-ep0u.onrender.com";
// Guardar límite
function guardarLimite() {
    const limite = document.getElementById("limite").value;

    if (!limite) {
        alert("Ingresa un límite válido");
        return;
    }

    fetch("https://backend-ep0u.onrender.com/limite", {
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
        } else {
            alert("Error al guardar límite");
        }
    })
    .catch(error => console.error(error));
}
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
        
        // Actualizar contador de pedidos
        actualizarContadorPedidos();
    })
    .catch(error => {
        console.error("Error cargando pedidos:", error);
    });
}

// 🔹 Actualizar contador de pedidos
function actualizarContadorPedidos() {
    fetch(`${API_URL}/pedidos/count`)
    .then(res => res.json())
    .then(data => {
        console.log(`Total de pedidos: ${data.total}/${data.limite}`);
        
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
        
        let porcentaje = (data.total / data.limite) * 100;
        let color = porcentaje < 50 ? "#10b981" : porcentaje < 80 ? "#f59e0b" : "#ef4444";
        
        contador.innerHTML = `
            <div style="margin-bottom: 15px;">
                <p style="margin-bottom: 8px; font-weight: 600;">📊 Total de Pedidos</p>
                <div style="background-color: #e5e7eb; border-radius: 10px; height: 25px; overflow: hidden; position: relative;">
                    <div style="background-color: ${color}; height: 100%; width: ${porcentaje}%; transition: width 0.3s ease;"></div>
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 600; color: #000; font-size: 0.85rem; z-index: 10;">
                        ${data.total}/${data.limite}
                    </span>
                </div>
            </div>
        `;
    })
    .catch(error => console.error("Error al contar pedidos:", error));
}

// Ejecutar al cargar
cargarPedidos();
setInterval(cargarPedidos, 3000);
