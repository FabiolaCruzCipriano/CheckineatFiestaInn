const Empleado = require('../models/empleado');
const Registro = require('../models/registro');

exports.createRegistro = async (req, res) => {
    try {
        const { numeroEmpleado } = req.body;
        const empleado = await Empleado.findOne({ where: { numeroempleado: numeroEmpleado } });

        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        const fechaHora = new Date();
        const fechaAsistencia = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Mexico_City' }).format(fechaHora);
        const horaAsistencia = new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Mexico_City' }).format(fechaHora);

        const registro = await Registro.create({
            numeroempleado: numeroEmpleado,
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            departamento: empleado.nombre_departamento,
            fecha_asistencia: fechaAsistencia.split('/').reverse().join('-'), // Convertir a formato YYYY-MM-DD
            hora_asistencia: horaAsistencia
        });

        res.status(201).json({ message: 'Registro creado exitosamente', registro });
    } catch (error) {
        console.error('Error al crear el registro:', error);
        res.status(500).json({ error: 'Error al crear el registro', details: error.message });
    }
};

exports.getRegistros = async (req, res) => {
    try {
        const registros = await Registro.findAll();
        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al obtener los registros:', error);
        res.status(500).json({ error: 'Error al obtener los registros', details: error.message });
    }
};
