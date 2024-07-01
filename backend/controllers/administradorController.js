const bcrypt = require('bcrypt');
const Administrador = require('../models/administrador');

const createAdministrador = async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        const existingAdministrador = await Administrador.findOne({ where: { correo_electronico } });
        if (existingAdministrador) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        req.body.contrasena = hashedPassword;

        const nuevoAdministrador = await Administrador.create(req.body);
        res.status(201).json(nuevoAdministrador);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAdministradores = async (req, res) => {
    try {
        const administradores = await Administrador.findAll();
        res.status(200).json(administradores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAdministradorById = async (req, res) => {
    try {
        const administrador = await Administrador.findByPk(req.params.id);
        if (administrador) {
            res.status(200).json(administrador);
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAdministrador = async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        const existingAdministrador = await Administrador.findOne({ where: { correo_electronico } });
        if (existingAdministrador && existingAdministrador.id_administrador !== parseInt(req.params.id)) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        const updateData = { ...req.body };

        if (contrasena) {
            updateData.contrasena = await bcrypt.hash(contrasena, 10);
        }

        const [actualizado] = await Administrador.update(updateData, {
            where: { id_administrador: req.params.id }
        });
        if (actualizado) {
            const administradorActualizado = await Administrador.findByPk(req.params.id);
            res.status(200).json(administradorActualizado);
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAdministrador = async (req, res) => {
    try {
        const deleted = await Administrador.destroy({
            where: { id_administrador: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAdministrador,
    getAdministradores,
    getAdministradorById,
    updateAdministrador,
    deleteAdministrador
};
