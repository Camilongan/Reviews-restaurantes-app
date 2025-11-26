const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'soeprltioasdkoawe.-,.,,oweiru123123';

// RUTA: Registrar Usuario
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Verificar si usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

// RUTA: Iniciar Sesión (Login)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });

        // Generar Token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error });
    }
});

module.exports = router;