const Departamento = require('../models/departamento');

const createDepartamento = async (req, res) => {
    try {
        const departamento = await Departamento.create(req.body);
        res.status(201).json(departamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDepartamentos = async (req, res) => {
    try {
        const departamentos = await Departamento.findAll();
        res.status(200).json(departamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDepartamentoById = async (req, res) => {
    try {
        const departamento = await Departamento.findByPk(req.params.id);
        if (departamento) {
            res.status(200).json(departamento);
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDepartamento = async (req, res) => {
    try {
        const [updated] = await Departamento.update(req.body, {
            where: { id_departamento: req.params.id }
        });
        if (updated) {
            const updatedDepartamento = await Departamento.findByPk(req.params.id);
            res.status(200).json(updatedDepartamento);
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDepartamento = async (req, res) => {
    try {
        const deleted = await Departamento.destroy({
            where: { id_departamento: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDepartamento,
    getDepartamentos,
    getDepartamentoById,
    updateDepartamento,
    deleteDepartamento
};
