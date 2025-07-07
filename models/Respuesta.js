// guarda las respuestas del chat
const mongoose = require('mongoose');

//Define la estructura que tendrá cada respuesta del chatbot en la base de datos
const RespuestaSchema = new mongoose.Schema({
    tema: { type: String, required: true },
    pregunta_clave: { type: String, required: true },
    respuesta: { type: String, required: true } 
}, {
    // Guarda cuándo se creó y actualizó cada respuesta en la coleccion de la base de datos
    collection: 'respuestaschatb',
    timestamps: true
});

// exporta el modelo
module.exports = mongoose.models.Respuesta || mongoose.model('Respuesta', RespuestaSchema);
