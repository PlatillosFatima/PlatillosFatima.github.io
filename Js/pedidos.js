const API_URL = "https://backend-ep0u.onrender.com";

document.getElementById("pedidoForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const mensajeElement = document.getElementById("mensaje");
    const file = document.getElementById("imagen_casa").files[0];

    let urlImagen = null;

    try {
        // 🔹 1. SUBIR IMAGEN SI EXISTE
        if (file) {
            const formData = new FormData();
            formData.append("imagen", file);

            const resImagen = await fetch(`${API_URL}/subir-imagen`, {
                method: "POST",
                body: formData
            });

            const dataImagen = await resImagen.json();

            if (!dataImagen.success) {
                throw new Error("Error subiendo imagen");
            }

            urlImagen = dataImagen.url;
        }

        // 🔹 2. ENVIAR PEDIDO
        const datos = {
            nombre: document.getElementById("nombre").value,
            direccion: document.getElementById("direccion").value,
            menu: document.getElementById("menu").value,
            cantidad: document.getElementById("cantidad").value,
            numcelular: document.getElementById("numcelular").value,
            descripcion_adicional: document.getElementById("descripcion_adicional").value,
            imagen_casa: urlImagen
        };

        const res = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (data.success) {
            mensajeElement.innerText = "✓ Pedido enviado";
            mensajeElement.className = "mensaje success";
            document.getElementById("pedidoForm").reset();
        } else {
            throw new Error(data.error || "Error");
        }

    } catch (error) {
        console.error(error);
        mensajeElement.innerText = "❌ " + error.message;
        mensajeElement.className = "mensaje error";
    }
});