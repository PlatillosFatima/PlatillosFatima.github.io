document.getElementById("pedidoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const datos = {
        nombre_cliente: document.getElementById("nombre").value,
        direccion: document.getElementById("direccion").value,
        numero_menu: document.getElementById("menu").value,
        cantidad: document.getElementById("cantidad").value
    };

    const mensajeElement = document.getElementById("mensaje");

    mensajeElement.innerText = "";
    mensajeElement.className = "mensaje";

    // Validación
    if (!datos.nombre_cliente || !datos.direccion || !datos.numero_menu || !datos.cantidad) {
        mensajeElement.innerText = "❌ Por favor completa todos los campos";
        mensajeElement.className = "mensaje error";
        return;
    }

    fetch("https://backend-ep0u.onrender.com/pedidos", {
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
            mensajeElement.innerText = "❌ " + (data.mensaje || "No se pudo enviar el pedido");
            mensajeElement.className = "mensaje error";
        }
    })
    .catch(error => {
        console.error(error);
        mensajeElement.innerText = "⚠️ Error de conexión con el servidor";
        mensajeElement.className = "mensaje error";
    });
});
