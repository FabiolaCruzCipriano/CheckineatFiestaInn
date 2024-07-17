const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Administrador } = require('../models');

const login = async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
    try {
        const admin = await Administrador.findOne({ where: { correo_electronico } });
        if (!admin) {
            return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }
        const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }

        // Crear token JWT
        const token = jwt.sign({ id: admin.id_administrador }, 'your_jwt_secret', { expiresIn: '1h' });

        // Guardar sesión en el servidor
        req.session.token = token;

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Sesión cerrada exitosamente' });
    });
};

module.exports = {
    login,
    logout
};
