require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde Angular
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resenasDB';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB exitosamente'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas de prueba
app.get('/', (req, res) => {
    res.send('Servidor de Reseñas funcionando correctamente');
});

// Importar rutas
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});