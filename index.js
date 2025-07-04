const express = require('express');
const path = require('path');
const conectarDB = require('./config/db');
require('dotenv').config();
const open = require('open').default; // ✅ ESTA es la forma correcta

const app = express();
app.use(express.json());

conectarDB();

// API
app.use('/respuestas', require('./routes/respuestas'));

// Frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/index.html`);
    open(`http://localhost:${PORT}/index.html`);
});
