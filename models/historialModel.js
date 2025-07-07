//guardar lo que pregunta cada persona
import mongoose from 'mongoose';

//se consulta lo que pregunto y cuando lo hizo
const historialSchema = new mongoose.Schema({
  pregunta: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  fecha: { type: Date, default: Date.now }, 
});

// lo exportamos al historial para verlo cuando queramos
export const Historial = mongoose.model('Historial', historialSchema);
