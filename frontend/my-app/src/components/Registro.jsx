import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registro = () => {
    const [empleadoNumero, setEmpleadoNumero] = useState(null);
    const [lastScannedCode, setLastScannedCode] = useState(null); // Nuevo estado para rastrear el último código escaneado
    const [isProcessing, setIsProcessing] = useState(false); // Estado para controlar si se está procesando un código
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const errorTimeout = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const startVideo = () => {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    video.srcObject = stream;
                    video.play();
                    setIsPlaying(true);
                })
                .catch(err => console.error('Error accessing camera:', err));
        };

        const tick = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code && code.data !== lastScannedCode && !isProcessing) {
                    setLastScannedCode(code.data); // Actualiza el último código escaneado
                    handleScan(code.data);
                }
            }
            requestAnimationFrame(tick);
        };

        if (!isPlaying) {
            startVideo();
            video.addEventListener('play', tick);
        }

        return () => {
            video.removeEventListener('play', tick);
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [isPlaying, lastScannedCode, isProcessing]);

    const handleScan = async (data) => {
        if (data) {
            setIsProcessing(true); // Indicar que se está procesando un código
            setEmpleadoNumero(data);

            try {
                const response = await axios.post('http://localhost:3001/registros/crear', { // Asegúrate de que la URL es correcta
                    numeroEmpleado: data,
                });

                if (response.status === 201) {
                    toast.success(`Empleado ${data} registrado exitosamente!`, {
                        autoClose: 2000,
                        hideProgressBar: true,
                    });
                } else {
                    throw new Error(`Error al registrar el empleado: ${response.statusText}`);
                }
            } catch (error) {
                const errorMessage = error.response ? error.response.data.message : error.message;
                console.error('Error al registrar el empleado:', errorMessage);
                toast.error(`Error al registrar el empleado: ${errorMessage}`, {
                    autoClose: 2000,
                    hideProgressBar: true,
                });
            } finally {
                setIsProcessing(false); // Restablecer el estado de procesamiento
            }
        }
    };

    const handleError = (err) => {
        if (isProcessing) return; // No mostrar error si se está procesando

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

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h1 className="text-2xl font-semibold mb-4 text-center">Registro de Empleado</h1>
                <video ref={videoRef} style={previewStyle} onError={handleError}></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
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
