const Empleado = require('../models/empleado');
const Registro = require('../models/Registro');
exports.createRegistro = async (req, res) => {
    try {
        const { numeroEmpleado } = req.body;
        const empleado = await Empleado.findOne({ where: { id_empleado: numeroEmpleado } });

        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        const fechaHora = new Date();
        const fechaAsistencia = fechaHora.toISOString().split('T')[0];
        const horaAsistencia = fechaHora.toTimeString().split(' ')[0];
const registro = await Registro.create({
            id_empleado: empleado.id_empleado,
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            departamento: empleado.departamento,
            fecha_asistencia: fechaAsistencia,
            hora_asistencia: horaAsistencia
        });
        res.status(201).json({ message: 'Registro creado exitosamente', registro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el registro' });
    }
};
