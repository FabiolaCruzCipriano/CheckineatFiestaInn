import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaBuilding, FaUser, FaIdBadge, FaEnvelope, FaDownload } from 'react-icons/fa';
import { QRCode } from 'react-qrcode-logo';
import Footer from './Footer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { Oval } from 'react-loader-spinner';

// Definir el elemento principal de la aplicación para react-modal
Modal.setAppElement('#root');

const schema = yup.object().shape({
    nombre_departamento: yup.string().required('Nombre del departamento es requerido'),
    nombre: yup.string().required('Nombre es requerido'),
    apellidos: yup.string().required('Apellidos son requeridos'),
    estatus: yup.string().required('Estatus es requerido'),
    numeroempleado: yup.string().required('Número de empleado es requerido'),
    email: yup.string().email('Correo electrónico no es válido').required('Correo electrónico es requerido')
});

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const cargarEmpleados = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/empleados`);
            setEmpleados(response.data);
            setIsLoading(false);
        } catch (error) {
            showMessage('Error al obtener los empleados.', 'error');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarEmpleados();
    }, [cargarEmpleados]);

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
                confirmButton: 'rounded bg-[#B20027] text-white',
                cancelButton: 'rounded bg-blue-500 text-white'
            },
            didOpen: () => {
                const popup = Swal.getPopup();
                if (type === 'success') {
                    const icon = popup.querySelector('.swal2-success-circular-line-left, .swal2-success-circular-line-right');
                    if (icon) {
                        icon.style.borderColor = '#00bb2d';
                    }
                    const successIcon = popup.querySelector('.swal2-success-line-tip, .swal2-success-line-long');
                    if (successIcon) {
                        successIcon.style.backgroundColor = '#00bb2d';
                    }
                }
            }
        });
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (editMode) {
                await axios.put(`${process.env.REACT_APP_API_URL}/empleados/${editingId}`, data);
                showMessage('Empleado actualizado exitosamente.', 'success');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/empleados`, data);
                showMessage('Empleado agregado exitosamente.', 'success');
            }
            cargarEmpleados();
            reset();
            setEditMode(false);
            setEditingId(null);
            setModalIsOpen(false);
            setIsLoading(false);
        } catch (error) {
            showMessage('Error al procesar el empleado.', 'error');
            setIsLoading(false);
        }
    };

    const eliminarEmpleado = (id) => {
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
                confirmButton: 'bg-[#B20027] text-white rounded',
                cancelButton: 'bg-blue-500 text-white rounded'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await axios.delete(`${process.env.REACT_APP_API_URL}/empleados/${id}`);
                    showMessage('Empleado eliminado exitosamente.', 'success');
                    cargarEmpleados();
                    setIsLoading(false);
                } catch (error) {
                    showMessage('Error al eliminar el empleado.', 'error');
                    setIsLoading(false);
                }
            }
        });
    };

    const iniciarEdicion = (empleado) => {
        reset({
            nombre_departamento: empleado.Departamento ? empleado.Departamento.nombre_departamento : '',
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            estatus: empleado.estatus,
            numeroempleado: empleado.numeroempleado,
            email: empleado.email
        });
        setEditMode(true);
        setEditingId(empleado.id_empleado);
        setModalIsOpen(true);
    };

    const handleDownloadQR = (empleado) => {
        const canvas = document.getElementById(`qr-${empleado.id_empleado}`);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${empleado.numeroempleado}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const enviarCorreoConQRCode = async (empleado) => {
        const canvas = document.getElementById(`qr-${empleado.id_empleado}`);
        const qrDataUrl = canvas.toDataURL("image/png");

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/enviarCorreo`, {
                to: empleado.email,
                subject: 'Tu código QR',
                text: '',
                html: `
                    <p>Hola ${empleado.nombre},</p>
                    <p>Aquí está tu código QR:</p>
                    <img src="cid:unique@qr.code" alt="Código QR" />
                    <p>Por favor, presenta este código QR cuando sea necesario.</p>
                    <p>Saludos,<br>El equipo de CheckInEat</p>
                `,
                qrDataUrl: qrDataUrl
            });
            showMessage('Correo enviado exitosamente.', 'success');
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            showMessage('Error al enviar el correo.', 'error');
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col justify-between">
            <main>
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Empleados</h1>

                <button
                    onClick={() => setModalIsOpen(true)}
                    className="p-2 mb-6 bg-[#B20027] text-white rounded-md h-10 w-35 flex items-center justify-center shadow-md hover:bg-[#742A2A] transition duration-200"
                >
                    <FaPlus className="mr-2" />
                    Agregar Empleado
                </button>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Formulario de Empleado"
                    className="flex items-center justify-center h-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    <div className="relative bg-white rounded-lg shadow p-8 w-full   max-w-4xl">
                        <button onClick={() => setModalIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            &times;
                        </button>
                        <h2 className="text-2xl mb-4 font-semibold text-gray-700">Agregar Empleado</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="relative">
                                <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Nombre Departamento"
                                    {...register('nombre_departamento')}
                                    className={`pl-10 p-2 border ${errors.nombre_departamento ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.nombre_departamento && <p className="text-red-500 text-sm mt-1">{errors.nombre_departamento.message}</p>}
                            </div>
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
                                    placeholder="Apellidos"
                                    {...register('apellidos')}
                                    className={`pl-10 p-2 border ${errors.apellidos ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.apellidos && <p className="text-red-500 text-sm mt-1">{errors.apellidos.message}</p>}
                            </div>
                            <div className="relative">
                                <FaIdBadge className="absolute left-3 top-3 text-gray-400" />
                                <select
                                    {...register('estatus')}
                                    className={`pl-10 p-2 border ${errors.estatus ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                >
                                    <option value="">Seleccione Estatus</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                                {errors.estatus && <p className="text-red-500 text-sm mt-1">{errors.estatus.message}</p>}
                            </div>
                            <div className="relative">
                                <FaIdBadge className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Número de Empleado"
                                    {...register('numeroempleado')}
                                    className={`pl-10 p-2 border ${errors.numeroempleado ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.numeroempleado && <p className="text-red-500 text-sm mt-1">{errors.numeroempleado.message}</p>}
                            </div>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    {...register('email')}
                                    className={`pl-10 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:ring focus:ring-[#B20027]`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="p-2 bg-[#B20027] text-white rounded-md h-10 w-35 flex items-center justify-center shadow-md hover:bg-[#742A2A] transition duration-200"
                                >
                                    {editMode ? 'Actualizar Empleado' : <>
                                        <FaPlus className="mr-2" />
                                        Agregar Empleado
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
                        placeholder="Buscar empleado"
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
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Nombre</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Apellidos</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Estatus</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Número de Empleado</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Correo Electrónico</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Código QR</th>
                                    <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-xs md:text-sm leading-4 text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empleados.filter((empleado) =>
                                    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    empleado.numeroempleado.toString().includes(searchTerm)
                                ).map((empleado) => (
                                    <tr key={empleado.id_empleado} className="hover:bg-gray-50 transition duration-200">
                                        <td className="py-2 px-4 border-b border-gray-200">{empleado.Departamento ? empleado.Departamento.nombre_departamento : 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{empleado.nombre}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{empleado.apellidos}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{empleado.estatus}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{empleado.numeroempleado}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{empleado.email}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <QRCode
                                                id={`qr-${empleado.id_empleado}`}
                                                value={empleado.numeroempleado}
                                                size={100}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 flex space-x-2">
                                            <button
                                                onClick={() => iniciarEdicion(empleado)}
                                                className="p-1 bg-[#B20027] text-white rounded shadow-md hover:bg-[#742A2A] transition duration-200"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => eliminarEmpleado(empleado.id_empleado)}
                                                className="p-1 bg-[#B20027] text-white rounded shadow-md hover:bg-[#742A2A] transition duration-200"
                                            >
                                                <FaTrash />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadQR(empleado)}
                                                className="p-1 bg-[#B20027] text-white rounded shadow-md hover:bg-[#742A2A] transition duration-200"
                                            >
                                                <FaDownload />
                                            </button>
                                            <button
                                                onClick={() => enviarCorreoConQRCode(empleado)}
                                                className="p-1 bg-[#B20027] text-white rounded shadow-md hover:bg-[#742A2A] transition duration-200"
                                            >
                                                <FaEnvelope />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Empleados;
