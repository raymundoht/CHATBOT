// Generar un user_id automáticamente si no existe, como en el script original.
if (!localStorage.getItem('user_id')) {
  const randomId = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  localStorage.setItem('user_id', randomId);
}

// Variable para almacenar las respuestas por tema.
let respuestasPorTema = {};

// --- LÓGICA DEL CHATBOT ---
document.addEventListener('DOMContentLoaded', async () => {
  // Selección de elementos del DOM
  const temaSelect = document.getElementById('tema');
  const preguntaSelect = document.getElementById('pregunta');
  const confirmarBtn = document.getElementById('confirmar-btn');
  const listaHistorial = document.getElementById('lista-historial');
  
  const modalRespuesta = document.getElementById('modal-respuesta');
  const respuestaCard = document.getElementById('respuesta-card');
  const respuestaContenido = document.getElementById('respuesta-contenido');
  const cerrarModalBtn = document.getElementById('cerrar-modal');

  /**
   * Renderiza la lista del historial en la UI.
   * @param {Array} historialItems - Un array de objetos del historial.
   */
  function renderizarHistorial(historialItems) {
    listaHistorial.innerHTML = ''; // Limpiar lista actual
    if (!historialItems || historialItems.length === 0) {
        listaHistorial.innerHTML = '<li class="text-sm text-slate-500 dark:text-slate-400">No hay consultas recientes.</li>';
        return;
    }
    historialItems
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha más reciente
      .forEach(item => {
        const li = document.createElement('li');
        li.className = 'p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition';
        
        const fecha = new Date(item.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        const horaFormateada = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        li.innerHTML = `
          <p class="font-semibold text-sm text-slate-700 dark:text-slate-300">${item.pregunta}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">${fechaFormateada} - ${horaFormateada}</p>
        `;
        
        li.addEventListener('click', () => mostrarRespuesta(item.pregunta));
        listaHistorial.appendChild(li);
    });
  }

  /**
   * Carga el historial desde el API y lo renderiza.
   */
  async function cargarYRenderizarHistorial() {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
          renderizarHistorial([]);
          return;
      }
      try {
          const res = await fetch(`/api/historial/${userId}`);
          if (!res.ok) throw new Error('Error al cargar el historial');
          const historial = await res.json();
          renderizarHistorial(historial);
      } catch (error) {
          console.error(error);
          renderizarHistorial([]); // Renderiza el historial vacío en caso de error
      }
  }
  
  /**
   * Busca una respuesta y la muestra en el modal.
   * @param {string} pregunta - La pregunta a buscar.
   */
  function mostrarRespuesta(pregunta) {
      let respuestaEncontrada = null;
      // Buscar la respuesta en la estructura de datos
      for (const tema in respuestasPorTema) {
          const hallada = respuestasPorTema[tema].find(p => p.pregunta === pregunta);
          if (hallada) {
              respuestaEncontrada = hallada;
              break;
          }
      }

      if (respuestaEncontrada) {
          respuestaContenido.innerHTML = `<p>${respuestaEncontrada.respuesta}</p>`;
          modalRespuesta.classList.remove('hidden');
          modalRespuesta.classList.add('flex');
          
          // Forzar reflow para reiniciar la animación de fade-in
          respuestaCard.classList.remove('fade-in');
          void respuestaCard.offsetWidth;
          respuestaCard.classList.add('fade-in');
      } else {
          console.warn("No se encontró la respuesta para la pregunta:", pregunta);
      }
  }

  /**
   * Cierra el modal de respuesta.
   */
  function cerrarModal() {
      modalRespuesta.classList.add('hidden');
      modalRespuesta.classList.remove('flex');
  }

  // --- INICIALIZACIÓN ---

  // 1. Cargar todas las preguntas y respuestas desde el backend
  try {
    const res = await fetch('/respuestas');
    if (!res.ok) throw new Error('No se pudieron cargar las preguntas y respuestas.');
    const data = await res.json();

    // Agrupar respuestas por tema para los dropdowns
    data.forEach(item => {
      const tema = item.tema;
      if (!respuestasPorTema[tema]) {
        respuestasPorTema[tema] = [];
      }
      respuestasPorTema[tema].push({
        pregunta: item.pregunta_clave,
        respuesta: item.respuesta
      });
    });

    // Llenar el dropdown de temas
    Object.keys(respuestasPorTema).forEach(tema => {
      const option = document.createElement('option');
      option.value = tema;
      option.textContent = tema;
      temaSelect.appendChild(option);
    });

  } catch (error) {
      console.error(error);
      temaSelect.disabled = true;
      preguntaSelect.disabled = true;
      confirmarBtn.disabled = true;
      confirmarBtn.textContent = "Error al cargar datos";
      confirmarBtn.classList.add("bg-red-500", "cursor-not-allowed");
  }

  // 2. Cargar el historial inicial del usuario
  await cargarYRenderizarHistorial();

  // --- EVENT LISTENERS ---

  // Llenar el dropdown de preguntas cuando se selecciona un tema
  temaSelect.addEventListener('change', () => {
    preguntaSelect.innerHTML = '<option disabled selected>-- Elige una pregunta --</option>';
    const preguntas = respuestasPorTema[temaSelect.value] || [];
    preguntas.forEach(p => {
      const option = document.createElement('option');
      option.value = p.pregunta;
      option.textContent = p.pregunta;
      preguntaSelect.appendChild(option);
    });
    preguntaSelect.disabled = false;
  });
  preguntaSelect.disabled = true; // Deshabilitado por defecto

  // Evento del botón de confirmar para obtener respuesta
  confirmarBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const preguntaSeleccionada = preguntaSelect.value;

    if (confirmarBtn.disabled || !preguntaSeleccionada || preguntaSeleccionada.startsWith('--')) {
      console.error('Selecciona una pregunta válida');
      return;
    }
    
    // Mostrar la respuesta correspondiente
    mostrarRespuesta(preguntaSeleccionada);
    
    // Guardar la pregunta en el historial del backend
    const userId = localStorage.getItem('user_id');
    if (userId) {
        try {
            await fetch('/api/historial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pregunta: preguntaSeleccionada,
                    userId: userId
                })
            });
            // Si el guardado es exitoso, actualizar la lista del historial dinámicamente
            await cargarYRenderizarHistorial();
        } catch (error) {
            console.error("Error al guardar en el historial:", error);
        }
    }
  });
  
  // Eventos para cerrar el modal
  cerrarModalBtn.addEventListener('click', cerrarModal);
  modalRespuesta.addEventListener('click', (e) => {
      if (e.target === modalRespuesta) {
          cerrarModal();
      }
  });
});
