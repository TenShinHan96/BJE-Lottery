document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const rifaId = params.get("id");
  const botonesParticipar = document.querySelectorAll(".btn-participar");

  botonesParticipar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const rifaId = boton.dataset.rifaId;

      const token = localStorage.getItem("token");
      if (!token) {
        // Guardar el rifaId y redirigir a login
        localStorage.setItem("rifaPendiente", rifaId);
        window.location.href = "/html/iniciar-sesion.html";
      } else {
        // Si ya está autenticado, ir directamente a participar
        window.location.href = `/html/participar.html?rifaId=${rifaId}`;
      }
    });
  });

  if (!rifaId) {
    alert("ID de rifa no proporcionado.");
    return;
  }

  // Obtener números disponibles desde el backend
  fetch(`http://localhost:5000/api/participaciones/disponibles/${rifaId}`)
    .then(res => res.json())
    .then(data => {
      console.log("DATA RECIBIDA:", data); // <-- Agregá esto
      const contenedor = document.getElementById("numerosDisponibles");

      if (!data.disponibles || data.disponibles.length === 0) {
        contenedor.innerHTML = "<p class='text-center text-light'>No hay números disponibles.</p>";
        return;
      }

      data.disponibles.forEach(numero => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-light m-1";
        btn.textContent = numero;
        btn.onclick = () => seleccionarNumero(rifaId, numero);
        contenedor.appendChild(btn);
      });
    })
    .catch(err => {
      console.error("Error obteniendo números:", err);
      alert("No se pudieron cargar los números disponibles.");
    });
});

function seleccionarNumero(rifaId, numero) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para participar.");
    window.location.href = "/html/iniciar-sesion.html";
    return;
  }

  const modal = new bootstrap.Modal(document.getElementById("confirmationModal"));
  document.querySelector("#confirmationModal .modal-body").innerHTML = `
    <p>¿Confirmas tu participación con el número <strong>${numero}</strong>?</p>
  `;

  const confirmarBtn = document.querySelector("#confirmationModal .btn-primary");
  confirmarBtn.onclick = () => {
    fetch(`http://localhost:5000/api/participaciones/participar/${rifaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ numero }),
    })
      .then(res => res.json())
      .then(data => {
        modal.hide();
        if (data.message === "Participación registrada con éxito") {
          window.location.href = `/html/resumen.html?numero=${numero}`;
        } else {
          alert(data.message || "Error al participar.");
        }
      })
      .catch(err => {
        console.error("Error al participar", err);
        alert("Hubo un error al participar. Intenta de nuevo.");
      });
  };

  modal.show();
}
