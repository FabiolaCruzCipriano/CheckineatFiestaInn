import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Reportes = () => {
    const [reportes, setReportes] = useState([]);
    const [formData, setFormData] = useState({ id_registro: '', id_administrador: '', fecha_inicio: '', fecha_fin: '', tipo_reporte: '', contenido: '' });
    const [editando, setEditando] = useState(false);
    const [reporteEditando, setReporteEditando] = useState(null);

    useEffect(() => {
        obtenerReportes();
    }, []);

    const obtenerReportes = async () => {
        try {
            const response = await axios.get('/api/reportes');
            setReportes(response.data);
        } catch (error) {
            console.error('Error al obtener reportes:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const agregarReporte = async () => {
        if (formData.id_registro && formData.id_administrador && formData.fecha_inicio && formData.fecha_fin && formData.tipo_reporte && formData.contenido) {
            try {
                const response = await axios.post('/api/reportes', formData);
                setReportes([...reportes, response.data]);
                setFormData({ id_registro: '', id_administrador: '', fecha_inicio: '', fecha_fin: '', tipo_reporte: '', contenido: '' });
            } catch (error) {
                console.error('Error al agregar reporte:', error);
            }
        }
    };

    const eliminarReporte = async (id) => {
        try {
            await axios.delete(`/api/reportes/${id}`);
            setReportes(reportes.filter((reporte) => reporte.id_reporte !== id));
        } catch (error) {
            console.error('Error al eliminar reporte:', error);
        }
    };

    const iniciarEdicion = (reporte) => {
        setEditando(true);
        setReporteEditando(reporte);
        setFormData({
            id_registro: reporte.id_registro,
            id_administrador: reporte.id_administrador,
            fecha_inicio: reporte.fecha_inicio,
            fecha_fin: reporte.fecha_fin,
            tipo_reporte: reporte.tipo_reporte,
            contenido: reporte.contenido
        });
    };

    const editarReporte = async () => {
        try {
            const response = await axios.put(`/api/reportes/${reporteEditando.id_reporte}`, formData);
            setReportes(
                reportes.map((reporte) =>
                    reporte.id_reporte === reporteEditando.id_reporte ? response.data : reporte
                )
            );
            setFormData({ id_registro: '', id_administrador: '', fecha_inicio: '', fecha_fin: '', tipo_reporte: '', contenido: '' });
            setEditando(false);
            setReporteEditando(null);
        } catch (error) {
            console.error('Error al editar reporte:', error);
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h1>
            <div className="mb-4 flex space-x-2">
                <input
                    type="number"
                    name="id_registro"
                    placeholder="ID Registro"
                    value={formData.id_registro}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    name="id_administrador"
                    placeholder="ID Administrador"
                    value={formData.id_administrador}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="date"
                    name="fecha_inicio"
                    placeholder="Fecha Inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="date"
                    name="fecha_fin"
                    placeholder="Fecha Fin"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="tipo_reporte"
                    placeholder="Tipo de Reporte"
                    value={formData.tipo_reporte}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="contenido"
                    placeholder="Contenido"
                    value={formData.contenido}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
                {editando ? (
                    <button
                        onClick={editarReporte}
                        className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                    >
                        Editar
                    </button>
                ) : (
                    <button
                        onClick={agregarReporte}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        <FaPlus />
                    </button>
                )}
            </div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 border-b">ID Reporte</th>
                        <th className="py-2 border-b">ID Registro</th>
                        <th className="py-2 border-b">ID Administrador</th>
                        <th className="py-2 border-b">Fecha Inicio</th>
                        <th className="py-2 border-b">Fecha Fin</th>
                        <th className="py-2 border-b">Tipo de Reporte</th>
                        <th className="py-2 border-b">Contenido</th>
                        <th className="py-2 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reportes.map((reporte) => (
                        <tr key={reporte.id_reporte}>
                            <td className="py-2 border-b">{reporte.id_reporte}</td>
                            <td className="py-2 border-b">{reporte.id_registro}</td>
                            <td className="py-2 border-b">{reporte.id_administrador}</td>
                            <td className="py-2 border-b">{reporte.fecha_inicio}</td>
                            <td className="py-2 border-b">{reporte.fecha_fin}</td>
                            <td className="py-2 border-b">{reporte.tipo_reporte}</td>
                            <td className="py-2 border-b">{reporte.contenido}</td>
                            <td className="py-2 border-b space-x-2">
                                <button
                                    onClick={() => iniciarEdicion(reporte)}
                                    className="p-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => eliminarReporte(reporte.id_reporte)}
                                    className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reportes;
