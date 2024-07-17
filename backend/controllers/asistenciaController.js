const Registro = require('../models/registro');
const { Op, fn, col, literal } = require('sequelize');

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

const getAsistenciaMensual = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const asistenciaMensual = await Registro.findAll({
            attributes: [
                [literal(`DATE_FORMAT(fecha_asistencia, '%Y-%m')`), 'mes'],
                [fn('COUNT', col('id_registro')), 'cantidad']
            ],
            where: {
                fecha_asistencia: {
                    [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`]
                }
            },
            group: [literal(`DATE_FORMAT(fecha_asistencia, '%Y-%m')`)],
            order: [literal(`DATE_FORMAT(fecha_asistencia, '%Y-%m') ASC`)]
        });

        const meses = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];

        const asistenciaPorMes = meses.map((mes, index) => {
            const mesEncontrado = asistenciaMensual.find(
                registro => new Date(registro.dataValues.mes).getMonth() === index
            );
            return mesEncontrado ? mesEncontrado.dataValues.cantidad : 0;
        });

        res.status(200).json(asistenciaPorMes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la asistencia mensual' });
    }
};

module.exports = {
    getAsistenciaDiaria,
    getAsistenciaMensual
};
