document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/api/rifas")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("rifasContainer");

      if (!data || data.length === 0) {
        container.innerHTML = "<p class='text-center'>No hay rifas disponibles</p>";
        return;
      }

      data.forEach(rifa => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        card.innerHTML = `
          <div class="card h-100 shadow-lg border-0">
            <img src="${rifa.imagen || 'img/placeholder.jpg'}" class="card-img-top" alt="${rifa.titulo}" style="height: 200px; object-fit: cover;" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${rifa.titulo}</h5>
              <p class="card-text">${rifa.descripcion}</p>
              <p><strong>Precio:</strong> $${rifa.precio}</p>
              <p><strong>Desde:</strong> ${new Date(rifa.fecha_inicio).toLocaleDateString()}</p>
              <p><strong>Hasta:</strong> ${new Date(rifa.fecha_fin).toLocaleDateString()}</p>
              <div class="mt-auto text-center">
                <button class="btn btn-primary w-100" onclick="verRifa(${rifa.id})">Participar</button>
              </div>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error al obtener rifas:", err);
    });
});

function verRifa(rifaId) {
  window.location.href = `html/rifa.html?id=${rifaId}`;
}
|