import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerRegistros = () => {
    const [registros, setRegistros] = useState([]);

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const response = await axios.get('http://localhost:3001/registros');
                setRegistros(response.data);
            } catch (error) {
                console.error('Error al obtener los registros:', error);
            }
        };

        fetchRegistros();
    }, []);

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Registros de Empleados</h1>
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">ID Empleado</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Nombre</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Apellidos</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Departamento</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Fecha</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((registro) => (
                            <tr key={registro.id_registro} className="hover:bg-gray-50 transition duration-200">
                                <td className="py-2 px-4 border-b border-gray-200">{registro.id_empleado}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{registro.nombre}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{registro.apellidos}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{registro.departamento}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{registro.fecha_asistencia}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{registro.hora_asistencia}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerRegistros;
