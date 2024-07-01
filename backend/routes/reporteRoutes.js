const express = require('express');
const router = express.Router();
const Reporte = require('../models/reporte');

// Obtener todos los reportes
router.get('/', async (req, res) => {
    try {
        const reportes = await Reporte.findAll();
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo reporte
router.post('/', async (req, res) => {
    try {
        const nuevoReporte = await Reporte.create(req.body);
        res.status(201).json(nuevoReporte);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener un reporte por ID
router.get('/:id', async (req, res) => {
    try {
        const reporte = await Reporte.findByPk(req.params.id);
        if (reporte) {
            res.json(reporte);
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un reporte por ID
router.put('/:id', async (req, res) => {
    try {
        const [actualizado] = await Reporte.update(req.body, {
            where: { id_reporte: req.params.id }
        });
        if (actualizado) {
            const reporteActualizado = await Reporte.findByPk(req.params.id);
            res.json(reporteActualizado);
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un reporte por ID
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await Reporte.destroy({
            where: { id_reporte: req.params.id }
        });
        if (eliminado) {
            res.status(204).json({ message: 'Reporte eliminado' });
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
