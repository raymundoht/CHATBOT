const mongoose = require('mongoose');

const RespuestaSchema = new mongoose.Schema({
    tema: { type: String, required: true },
    pregunta_clave: { type: String, required: true },
    respuesta: { type: String, required: true }
}, {
    collection: 'respuestaschatb', // 👈 esto es CLAVE
    timestamps: true
});

module.exports = mongoose.models.Respuesta || mongoose.model('Respuesta', RespuestaSchema);
