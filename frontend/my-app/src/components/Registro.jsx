import React, { useState, useRef } from 'react';
import { QrReader } from '@blackbox-vision/react-qr-reader';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registro = () => {
    const [empleadoNumero, setEmpleadoNumero] = useState(null);
    const [scanSuccess, setScanSuccess] = useState(false);
    const errorTimeout = useRef(null);

    const handleScan = async (result) => {
        if (result) {
            setEmpleadoNumero(result);
            setScanSuccess(true);
            toast.success(`Empleado ${result} registrado exitosamente!`, {
                autoClose: 2000,
                hideProgressBar: true,
            });

            try {
                // Hacer la solicitud al backend para registrar el empleado
                const response = await axios.post('http://localhost:3001/registros', {
                    numeroEmpleado: result,
                    // Puedes agregar más datos si es necesario
                });

                if (response.status === 201) {
                    toast.success('Registro guardado exitosamente!', {
                        autoClose: 2000,
                        hideProgressBar: true,
                    });
                } else {
                    throw new Error('Error al registrar el empleado');
                }
            } catch (error) {
                console.error('Error al registrar el empleado:', error);
                toast.error('Error al registrar el empleado.', {
                    autoClose: 2000,
                    hideProgressBar: true,
                });
            }
        }
    };

    const handleError = (err) => {
        if (scanSuccess) return;

        console.error('Error al escanear el código QR:', err);

        if (errorTimeout.current) {
            return;
        }

        toast.error('Error al escanear el código QR.', {
            autoClose: 2000,
            hideProgressBar: true,
        });

        errorTimeout.current = setTimeout(() => {
            errorTimeout.current = null;
        }, 5000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h1 className="text-2xl font-semibold mb-4 text-center">Registro de Empleado</h1>
                <QrReader
                    onResult={(result, error) => {
                        if (result) {
                            handleScan(result?.text);
                        }
                        if (error) {
                            handleError(error);
                        }
                    }}
                    constraints={{ facingMode: 'environment' }}
                    scanDelay={300}
                    style={{ width: '100%' }}
                />
                {empleadoNumero && (
                    <p className="mt-4 text-green-600 text-lg font-semibold text-center">
                        Número de Empleado: {empleadoNumero}
                    </p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Registro;
