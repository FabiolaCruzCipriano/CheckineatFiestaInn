// routes/departamentoRoutes.js

const express = require('express');
const router = express.Router();
const Departamento = require('../models/departamento');

// Obtener todos los departamentos
router.get('/', async (req, res) => {
    try {
        const departamentos = await Departamento.findAll();
        res.json(departamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo departamento
router.post('/', async (req, res) => {
    const { nombre_departamento } = req.body;
    if (!nombre_departamento) {
        return res.status(400).json({ error: 'El nombre del departamento es obligatorio' });
    }
    try {
        const nuevoDepartamento = await Departamento.create({ nombre_departamento });
        res.status(201).json(nuevoDepartamento);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un departamento por ID
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await Departamento.destroy({
            where: { id: req.params.id }
        });
        if (eliminado) {
            res.status(204).json({ message: 'Departamento eliminado' });
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
