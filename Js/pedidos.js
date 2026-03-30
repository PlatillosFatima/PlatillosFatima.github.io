document.getElementById("pedidoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const mensajeElement = document.getElementById("mensaje");
    const imagenInput = document.getElementById("imagen_casa");
    const file = imagenInput.files[0];

    const procesarFormulario = (imagenBase64) => {
        const datos = {
            nombre: document.getElementById("nombre").value,
            direccion: document.getElementById("direccion").value,
            menu: document.getElementById("menu").value,
            cantidad: document.getElementById("cantidad").value,
            numcelular: document.getElementById("numcelular").value,
            descripcion_adicional: document.getElementById("descripcion_adicional").value,
            imagen_casa: imagenBase64 // base64 de la imagen o null
        };

        mensajeElement.innerText = "";
        mensajeElement.className = "mensaje";

        if (!datos.nombre || !datos.direccion || !datos.menu || !datos.cantidad || !datos.numcelular) {
            mensajeElement.innerText = "❌ Completa todos los campos obligatorios";
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
    };

    // Si hay archivo, convertir a base64
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
            mensajeElement.innerText = "❌ La imagen no puede superar 5MB";
            mensajeElement.className = "mensaje error";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            procesarFormulario(e.target.result);
        };
        reader.onerror = function() {
            mensajeElement.innerText = "❌ Error al leer la imagen";
            mensajeElement.className = "mensaje error";
        };
        reader.readAsDataURL(file);
    } else {
        procesarFormulario(null);
    }
});
