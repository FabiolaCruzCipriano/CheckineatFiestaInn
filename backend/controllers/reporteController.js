const Reporte = require('../models/reporte');

const createReporte = async (req, res) => {
    try {
        const reporte = await Reporte.create(req.body);
        res.status(201).json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReportes = async (req, res) => {
    try {
        const reportes = await Reporte.findAll();
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReporteById = async (req, res) => {
    try {
        const reporte = await Reporte.findByPk(req.params.id);
        if (reporte) {
            res.status(200).json(reporte);
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateReporte = async (req, res) => {
    try {
        const [updated] = await Reporte.update(req.body, {
            where: { id_reporte: req.params.id }
        });
        if (updated) {
            const updatedReporte = await Reporte.findByPk(req.params.id);
            res.status(200).json(updatedReporte);
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReporte = async (req, res) => {
    try {
        const deleted = await Reporte.destroy({
            where: { id_reporte: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReporte,
    getReportes,
    getReporteById,
    updateReporte,
    deleteReporte
};
