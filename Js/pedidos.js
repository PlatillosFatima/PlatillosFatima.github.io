document.getElementById("pedidoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const mensajeElement = document.getElementById("mensaje");
    const imagenInput = document.getElementById("imagen_casa");
    const file = imagenInput.files[0];

    mensajeElement.innerText = "";
    mensajeElement.className = "mensaje";

    const datosBase = {
        nombre: document.getElementById("nombre").value,
        direccion: document.getElementById("direccion").value,
        menu: document.getElementById("menu").value,
        cantidad: document.getElementById("cantidad").value,
        numcelular: document.getElementById("numcelular").value,
        descripcion_adicional: document.getElementById("descripcion_adicional").value
    };

    // Validación
    if (!datosBase.nombre || !datosBase.direccion || !datosBase.menu || !datosBase.cantidad || !datosBase.numcelular) {
        mensajeElement.innerText = "❌ Completa todos los campos obligatorios";
        mensajeElement.className = "mensaje error";
        return;
    }

    // 🔥 FUNCIÓN FINAL PARA ENVIAR PEDIDO
    function enviarPedido(urlImagen) {

        const datos = {
            ...datosBase,
            imagen_casa: urlImagen // ✅ AQUÍ YA ES URL
        };

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
    }

    // 🔥 SI HAY IMAGEN → SUBIRLA
    if (file) {

        if (file.size > 5 * 1024 * 1024) {
            mensajeElement.innerText = "❌ La imagen no puede superar 5MB";
            mensajeElement.className = "mensaje error";
            return;
        }

        const formData = new FormData();
        formData.append("imagen", file);

        fetch("https://backend-ep0u.onrender.com/subir-imagen", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {
                const urlImagen = data.url;  // ✅ URL REAL
                enviarPedido(urlImagen);     // 🔥 ENVÍA PEDIDO
            } else {
                mensajeElement.innerText = "❌ Error al subir imagen";
                mensajeElement.className = "mensaje error";
            }

        })
        .catch(error => {
            console.error(error);
            mensajeElement.innerText = "⚠️ Error subiendo imagen";
            mensajeElement.className = "mensaje error";
        });

    } else {
        // SIN IMAGEN
        enviarPedido(null);
    }
});