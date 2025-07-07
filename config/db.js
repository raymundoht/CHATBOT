// Importa la librería Mongoose para interactuar con MongoDB
const mongoose = require('mongoose');

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

//se conecta a la base de datos de mongo desde la URI que esta en .env
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        });
        // Si se conecta muesta el mendaje en la consola
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        // Si no se conecta muesta el mendaje en la consola
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); // Finaliza el proceso con código de error
    }
};
// Exporta la funcion para que pueda ser utilizada desde otro archivo 
module.exports = conectarDB;
