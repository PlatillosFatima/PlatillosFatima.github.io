const API_URL = "https://backend-ep0u.onrender.com";

let map;
let marker;

// 🔹 ABRIR MAPA
async function abrirMapa() {
    document.getElementById("modalMapa").style.display = "flex";

    let lat = 27.2446;
    let lng = -100.1329;

    const direccionInput = document.getElementById("direccion").value;

    if (direccionInput.trim() !== "") {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionInput)}`
            );

            const data = await res.json();

            if (data && data.length > 0) {
                lat = parseFloat(data[0].lat);
                lng = parseFloat(data[0].lon);
            }

        } catch (error) {
            console.log("Error buscando dirección");
        }
    }

    setTimeout(() => {

        if (!map) {
            map = L.map('map').setView([lat, lng], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);

            marker = L.marker([lat, lng], {
                draggable: true
            }).addTo(map);

            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
            });

        } else {
            map.setView([lat, lng], 14);
            marker.setLatLng([lat, lng]);
            map.invalidateSize();
        }

    }, 300);
}

// 🔹 CERRAR MAPA
function cerrarMapa() {
    document.getElementById("modalMapa").style.display = "none";
}

// 🔹 CONFIRMAR UBICACIÓN
async function confirmarUbicacion() {
    const pos = marker.getLatLng();

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`
        );

        const data = await res.json();

        if (data && data.display_name) {
            document.getElementById("direccion").value = data.display_name;
        } else {
            alert("No se pudo obtener dirección");
        }

    } catch (error) {
        alert("Error obteniendo dirección");
    }

    cerrarMapa();
}


// 🔹 ENVÍO FORM
document.getElementById("pedidoForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const mensajeElement = document.getElementById("mensaje");
    const boton = document.querySelector(".btn-submit");
    const file = document.getElementById("imagen_casa").files[0];

    let urlImagen = null;

    try {

        // 🔥 DESACTIVAR BOTÓN
        boton.disabled = true;

        mensajeElement.innerText = "";
        mensajeElement.className = "mensaje";

        // 🔹 SUBIR IMAGEN
        if (file) {
            const formData = new FormData();
            formData.append("imagen", file);

            const resImagen = await fetch(`${API_URL}/subir-imagen`, {
                method: "POST",
                body: formData
            });

            const dataImagen = await resImagen.json();

            if (!dataImagen.success) throw new Error("Error subiendo imagen");

            urlImagen = dataImagen.url;
        }

        // 🔹 COORDENADAS
        let lat = null;
        let lng = null;

        if (marker) {
            const pos = marker.getLatLng();
            lat = pos.lat;
            lng = pos.lng;
        }

        // 🔹 DATOS
        const datos = {
            nombre: document.getElementById("nombre").value,
            direccion: document.getElementById("direccion").value,
            lat: lat,
            lng: lng,
            menu: document.getElementById("menu").value,
            cantidad: document.getElementById("cantidad").value,
            numcelular: document.getElementById("numcelular").value,
            descripcion_adicional: document.getElementById("descripcion_adicional").value,
            imagen_casa: urlImagen
        };

        const res = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (res.ok && data.success) {
            mensajeElement.innerText = "✓ Pedido enviado";
            mensajeElement.className = "mensaje success";
            document.getElementById("pedidoForm").reset();

        } else {
            mensajeElement.innerText = "❌ " + (data.error || "Límite alcanzado");
            mensajeElement.className = "mensaje error";
        }

    } catch (error) {
        mensajeElement.innerText = "❌ Error al enviar pedido";
        mensajeElement.className = "mensaje error";
        console.error(error);
    } finally {
        boton.disabled = false;
    }
});