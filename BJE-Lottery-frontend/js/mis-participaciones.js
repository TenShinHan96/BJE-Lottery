document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Debes iniciar sesión para ver tus participaciones.");
      window.location.href = "/html/iniciar-sesion.html";
      return;
    }
  
    fetch("http://localhost:5000/api/participaciones/mis-participaciones", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            localStorage.removeItem("token");
            window.location.href = "/html/iniciar-sesion.html";
          }
          throw new Error("Error al obtener participaciones");
        }
        return res.json();
      })
      .then(data => {
        const container = document.getElementById("participacionesContainer");
        const sinParticipaciones = document.getElementById("sinParticipaciones");
  
        // ✅ Verificación corregida
        if (!data || data.length === 0) {
          sinParticipaciones.style.display = "block";
          return;
        }
  
        // ✅ Mostrar participaciones correctamente
        data.forEach(p => {
          const card = document.createElement("div");
          card.className = "col-md-4 mb-3";
  
          card.innerHTML = `
            <a href="/html/rifa.html?id=${p.rifaId}" class="text-decoration-none">
              <div class="card bg-secondary text-white h-100">
                <div class="card-body">
                  <h5 class="card-title">${p.rifa?.titulo || "Rifa sin título"}</h5>
                  <p class="card-text">${p.rifa?.descripcion || "Sin descripción"}</p>
                  <p><strong>Número elegido:</strong> ${p.numero}</p>
                </div>
              </div>
            </a>
          `;
  
          container.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Error obteniendo participaciones:", err);
        const sinParticipaciones = document.getElementById("sinParticipaciones");
        sinParticipaciones.style.display = "block";
        sinParticipaciones.innerText = "No se pudieron cargar tus participaciones.";
      });
  
    // 🔒 Botón de cerrar sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/html/iniciar-sesion.html";
      });
    }
  });
  