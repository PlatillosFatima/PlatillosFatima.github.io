const API_URL = "https://backend-ep0u.onrender.com";

// Guardar límite
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

// Cargar pedidos
// Función para cargar pedidos y mostrar imágenes en Base64
function cargarPedidos() {
    fetch("https://backend-ep0u.onrender.com/pedidos")
    .then(response => response.json())
    .then(data => {
        const tabla = document.querySelector("#tablaPedidos tbody");
        tabla.innerHTML = "";  // Limpiar la tabla antes de cargar nuevos datos

        if (data.success && Array.isArray(data.pedidos) && data.pedidos.length > 0) {
            data.pedidos.forEach(p => {
                // Generar el enlace para abrir la imagen en otra pestaña
                let imagenHtml = '<td>';
                if (p.imagen_casa && p.imagen_casa !== '---') {
                    // Aquí creamos un enlace con la cadena Base64
                    imagenHtml += `<a href="${p.imagen_casa}" target="_blank" class="btn-ver-foto" style="font-size: 1.2rem;">📸 Ver</a>`;
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
    })
    .catch(error => {
        console.error("Error cargando pedidos:", error);
    });
}

// Llamada inicial para cargar los pedidos
cargarPedidos();

// Cambiar estado de pedido
function cambiarEstado(idPedido, estado) {
    if (!estado) {
        alert("Selecciona un estado válido");
        return;
    }

    fetch(`${API_URL}/pedidos/${idPedido}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Estado actualizado");
            cargarPedidos();
        } else {
            alert("Error al actualizar estado");
        }
    })
    .catch(error => console.error(error));
}

// Confirmar eliminar pedido
function confirmarEliminar(idPedido) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este pedido?");
    if (confirmar) {
        fetch(`${API_URL}/pedidos/${idPedido}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Pedido eliminado");
                cargarPedidos();  // Recarga los pedidos
            } else {
                alert("Error al eliminar pedido");
            }
        })
        .catch(error => console.error(error));
    }
}

function actualizarContadorPedidos() {
    fetch("https://backend-ep0u.onrender.com/pedidos/count")
    .then(res => res.json())
    .then(data => {
        console.log(`Total de pedidos: ${data.total}/${data.limite}`);

        let contador = document.getElementById("contador-pedidos-container");
        
        let porcentaje = (data.total / data.limite) * 100;
        let color = porcentaje < 50 ? "#10b981" : porcentaje < 80 ? "#f59e0b" : "#ef4444";

        contador.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <p style="margin-bottom: 12px; font-weight: 600; font-size: 1.1rem;">📊 Total de Pedidos: ${data.total}/${data.limite}</p>
                <div style="background-color: rgba(255,255,255,0.3); border-radius: 10px; height: 30px; overflow: hidden; position: relative;">
                    <div style="background-color: ${color}; height: 100%; width: ${porcentaje}%; transition: width 0.3s ease;"></div>
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 700; color: white; font-size: 0.95rem; z-index: 10;">
                        ${porcentaje.toFixed(0)}%
                    </span>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error("Error al contar pedidos:", error);
    });
}

// Llamada para actualizar el contador de pedidos y el límite
actualizarContadorPedidos();

// Eliminar todos los pedidos
function eliminarTodosPedidos() {
   const confirmar = confirm("⚠️ ¿Estás SEGURO de que deseas ELIMINAR TODOS los pedidos? Esta acción es irreversible.");
   if (!confirmar) {
       return;
   }

   const confirmar2 = confirm("⚠️⚠️ CONFIRMACIÓN FINAL - ¿Deseas eliminar TODOS los pedidos?");
   if (!confirmar2) {
       return;
   }

   fetch(`${API_URL}/pedidos/eliminar/todos`, {
       method: "DELETE"
   })
   .then(res => res.json())
   .then(data => {
       if (data.success) {
           alert("✅ " + data.mensaje);
           cargarPedidos();  // Recarga los pedidos
       } else {
           alert("❌ Error: " + data.error);
       }
   })
   .catch(error => {
       console.error("Error eliminando todos los pedidos:", error);
       alert("⚠️ Error de conexión");
   });
}

// Ver foto en modal
function verFoto(imagenBase64) {
    // Crear modal
    const modal = document.createElement("div");
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;

    modal.onclick = function() {
        document.body.removeChild(modal);
    };

    // Crear container para la imagen
    const container = document.createElement("div");
    container.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
    `;

    // Crear imagen
    const img = document.createElement("img");
    img.src = imagenBase64;
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
    `;

    container.appendChild(img);
    modal.appendChild(container);
    document.body.appendChild(modal);
}

// Ejecutar al cargar
cargarPedidos();
setInterval(cargarPedidos, 3000);
