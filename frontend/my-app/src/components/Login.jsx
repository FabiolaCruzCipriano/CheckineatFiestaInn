import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
                correo_electronico: correoElectronico,
                contrasena: contrasena
            });
            console.log(response.data);
        } catch (error) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-roboto">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl h-auto md:min-h-96">
                <div className="w-full md:w-1/2 h-64 md:h-auto">
                    <img
                        src="https://www.infoblancosobrenegro.com/uploads/noticias/5/2020/08/banner-internas.png"
                        alt="Imagen de inicio de sesión"
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex justify-center mb-4">
                        <img
                            src="https://image-tc.galaxy.tf/wisvg-9k1ty3d2dl2xm4tuv46uxa3xn/fiesta-inn-playa-del-carmen_logo.svg" // Reemplaza esto con la URL de tu logo
                            alt="Logo"
                            className="h-16"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-4">ChecInEat</h2>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correoElectronico">
                                Email
                            </label>
                            <div className="flex items-center border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <FaEnvelope className="text-gray-400 mr-3" />
                                <input
                                    type="email"
                                    id="correoElectronico"
                                    placeholder="Email"
                                    value={correoElectronico}
                                    onChange={(e) => setCorreoElectronico(e.target.value)}
                                    className="appearance-none bg-transparent focus:outline-none w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contrasena">
                                Password
                            </label>
                            <div className="flex items-center border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <FaLock className="text-gray-400 mr-3" />
                                <input
                                    type="password"
                                    id="contrasena"
                                    placeholder="Password"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    className="appearance-none bg-transparent focus:outline-none w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-[#CB0022] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
