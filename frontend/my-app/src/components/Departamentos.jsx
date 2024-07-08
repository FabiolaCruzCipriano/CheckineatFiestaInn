import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaBuilding } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import 'sweetalert2/src/sweetalert2.scss';

const schema = yup.object().shape({
    nombre_departamento: yup.string().required('Nombre del departamento es requerido')
});

const Departamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const [isLoading, setIsLoading] = useState(false);

    const cargarDepartamentos = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/departamentos`);
            setDepartamentos(response.data);
            setIsLoading(false);
        } catch (error) {
            showMessage('Error al obtener los departamentos.', 'error');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarDepartamentos();
    }, [cargarDepartamentos]);

    const showMessage = (msg, type) => {
        Swal.fire({
            icon: type,
            title: msg,
            showConfirmButton: false,
            timer: 1500,
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title',
                content: 'swal2-content',
                actions: 'swal2-actions'
            }
        });
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/departamentos`, data);
            cargarDepartamentos();
            reset();
            showMessage('Departamento agregado exitosamente.', 'success');
            setIsLoading(false);
        } catch (error) {
            showMessage('Error al agregar el departamento.', 'error');
            setIsLoading(false);
        }
    };

    const eliminarDepartamento = async (id_departamento) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title',
                content: 'swal2-content',
                actions: 'swal2-actions'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await axios.delete(`${process.env.REACT_APP_API_URL}/departamentos/${id_departamento}`);
                    cargarDepartamentos();
                    showMessage('Departamento eliminado exitosamente.', 'success');
                    setIsLoading(false);
                } catch (error) {
                    showMessage('Error al eliminar el departamento.', 'error');
                    setIsLoading(false);
                }
            }
        });
    };

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col justify-between">
            <main>
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Departamentos</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 border rounded shadow-md bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaBuilding className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Nombre del Departamento"
                                {...register('nombre_departamento')}
                                className={`p-2 pl-10 border ${errors.nombre_departamento ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-fiestaRed-light`}
                            />
                            {errors.nombre_departamento && <p className="text-red-500 text-sm mt-1">{errors.nombre_departamento.message}</p>}
                        </div>
                        <div className="flex justify-center md:justify-end">
                            <button
                                type="submit"
                                className="p-2 bg-fiestaRed-medium text-white rounded h-10 w-35 flex items-center justify-center shadow-md hover:bg-fiestaRed-dark transition duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Agregando...' : <>
                                    <FaPlus className="mr-2" />
                                    Agregar Departamento
                                </>}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Nombre del Departamento</th>
                                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departamentos.map((departamento) => (
                                <tr key={departamento.id_departamento} className="hover:bg-gray-50 transition duration-200">
                                    <td className="py-2 px-4 border-b border-gray-200">{departamento.nombre_departamento}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <button
                                            onClick={() => eliminarDepartamento(departamento.id_departamento)}
                                            className="p-1 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition duration-200"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Eliminando...' : <FaTrash />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Departamentos;
