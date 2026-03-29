document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    mensaje.innerText = "";
    mensaje.className = "mensaje";

    fetch("https://backend-ep0u.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta:", data); // 🔥 DEBUG

        if (data.success) {
            mensaje.innerText = "✓ Acceso correcto";
            mensaje.className = "mensaje success";

            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);

        } else {
            mensaje.innerText = "❌ " + (data.error || "Datos incorrectos");
            mensaje.className = "mensaje error";
        }
    })
    .catch(error => {
        console.error(error);
        mensaje.innerText = "⚠️ Error de conexión";
        mensaje.className = "mensaje error";
    });
});
