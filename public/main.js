let respuestasPorTema = {};

document.addEventListener('DOMContentLoaded', async () => {
    const temaSelect = document.getElementById('tema');
    const preguntaSelect = document.getElementById('pregunta');
    const respuestaBox = document.getElementById('respuesta');

    try {
        const res = await fetch('/respuestas');
        const data = await res.json();

        // Agrupar por tema
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

        // Llenar dropdown de temas
        Object.keys(respuestasPorTema).forEach(tema => {
            const option = document.createElement('option');
            option.value = tema;
            option.textContent = tema;
            temaSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando respuestas:", error);
        respuestaBox.textContent = "❌ Error al conectar con el servidor.";
    }

    temaSelect.addEventListener('change', () => {
        const preguntas = respuestasPorTema[temaSelect.value] || [];
        preguntaSelect.innerHTML = '<option disabled selected>-- Selecciona una pregunta --</option>';
        respuestaBox.textContent = "Selecciona una pregunta para ver la respuesta.";

        preguntas.forEach(p => {
            const option = document.createElement('option');
            option.value = p.pregunta;
            option.textContent = p.pregunta;
            preguntaSelect.appendChild(option);
        });
    });

    preguntaSelect.addEventListener('change', () => {
        const pregunta = preguntaSelect.value;
        const tema = temaSelect.value;
        const item = respuestasPorTema[tema].find(p => p.pregunta === pregunta);
        respuestaBox.textContent = item ? item.respuesta : '❌ Respuesta no encontrada.';
    });
});
