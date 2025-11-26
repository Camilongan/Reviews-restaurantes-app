const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const auth = require('../middleware/authMiddleware');

// Todas las rutas aquí usan el middleware 'auth' para protegerlas

// 1. CREAR una reseña (POST)
router.post('/', auth, async (req, res) => {
    try {
        const { nombreRestaurante, calificacion, fechaVisita, observaciones } = req.body;

        const newReview = new Review({
            nombreRestaurante,
            calificacion,
            fechaVisita,
            observaciones,
            usuarioId: req.user.id 
        });

        const review = await newReview.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear reseña' });
    }
});

// 2. LEER todas las reseñas DEL USUARIO (GET)
router.get('/', auth, async (req, res) => {
    try {
        // Filtramos SOLO las que coincidan con el ID del usuario logueado
        const reviews = await Review.find({ usuarioId: req.user.id });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reseñas' });
    }
});

// 3. ACTUALIZAR una reseña (PUT)
router.put('/:id', auth, async (req, res) => {
    try {
        const { nombreRestaurante, calificacion, fechaVisita, observaciones } = req.body;

        // Buscamos la reseña por ID de reseña Y por ID de usuario
        // Esto evita que alguien modifique una reseña que no es suya sabiendo el ID
        let review = await Review.findOneAndUpdate(
            { _id: req.params.id, usuarioId: req.user.id },
            { nombreRestaurante, calificacion, fechaVisita, observaciones },
            { new: true } // Para que devuelva el objeto actualizado
        );

        if (!review) return res.status(404).json({ message: 'Reseña no encontrada o no autorizado' });

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar' });
    }
});

// 4. ELIMINAR una reseña (DELETE)
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.id, usuarioId: req.user.id });

        if (!review) return res.status(404).json({ message: 'Reseña no encontrada o no autorizado' });

        res.json({ message: 'Reseña eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
});

module.exports = router;