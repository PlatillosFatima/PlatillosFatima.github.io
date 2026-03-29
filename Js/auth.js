document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const mensajeElement = document.getElementById("mensaje");

    mensajeElement.innerText = "";
    mensajeElement.className = "mensaje";

    try {
        const response = await fetch("https://backend-ep0u.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        if (data.success) {
            mensajeElement.innerText = "✓ ¡Acceso correcto!";
            mensajeElement.className = "mensaje success";

            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);

        } else {
            mensajeElement.innerText = "❌ Usuario o contraseña incorrectos.";
            mensajeElement.className = "mensaje error";
        }

    } catch (error) {
        console.error("Error:", error);
        mensajeElement.innerText = "⚠️ No se pudo conectar con el servidor.";
        mensajeElement.className = "mensaje error";
    }
});
