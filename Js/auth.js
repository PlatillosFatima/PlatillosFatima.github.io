document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const mensajeElement = document.getElementById("mensaje");

    mensajeElement.innerText = "";
    mensajeElement.className = "mensaje";

    fetch("https://backend-ep0u.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuario,
            password: password
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Error en servidor");
        }
        return res.json();
    })
    .then(data => {
        console.log("Respuesta:", data); // DEBUG

        if (data.success === true) {
            mensajeElement.innerText = "✓ ¡Acceso correcto!";
            mensajeElement.className = "mensaje success";

            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);

        } else {
            mensajeElement.innerText = data.mensaje || "❌ Usuario o contraseña incorrectos.";
            mensajeElement.className = "mensaje error";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mensajeElement.innerText = "⚠️ Error de conexión con el servidor.";
        mensajeElement.className = "mensaje error";
    });
});
