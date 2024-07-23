import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaBuilding } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import 'sweetalert2/src/sweetalert2.scss';
import { Oval } from 'react-loader-spinner';

const schema = yup.object().shape({
    nombre_departamento: yup.string().required('Nombre del departamento es requerido')
});

const Departamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
                actions: 'swal2-actions',
                confirmButton: `rounded-md p-2 ${type === 'success' ? 'bg-[#00bb2d]' : 'bg-[#B20027]'} text-white hover:${type === 'success' ? 'bg-green-600' : 'bg-[#742A2A]'} transition duration-200`,
                cancelButton: 'rounded-md p-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-200'
            }
        });
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (editMode) {
                await axios.put(`${process.env.REACT_APP_API_URL}/departamentos/${editingId}`, data);
                showMessage('Departamento actualizado exitosamente.', 'success');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/departamentos`, data);
                showMessage('Departamento agregado exitosamente.', 'success');
            }
            cargarDepartamentos();
            reset();
            setEditMode(false);
            setEditingId(null);
            setIsLoading(false);
            setModalIsOpen(false);
        } catch (error) {
            showMessage('Error al procesar el departamento.', 'error');
            setIsLoading(false);
        }
    };

    const iniciarEdicion = (departamento) => {
        reset({
            nombre_departamento: departamento.nombre_departamento
        });
        setEditMode(true);
        setEditingId(departamento.id_departamento);
        setModalIsOpen(true);
    };

    const eliminarDepartamento = async (id_departamento) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B20027',
            cancelButtonColor: '#3B82F6', // Azul personalizado bg-blue-500
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title',
                content: 'swal2-content',
                actions: 'swal2-actions',
                confirmButton: 'rounded-md p-2 bg-[#B20027] text-white hover:bg-[#742A2A] transition duration-200',
                cancelButton: 'rounded-md p-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-200'
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

                <button
                    onClick={() => setModalIsOpen(true)}
                    className="p-2 mb-6 bg-[#B20027] text-white rounded-md h-10 w-35 flex items-center justify-center shadow-md hover:bg-[#742A2A] transition duration-200"
                >
                    <FaPlus className="mr-2" />
                    Agregar Departamento
                </button>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Formulario de Departamento"
                    className="flex items-center justify-center h-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    <div className="relative bg-white rounded-lg shadow p-8 w-full max-w-xl">
                        <button onClick={() => setModalIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            &times;
                        </button>
                        <h2 className="text-2xl mb-4 font-semibold text-gray-700">Agregar Departamento</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="relative">
                                <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Nombre del Departamento"
                                    {...register('nombre_departamento')}
                                    className={`pl-10 p-2 border ${errors.nombre_departamento ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.nombre_departamento && <p className="text-red-500 text-sm mt-1">{errors.nombre_departamento.message}</p>}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="p-2 bg-[#B20027] text-white rounded-md h-10 w-35 flex items-center justify-center shadow-md hover:bg-[#742A2A] transition duration-200"
                                >
                                    {editMode ? 'Actualizar Departamento' : <>
                                        <FaPlus className="mr-2" />
                                        Agregar Departamento
                                    </>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalIsOpen(false)}
                                    className="p-2 ml-4 bg-blue-500 text-white rounded-md h-10 w-35 flex items-center justify-center shadow-md hover:bg-blue-600 transition duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <div className="relative mb-6 max-w-xs">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar departamento"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 pl-8 border border-gray-300 rounded w-full focus:ring focus:ring-[#B20027]"
                    />
                </div>

                <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center">
                            <Oval height="100" width="100" color="#B20027" ariaLabel="loading" />
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Nombre del Departamento</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departamentos.filter((departamento) =>
                                    departamento.nombre_departamento.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((departamento) => (
                                    <tr key={departamento.id_departamento} className="hover:bg-gray-50 transition duration-200">
                                        <td className="py-2 px-4 border-b border-gray-200">{departamento.nombre_departamento}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 flex space-x-2">
                                            <button
                                                onClick={() => iniciarEdicion(departamento)}
                                                className="p-1 bg-[#B20027] text-white rounded shadow-md hover:bg-[#742A2A] transition duration-200"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => eliminarDepartamento(departamento.id_departamento)}
                                                className="p-1 bg-[#B20027] text-white rounded shadow-md hover:bg-[#742A2A] transition duration-200"
                                                disabled={isLoading}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <footer className="bg-white text-gray-800 p-4 text-center">
                    © {new Date().getFullYear()} Fiesta Inn Hoteles. Todos los derechos reservados.
                </footer>
            </main>
        </div>
        
    );
};

export default Departamentos;
