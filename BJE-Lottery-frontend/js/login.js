document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    const alerta = document.getElementById("alerta");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
  
      if (!email || !password) {
        mostrarAlerta("Por favor, completa todos los campos.", "danger");
        return;
      }
  
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          // Guardar token y datos del usuario en localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("nombre", data.user.nombre);
  
          mostrarAlerta("Inicio de sesión exitoso. Redirigiendo...", "success");
  
          setTimeout(() => {
            const rifaPendiente = localStorage.getItem("rifaPendiente");
            if (rifaPendiente) {
              // Limpiar la rifa pendiente
              localStorage.removeItem("rifaPendiente");
  
              // Redirigir a la página de resumen con el número
              window.location.href = "/html/resumen.html?numero=" + rifaPendiente;
            } else {
              // Si no hay rifa pendiente, ir al inicio
              window.location.href = "/index.html";
            }
          }, 1500);
        } else {
          mostrarAlerta(data.message || "Credenciales incorrectas", "danger");
        }
      } catch (err) {
        console.error("Error al iniciar sesión:", err);
        mostrarAlerta("Error al conectar con el servidor", "danger");
      }
    });
  
    function mostrarAlerta(mensaje, tipo) {
      alerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
          ${mensaje}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
      `;
    }
  });
  