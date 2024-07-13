const Registro = require('../models/registro');
const { Op } = require('sequelize');

const getAsistenciaDiaria = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
        const count = await Registro.count({
            where: {
                fecha_asistencia: {
                    [Op.eq]: hoy
                }
            }
        });
        res.status(200).json({ asistenciaDiaria: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al contar asistencia diaria' });
    }
};

module.exports = {
    getAsistenciaDiaria
};
