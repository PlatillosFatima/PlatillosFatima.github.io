document.getElementById("pedidoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        direccion: document.getElementById("direccion").value,
        menu: document.getElementById("menu").value,
        cantidad: document.getElementById("cantidad").value
    };

    const mensajeElement = document.getElementById("mensaje");

    mensajeElement.innerText = "";
    mensajeElement.className = "mensaje";

    if (!datos.nombre || !datos.direccion || !datos.menu || !datos.cantidad) {
        mensajeElement.innerText = "❌ Completa todos los campos";
        mensajeElement.className = "mensaje error";
        return;
    }

    fetch("https://backend-ep0u.onrender.com/pedido", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mensajeElement.innerText = "✓ Pedido enviado";
            mensajeElement.className = "mensaje success";
            document.getElementById("pedidoForm").reset();
        } else {
            mensajeElement.innerText = "❌ " + (data.error || "Error");
            mensajeElement.className = "mensaje error";
        }
    })
    .catch(error => {
        console.error(error);
        mensajeElement.innerText = "⚠️ Error de conexión";
        mensajeElement.className = "mensaje error";
    });
});
