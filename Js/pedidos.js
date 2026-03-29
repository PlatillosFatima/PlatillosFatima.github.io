document.getElementById("pedidoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        direccion: document.getElementById("direccion").value,
        numero_menu: document.getElementById("menu").value,
        cantidad: document.getElementById("cantidad").value
    };

    const mensajeElement = document.getElementById("mensaje");

    // Limpiar mensaje anterior
    mensajeElement.innerText = "";
    mensajeElement.className = "mensaje";

    // Validar campos vacíos
    if (!datos.nombre || !datos.direccion || !datos.numero_menu || !datos.cantidad) {
        mensajeElement.innerText = "❌ Por favor completa todos los campos";
        mensajeElement.className = "mensaje error";
        return;
    }

    fetch("http://localhost:5000/pedido", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mensajeElement.innerText = "✓ ¡Pedido guardado exitosamente!";
            mensajeElement.className = "mensaje success";
            document.getElementById("pedidoForm").reset();
        } else {
            if (res.status === 429) {
                mensajeElement.innerText = "⚠️ Pedidos máximos alcanzados. Intenta más tarde.";
            } else {
                mensajeElement.innerText = "❌ " + (data.mensaje || "No se pudo enviar el pedido");
            }
            mensajeElement.className = "mensaje error";
        }
    })
    .catch(error => {
        console.error(error);
        mensajeElement.innerText = "⚠️ Error de conexión. Verifica la URL del servidor.";
        mensajeElement.className = "mensaje error";
    });
});