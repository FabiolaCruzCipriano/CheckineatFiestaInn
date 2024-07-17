import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaPlus, FaTrash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Footer from './Footer';

const schema = yup.object().shape({
    nombre: yup.string().required('Nombre es requerido'),
    apellido: yup.string().required('Apellido es requerido'),
    correo_electronico: yup.string().email('Correo electrónico no es válido').required('Correo electrónico es requerido'),
    contrasena: yup.string().required('Contraseña es requerida')
});

const Administradores = () => {
    const [admins, setAdmins] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const fetchAdmins = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3001/administradores');
            setAdmins(response.data);
        } catch (error) {
            showMessage('Error al obtener la lista de administradores.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

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
        try {
            await axios.post('http://localhost:3001/administradores', data);
            showMessage('Administrador agregado exitosamente.', 'success');
            fetchAdmins();
            reset();
            setModalIsOpen(false);
        } catch (error) {
            showMessage(`Error al registrar administrador: ${error.response?.data?.error || error.message}`, 'error');
        }
    };

    const eliminarAdministrador = (id) => {
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
                try {
                    await axios.delete(`http://localhost:3001/administradores/${id}`);
                    showMessage('Administrador eliminado exitosamente.', 'success');
                    fetchAdmins();
                } catch (error) {
                    showMessage('Error al eliminar el administrador.', 'error');
                }
            }
        });
    };

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col justify-between font-roboto">
            <main>
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Administradores</h1>

                <button
                    onClick={() => setModalIsOpen(true)}
                    className="p-2 mb-6 bg-[#B20027] text-white rounded-md h-10 w-35 flex items-center justify-center shadow-md hover:bg-[#742A2A] transition duration-200"
                >
                    <FaPlus className="mr-2" />
                    Agregar Administrador
                </button>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Formulario de Administrador"
                    className="flex items-center justify-center h-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    <div className="relative bg-white rounded-lg shadow p-8 w-full max-w-xl">
                        <button onClick={() => setModalIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            &times;
                        </button>
                        <h2 className="text-2xl mb-4 font-semibold text-gray-700">Agregar Administrador</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    {...register('nombre')}
                                    className={`pl-10 p-2 border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
                            </div>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Apellido"
                                    {...register('apellido')}
                                    className={`pl-10 p-2 border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
                            </div>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    {...register('correo_electronico')}
                                    className={`pl-10 p-2 border ${errors.correo_electronico ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.correo_electronico && <p className="text-red-500 text-sm mt-1">{errors.correo_electronico.message}</p>}
                            </div>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    {...register('contrasena')}
                                    className={`pl-10 p-2 border ${errors.contrasena ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena.message}</p>}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="p-2 bg-[#B20027] text-white rounded-md h-10 w-35 flex items-center justify-center shadow-md hover:bg-[#742A2A] transition duration-200"
                                >
                                    <FaPlus className="mr-2" />
                                    Agregar Administrador
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

                <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Nombre</th>
                                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Apellido</th>
                                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Correo Electrónico</th>
                                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id_administrador} className="hover:bg-gray-50 transition duration-200">
                                    <td className="py-2 px-4 border-b border-gray-200">{admin.nombre}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{admin.apellido}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{admin.correo_electronico}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 flex space-x-2">
                                        <button
                                            onClick={() => eliminarAdministrador(admin.id_administrador)}
                                            className="p-1 bg-[#B20027] text-white rounded shadow-md hover:bg-[#742A2A] transition duration-200"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Administradores;
