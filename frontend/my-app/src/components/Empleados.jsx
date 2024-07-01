import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import QRCode from 'qrcode.react';

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        id_departamento: '',
        nombre: '',
        apellidos: '',
        estatus: '',
        numeroempleado: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const cargarEmpleados = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/empleados`);
            setEmpleados(response.data);
        } catch (error) {
            showMessage('Error al obtener los empleados.', 'error');
            console.error('Error al obtener los empleados:', error);
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const agregarEmpleado = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/empleados`, nuevoEmpleado);
            cargarEmpleados();
            setNuevoEmpleado({
                id_departamento: '',
                nombre: '',
                apellidos: '',
                estatus: '',
                numeroempleado: ''
            });
            showMessage('Empleado agregado exitosamente.', 'success');
        } catch (error) {
            showMessage('Error al agregar el empleado.', 'error');
            console.error('Error al agregar el empleado:', error);
        }
    };

    const actualizarEmpleado = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/empleados/${editingId}`, nuevoEmpleado);
            cargarEmpleados();
            setNuevoEmpleado({
                id_departamento: '',
                nombre: '',
                apellidos: '',
                estatus: '',
                numeroempleado: ''
            });
            setEditMode(false);
            setEditingId(null);
            showMessage('Empleado actualizado exitosamente.', 'success');
        } catch (error) {
            showMessage('Error al actualizar el empleado.', 'error');
            console.error('Error al actualizar el empleado:', error);
        }
    };

    const eliminarEmpleado = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/empleados/${id}`);
            cargarEmpleados();
            showMessage('Empleado eliminado exitosamente.', 'success');
        } catch (error) {
            showMessage('Error al eliminar el empleado.', 'error');
            console.error('Error al eliminar el empleado:', error);
        }
    };

    const iniciarEdicion = (empleado) => {
        setNuevoEmpleado({
            id_departamento: empleado.Departamento ? empleado.Departamento.id_departamento : '',
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            estatus: empleado.estatus,
            numeroempleado: empleado.numeroempleado
        });
        setEditMode(true);
        setEditingId(empleado.id_empleado);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Empleados</h1>

            {message && (
                <div className={`p-2 rounded mb-4 text-center text-sm w-1/4 mx-auto ${messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-400' : 'bg-red-100 text-red-800 border border-red-400'}`} style={{ height: '45px' }}>
                    {message}
                </div>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
                <input
                    type="text"
                    placeholder="ID del Departamento"
                    value={nuevoEmpleado.id_departamento}
                    onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, id_departamento: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
                />
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevoEmpleado.nombre}
                    onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
                />
                <input
                    type="text"
                    placeholder="Apellidos"
                    value={nuevoEmpleado.apellidos}
                    onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellidos: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
                />
                <input
                    type="text"
                    placeholder="Estatus"
                    value={nuevoEmpleado.estatus}
                    onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, estatus: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
                />
                <input
                    type="text"
                    placeholder="Número de Empleado"
                    value={nuevoEmpleado.numeroempleado}
                    onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, numeroempleado: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
                />
                <button
                    onClick={editMode ? actualizarEmpleado : agregarEmpleado}
                    className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto flex items-center justify-center shadow-md hover:bg-blue-600 transition duration-200"
                >
                    {editMode ? 'Actualizar Empleado' : <>
                        <FaPlus className="mr-2" />
                        Agregar Empleado
                    </>}
                </button>
            </div>
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Nombre del Departamento</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Nombre</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Apellidos</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Estatus</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Número de Empleado</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Código QR</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map((empleado) => (
                            <tr key={empleado.id_empleado} className="hover:bg-gray-50 transition duration-200">
                                <td className="py-2 px-4 border-b border-gray-200">{empleado.Departamento ? empleado.Departamento.nombre_departamento : 'N/A'}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{empleado.nombre}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{empleado.apellidos}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{empleado.estatus}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{empleado.numeroempleado}</td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <QRCode value={empleado.numeroempleado} size={50} />
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 flex space-x-2">
                                    <button
                                        onClick={() => iniciarEdicion(empleado)}
                                        className="p-1 bg-yellow-500 text-white rounded shadow-md hover:bg-yellow-600 transition duration-200"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => eliminarEmpleado(empleado.id_empleado)}
                                        className="p-1 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition duration-200"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Empleados;
