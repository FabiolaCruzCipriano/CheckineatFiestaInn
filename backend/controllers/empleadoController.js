const Empleado = require('../models/empleado');
const Departamento = require('../models/departamento');
exports.getEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.findAll({
            include: {
                model: Departamento,
                attributes: ['nombre_departamento']
            }
        });
        res.json(empleados);
    } catch (error) {
        console.error('Error al obtener los empleados:', error);
        res.status(500).send('Error al obtener los empleados');
    }
};
exports.createEmpleado = async (req, res) => {
    const { id_departamento, nombre, apellidos, estatus, numeroempleado } = req.body;
    try {
        const nuevoEmpleado = await Empleado.create({
            id_departamento,
            nombre,
            apellidos,
            estatus,
            numeroempleado});
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        console.error('Error al crear el empleado:', error.message || error);
        res.status(500).send(`Error al crear el empleado: ${error.message || error}`);
    }
};
exports.updateEmpleado = async (req, res) => {
    const { id_departamento, nombre, apellidos, estatus, numeroempleado } = req.body;
    const { id } = req.params;
    try {
        await Empleado.update(
            { id_departamento, nombre, apellidos, estatus, numeroempleado },
            { where: { id_empleado: id } }
        );
        res.status(200).send('Empleado actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        res.status(500).send('Error al actualizar el empleado');
    }
};
exports.deleteEmpleado = async (req, res) => {
    const { id } = req.params;
    try {
        await Empleado.destroy({ where: { id_empleado: id } });
        res.status(200).send('Empleado eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        res.status(500).send('Error al eliminar el empleado');
    }
};
