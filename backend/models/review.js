const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    nombreRestaurante: {
        type: String,
        required: true
    },
    calificacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // calificación de 1 a 5
    },
    fechaVisita: {
        type: Date,
        required: true
    },
    observaciones: {
        type: String
    },
    // Relaciona la reseña con el usuario que la creó
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);