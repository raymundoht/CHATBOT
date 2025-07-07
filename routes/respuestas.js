const express = require('express');
const router = express.Router();

// importa las respuestas del chat
const Respuesta = require('../models/Respuesta');

// GET /respuestas de la base 
router.get('/', async (req, res) => {
    try {
        const respuestas = await Respuesta.find(); // consulta todas las respuestas
        res.json(respuestas); // devuelve el resultado en formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener respuestas' }); // mensaje de error
    }
});

module.exports = router;
