// src/components/Departamentos.jsx

import React, { useState, useEffect } from 'react';
import { getDepartamentos, createDepartamento, deleteDepartamento } from '../api/departamentos';

const Departamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [nombreDepartamento, setNombreDepartamento] = useState('');

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const response = await getDepartamentos();
                setDepartamentos(response.data);
            } catch (error) {
                console.error('Error al obtener departamentos:', error);
            }
        };

        fetchDepartamentos();
    }, []);

    const handleAddDepartamento = async () => {
        try {
            await createDepartamento({ nombre_departamento: nombreDepartamento });
            const response = await getDepartamentos();
            setDepartamentos(response.data);
            setNombreDepartamento('');
        } catch (error) {
            console.error('Error al agregar departamento:', error);
        }
    };

    const handleDeleteDepartamento = async (id) => {
        try {
            await deleteDepartamento(id);
            const response = await getDepartamentos();
            setDepartamentos(response.data);
        } catch (error) {
            console.error('Error al eliminar departamento:', error);
        }
    };

    return (
        <div>
            <h1>Departamentos</h1>
            <div>
                <input
                    type="text"
                    placeholder="Nombre del Departamento"
                    value={nombreDepartamento}
                    onChange={(e) => setNombreDepartamento(e.target.value)}
                />
                <button onClick={handleAddDepartamento}>Agregar Departamento</button>
            </div>
            <ul>
                {departamentos.map((departamento) => (
                    <li key={departamento.id_departamento}>
                        {departamento.nombre_departamento}
                        <button onClick={() => handleDeleteDepartamento(departamento.id_departamento)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Departamentos;
