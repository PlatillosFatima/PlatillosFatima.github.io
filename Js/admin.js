const API_URL = "https://backend-ep0u.onrender.com";

// 🔥 ABRIR IMAGEN (NO DESCARGA)
function abrirImagen(base64) {

    let srcFinal = "";

    // Si YA viene con data:image
    if (base64.startsWith("data:image")) {
        srcFinal = base64;
    } else {
        // Si NO, se lo agregamos
        srcFinal = "data:image/png;base64," + base64;
    }

    const nuevaVentana = window.open();

    nuevaVentana.document.write(`
        <html>
            <head><title>Imagen</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:black;">
                <img src="${srcFinal}" style="max-width:100%; max-height:100%;">
            </body>
        </html>
    `);
}

// 🔹 GUARDAR LIMITE
function guardarLimite() {
    const limite = document.getElementById("limite").value;

    if (!limite) {
        alert("Ingresa un límite válido");
        return;
    }

    fetch(`${API_URL}/limite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limite: parseInt(limite) })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Límite guardado");
            cargarPedidos();
        } else {
            alert("Error al guardar límite");
        }
    });
}

// 🔹 CARGAR PEDIDOS
function cargarPedidos() {
    fetch(`${API_URL}/pedidos`)
    .then(res => res.json())
    .then(data => {
        const tabla = document.querySelector("#tablaPedidos tbody");
        tabla.innerHTML = "";

        if (data.success && data.pedidos.length > 0) {
            data.pedidos.forEach(p => {

                let imagenHtml = '<td>';

                if (p.imagen_casa && p.imagen_casa !== '---') {
                    const base64 = encodeURIComponent(p.imagen_casa);

                    imagenHtml += `
                        <a href="#" onclick="abrirImagen(decodeURIComponent('${base64}'))">
                            Ver imagen
                        </a>
                    `;
                } else {
                    imagenHtml += '---';
                }

                imagenHtml += '</td>';

                const fila = `
                    <tr>
                        <td>${p.id_pedido}</td>
                        <td>${p.nombre}</td>
                        <td>${p.direccion}</td>
                        <td>${p.menu}</td>
                        <td>${p.cantidad}</td>
                        <td>${p.numcelular || 'N/A'}</td>
                        <td>${p.descripcion_adicional || '---'}</td>
                        ${imagenHtml}
                        <td>${p.estado}</td>
                        <td>
                            <select onchange="cambiarEstado(${p.id_pedido}, this.value)">
                                <option value="">Cambiar estado</option>
                                <option value="Pendiente - Por pagar">Pendiente - Por pagar</option>
                                <option value="Preparado - Por pagar">Preparado - Por pagar</option>
                                <option value="Preparado - Pagado">Preparado - Pagado</option>
                                <option value="Entregado">Entregado</option>
                            </select>
                            <button onclick="confirmarEliminar(${p.id_pedido})">🗑️</button>
                        </td>
                    </tr>
                `;

                tabla.innerHTML += fila;
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="10">No hay pedidos</td></tr>';
        }

        actualizarContadorPedidos();
    });
}

// 🔹 CAMBIAR ESTADO
function cambiarEstado(idPedido, estado) {
    if (!estado) return;

    fetch(`${API_URL}/pedidos/${idPedido}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Estado actualizado");
            cargarPedidos();
        }
    });
}

// 🔹 ELIMINAR
function confirmarEliminar(idPedido) {
    if (!confirm("¿Eliminar pedido?")) return;

    fetch(`${API_URL}/pedidos/${idPedido}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Eliminado");
            cargarPedidos();
        }
    });
}

// 🔹 ELIMINAR TODOS
function eliminarTodosPedidos() {
    if (!confirm("¿Eliminar TODOS los pedidos?")) return;

    fetch(`${API_URL}/pedidos/eliminar/todos`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.mensaje);
            cargarPedidos();
        }
    });
}

// 🔹 CONTADOR (DISEÑO ORIGINAL)
function actualizarContadorPedidos() {
    fetch(`${API_URL}/pedidos/count`)
    .then(res => res.json())
    .then(data => {
        let contador = document.getElementById("contador-pedidos-container");
        
        let porcentaje = (data.total / data.limite) * 100;
        let faltan = data.limite - data.total;

        let color = porcentaje < 50 ? "#10b981" : 
                    porcentaje < 80 ? "#f59e0b" : 
                    "#ef4444";

        contador.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white;">
                
                <p style="margin-bottom: 12px; font-weight: 600;">
                    📊 ${data.total}/${data.limite}
                </p>

                <p>🟢 Disponibles: ${faltan}</p>

                <div style="background-color: rgba(255,255,255,0.3); border-radius: 10px; height: 30px; position: relative;">
                    
                    <div style="background-color: ${color}; width: ${porcentaje}%; height: 100%;"></div>
                    
                    <span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-weight:bold;">
                        ${porcentaje.toFixed(0)}%
                    </span>
                </div>
            </div>
        `;
    });
}

// 🔹 INICIAL
cargarPedidos();
setInterval(cargarPedidos, 3000);