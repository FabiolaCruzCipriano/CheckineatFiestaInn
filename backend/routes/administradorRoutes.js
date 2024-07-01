// routes/administradorRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Administrador = require('../models/administrador');

// Obtener todos los administradores
router.get('/', async (req, res) => {
    try {
        const administradores = await Administrador.findAll();
        res.json(administradores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo administrador
router.post('/', async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        // Verificar si el correo electrónico ya existe
        const existingAdministrador = await Administrador.findOne({ where: { correo_electronico } });
        if (existingAdministrador) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        req.body.contrasena = hashedPassword;

        const nuevoAdministrador = await Administrador.create(req.body);
        res.status(201).json(nuevoAdministrador);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener un administrador por ID
router.get('/:id', async (req, res) => {
    try {
        const administrador = await Administrador.findByPk(req.params.id);
        if (administrador) {
            res.json(administrador);
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un administrador por ID
router.put('/:id', async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        // Verificar si el correo electrónico ya existe para otro administrador
        const existingAdministrador = await Administrador.findOne({ where: { correo_electronico } });
        if (existingAdministrador && existingAdministrador.id_administrador !== parseInt(req.params.id)) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        const updateData = { ...req.body };

        // Encriptar la nueva contraseña si se proporciona
        if (contrasena) {
            updateData.contrasena = await bcrypt.hash(contrasena, 10);
        }

        const [actualizado] = await Administrador.update(updateData, {
            where: { id_administrador: req.params.id }
        });
        if (actualizado) {
            const administradorActualizado = await Administrador.findByPk(req.params.id);
            res.json(administradorActualizado);
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un administrador por ID
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await Administrador.destroy({
            where: { id_administrador: req.params.id }
        });
        if (eliminado) {
            res.status(204).json({ message: 'Administrador eliminado' });
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
