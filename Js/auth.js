document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const mensajeElement = document.getElementById("mensaje");

    // Limpiar mensaje anterior
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
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mensajeElement.innerText = "✓ ¡Acceso correcto!";
            mensajeElement.className = "mensaje success";
            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);
        } else {
            mensajeElement.innerText = "❌ Usuario o contraseña incorrectos. Intenta de nuevo.";
            mensajeElement.className = "mensaje error";
        }
    })
    .catch(error => {
        console.error(error);
        mensajeElement.innerText = "⚠️ Error de conexión. Verifica la URL del servidor.";
        mensajeElement.className = "mensaje error";
    });
});
