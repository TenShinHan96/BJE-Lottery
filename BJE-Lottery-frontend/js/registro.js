document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistro");
    const alerta = document.getElementById("alerta");
  
    // Rellenar selects
    const daySelect = document.getElementById("day");
    const monthSelect = document.getElementById("month");
    const yearSelect = document.getElementById("year");
  
    // Días (1-31)
    for (let d = 1; d <= 31; d++) {
      const option = document.createElement("option");
      option.value = d;
      option.textContent = d;
      daySelect.appendChild(option);
    }
  
    // Meses
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    meses.forEach((mes, i) => {
      const option = document.createElement("option");
      option.value = i + 1;
      option.textContent = mes;
      monthSelect.appendChild(option);
    });
  
    // Años (1900 al actual)
    const anioActual = new Date().getFullYear();
    for (let a = anioActual; a >= 1900; a--) {
      const option = document.createElement("option");
      option.value = a;
      option.textContent = a;
      yearSelect.appendChild(option);
    }
  
    // Envío del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value.trim();
      const apellido = document.getElementById("apellido").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const day = daySelect.value;
      const month = monthSelect.value;
      const year = yearSelect.value;
  
      if (!nombre || !apellido || !email || !password || !day || !month || !year) {
        mostrarAlerta("Todos los campos son obligatorios", "danger");
        return;
      }
  
      if (password.length < 6) {
        mostrarAlerta("La contraseña debe tener al menos 6 caracteres", "danger");
        return;
      }
  
      const fechaNacimiento = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, apellido, email, password, fechaNacimiento }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          mostrarAlerta("Registro exitoso. Redirigiendo...", "success");
          setTimeout(() => {
            window.location.href = "/html/iniciar-sesion.html";
          }, 2000);
        } else {
          mostrarAlerta(data.message || "Error al registrarse", "danger");
        }
      } catch (error) {
        console.error("Error:", error);
        mostrarAlerta("Error de conexión con el servidor", "danger");
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
  