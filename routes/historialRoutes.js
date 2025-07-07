// Importa Express y crea un enrutador
const express = require('express');
const { guardarPregunta, obtenerHistorial } = require('../controllers/historialController');//funciones del historial
const router = express.Router();

// POST / guarda las preguntas hechas en el historial
router.post('/', guardarPregunta);

// GET / devuelve las respuestas del historial 
router.get('/:userId', obtenerHistorial);
module.exports = router;

