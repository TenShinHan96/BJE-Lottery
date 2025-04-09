document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const rifaId = params.get("rifaId");
    const token = localStorage.getItem("token");
  
    if (!rifaId || !token) {
      alert("Acceso inválido. Inicia sesión o selecciona una rifa.");
      window.location.href = "../index.html";
      return;
    }
  
    const contenedorNumeros = document.getElementById("contenedor-numeros");
  
    try {
      // Traer números disponibles
      const res = await fetch(`http://localhost:5000/api/participaciones/disponibles/${rifaId}`);
      const data = await res.json();
  
      if (res.ok) {
        data.disponibles.forEach(numero => {
          const btn = document.createElement("button");
          btn.className = "btn btn-outline-light m-2";
          btn.textContent = numero;
          btn.addEventListener("click", () => registrarParticipacion(numero));
          contenedorNumeros.appendChild(btn);
        });
      } else {
        contenedorNumeros.innerHTML = "<p>Error al cargar números disponibles.</p>";
      }
    } catch (error) {
      console.error("Error al obtener números:", error);
      contenedorNumeros.innerHTML = "<p>Error al cargar los datos.</p>";
    }
  
    // Función para enviar la participación
    async function registrarParticipacion(numeroSeleccionado) {
      try {
        const res = await fetch(`http://localhost:5000/api/participaciones/participar/${rifaId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ numero: numeroSeleccionado })
        });
  
        const data = await res.json();
  
        if (res.ok) {
          // Guardar datos en localStorage para mostrarlos en resumen
          localStorage.setItem("tituloRifa", "Nombre de la rifa"); // Podés ajustar esto si tenés el título dinámico
          window.location.href = `../html/resumen.html?numero=${numeroSeleccionado}`;
        } else {
          alert(data.message || "No se pudo registrar la participación");
        }
      } catch (error) {
        console.error("Error al registrar participación:", error);
        alert("Error al registrar participación");
      }
    }
  });
  