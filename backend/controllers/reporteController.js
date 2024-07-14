const Registro = require('../models/registro');
const { Op } = require('sequelize');

const generarReporte = async (req, res) => {
    const { tipo, fechaInicio, fechaFin } = req.query;

    let startDate;
    let endDate = new Date();

    if (fechaInicio && fechaFin) {
        startDate = new Date(fechaInicio);
        endDate = new Date(fechaFin);
    } else {
        if (tipo === 'diario') {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        } else if (tipo === 'semanal') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (tipo === 'mensual') {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
        } else {
            return res.status(400).json({ error: 'Tipo de reporte no válido' });
        }
    }

    try {
        const registros = await Registro.findAll({
            where: {
                fecha_asistencia: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        console.log('Registros generados:', registros);
        res.status(200).json(registros);  // Devuelve solo el arreglo de registros
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
};

module.exports = {
    generarReporte,
};
