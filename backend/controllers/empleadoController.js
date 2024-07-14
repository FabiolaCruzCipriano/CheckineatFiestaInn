const { Empleado, Departamento } = require('../models');
const enviarCorreo = require('../enviarCorreo');
const QRCode = require('qrcode');

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
    const { nombre_departamento, nombre, apellidos, estatus, numeroempleado, email } = req.body;
    try {
        const nuevoEmpleado = await Empleado.create({
            nombre_departamento,
            nombre,
            apellidos,
            estatus,
            numeroempleado,
            email
        });

        try {
            const qrDataUrl = `data:image/png;base64,${Buffer.from(await QRCode.toDataURL(numeroempleado)).toString('base64')}`;
            await enviarCorreo(email, 'Tu código QR', '', `<p>Hola ${nombre},</p><p>Aquí está tu código QR:</p><img src="${qrDataUrl}" alt="Código QR" />`);
        } catch (emailError) {
            console.error('Error al enviar el correo:', emailError);
            // Opcional: puedes elegir no lanzar el error si el envío de correo falla
            // res.status(500).send('Error al enviar el correo.');
        }

        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        console.error('Error al crear el empleado:', error.message || error);
        res.status(500).send(`Error al crear el empleado: ${error.message || error}`);
    }
};

exports.updateEmpleado = async (req, res) => {
    const { nombre_departamento, nombre, apellidos, estatus, numeroempleado, email } = req.body;
    const { id } = req.params;
    try {
        await Empleado.update(
            { nombre_departamento, nombre, apellidos, estatus, numeroempleado, email },
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

exports.getTotalEmpleados = async (req, res) => {
    try {
        const count = await Empleado.count();
        res.status(200).json({ totalEmpleados: count });
    } catch (error) {
        res.status(500).json({ error: 'Error al contar empleados' });
    }
};
