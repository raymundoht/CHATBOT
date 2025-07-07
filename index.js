// Importa Express para crear el servidor web, manejar las rutas,conectar ala bese, relacionar
const express = require('express');
const path = require('path');
const conectarDB = require('./config/db');
const historialRoutes = require('./routes/historialRoutes');
require('dotenv').config();
const open = require('open').default;

const app = express();
app.use(express.json());
conectarDB();

// maneja el historial de preguntas
app.use('/api/historial', historialRoutes);
app.use('/respuestas', require('./routes/respuestas'));
app.use(express.static(path.join(__dirname, 'public')));

//te lleva a index.html
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/index.html`);
    open(`http://localhost:${PORT}/index.html`);// Abre el navegador 
});
