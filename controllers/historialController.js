// importa el modelo del historial de preguntas
const { Historial } = require('../models/historialModel');

//guarda una pregunta realizada 
const guardarPregunta = async (req, res) => {
  try {
    const { pregunta, userId } = req.body;
    const nuevoRegistro = new Historial({ pregunta, userId });
    await nuevoRegistro.save();
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el historial' });
  }
};

//devuelve el historial de preguntas.
const obtenerHistorial = async (req, res) => {
  try {
    const { userId } = req.params;
    const historial = await Historial.find({ userId }).sort({ fecha: -1 });
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};

// Exporta las funcionn a otros archivos 
module.exports = { guardarPregunta, obtenerHistorial };
