const express = require('express');
const router = express.Router();
const Respuesta = require('../models/Respuesta');

// GET /respuestas
router.get('/', async (req, res) => {
    try {
        const respuestas = await Respuesta.find();
        res.json(respuestas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener respuestas' });
    }
});

module.exports = router;
