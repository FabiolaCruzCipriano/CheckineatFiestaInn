const db = require('../models');
const Administrador = db.Administrador;

// Crear un nuevo administrador
const createAdministrador = async (req, res) => {
    const { nombre, apellido, correo_electronico, contrasena } = req.body;
    try {
        console.log('Datos recibidos para crear:', { nombre, apellido, correo_electronico, contrasena });
        const newAdmin = await Administrador.create({ nombre, apellido, correo_electronico, contrasena });
        res.json(newAdmin);
    } catch (error) {
        console.error('Error al crear administrador:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los administradores
const getAdministradores = async (req, res) => {
    try {
        const admins = await Administrador.findAll();
        res.json(admins);
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un administrador por ID
const getAdministradorById = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Administrador.findByPk(id);
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener administrador por ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un administrador por ID
const updateAdministrador = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo_electronico, contrasena } = req.body;
    try {
        const admin = await Administrador.findByPk(id);
        if (admin) {
            admin.nombre = nombre;
            admin.apellido = apellido;
            admin.correo_electronico = correo_electronico;
            admin.contrasena = contrasena; // Recuerda que el hook de Sequelize se encargará de hash la contraseña
            await admin.save();
            res.json(admin);
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar administrador:', error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un administrador por ID
const deleteAdministrador = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Administrador.findByPk(id);
        if (admin) {
            await admin.destroy();
            res.json({ message: 'Administrador eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Administrador no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar administrador:', error);
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
