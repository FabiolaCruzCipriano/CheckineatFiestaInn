const bcrypt = require('bcrypt');
const Administrador = require('../models/administrador');

const register = async (req, res) => {
    const { nombre, apellido, correo_electronico, contrasena } = req.body;

    try {
        const existingAdmin = await Administrador.findOne({ where: { correo_electronico } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        console.log('Hashed password during registration:', hashedPassword);

        const newAdmin = await Administrador.create({
            nombre,
            apellido,
            correo_electronico,
            contrasena: hashedPassword,
        });

        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { correo_electronico, contrasena } = req.body;

    try {
        console.log('Attempting login for:', correo_electronico);
        const admin = await Administrador.findOne({ where: { correo_electronico } });
        if (!admin) {
            console.log('Admin not found');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        console.log('Admin found:', admin);
        console.log('Provided password:', contrasena);
        console.log('Stored password:', admin.contrasena);

        const isPasswordValid = await bcrypt.compare(contrasena, admin.contrasena);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        req.session.user = admin; // Guardar datos de sesión
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Cierre de sesión exitoso' });
    });
};

module.exports = {
    register,
    login,
    logout,
};
