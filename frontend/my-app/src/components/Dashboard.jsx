import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBuilding, FaChartBar, FaBars, FaTimes, FaClipboardList, FaCheckCircle, FaUserShield } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import StatCard from './StatCard';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    BarController as BarControllerElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    BarControllerElement
);

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const [totalDepartamentos, setTotalDepartamentos] = useState(0);
    const [asistenciaDiaria, setAsistenciaDiaria] = useState(0);
    const [asistenciaPorMes, setAsistenciaPorMes] = useState(Array(12).fill(0));

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const empleadosResponse = await axios.get('http://localhost:3001/empleados/total');
                setTotalEmpleados(empleadosResponse.data.totalEmpleados);

                const departamentosResponse = await axios.get('http://localhost:3001/departamentos/total');
                setTotalDepartamentos(departamentosResponse.data.count);

                const asistenciaDiariaResponse = await axios.get('http://localhost:3001/asistencia/diaria');
                console.log('Asistencia Diaria:', asistenciaDiariaResponse.data.asistenciaDiaria); // Añadir este console log
                setAsistenciaDiaria(asistenciaDiariaResponse.data.asistenciaDiaria);

                const asistenciaMensualResponse = await axios.get('http://localhost:3001/asistencia/mensual');
                const asistenciaPorMesData = asistenciaMensualResponse.data;
                setAsistenciaPorMes(asistenciaPorMesData);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, []);

    const asistenciaData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                type: 'bar',
                label: 'Asistencia Comedor',
                data: asistenciaPorMes,
                backgroundColor: 'rgba(178, 0, 39, 0.2)',
                borderColor: '#B20027',
                borderWidth: 2,
                yAxisID: 'y1',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'gray',
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#B20027',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'gray',
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)',
                },
            },
            y1: {
                type: 'linear',
                position: 'left',
                ticks: {
                    color: 'gray',
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)',
                },
            },
        },
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 font-sans">
            <header className="bg-white shadow-md p-4 flex justify-between items-center rounded-b-lg">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="md:hidden text-gray-800 hover:text-gray-600 transition duration-200">
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <img src="/logo.jpeg" alt="Logo" className="h-10 mr-3 rounded-lg" />
                    <h1 className="text-2xl font-bold text-gray-800">CheckInEat</h1>
                </div>
            </header>

            <div className="flex flex-1">
                <div className={`fixed md:static z-50 w-64 bg-[#B20027] text-white shadow-lg flex flex-col justify-between transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} rounded-r-lg`}>
                    <div>
                        <div className="p-8 text-2xl font-extrabold border-b">Dashboard</div>
                        <nav className="p-6">
                            <ul>
                                <li className="mb-4">
                                    <Link to="/administradores" className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
                                        <FaUserShield className="mr-2" /> Administrador
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link to="/empleados" className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
                                        <FaUser className="mr-2" /> Empleados
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link to="/departamentos" className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
                                        <FaBuilding className="mr-2" /> Departamentos
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link to="/registros" className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
                                        <FaClipboardList className="mr-2" /> Registros
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link to="/reportes" className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
                                        <FaChartBar className="mr-2" /> Reportes
                                    </Link>
                                </li>
                                
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="flex-1 p-4 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <StatCard title="Total Empleados" value={totalEmpleados} icon={<FaUser />} color="bg-[#B20027]" />
                        <StatCard title="Departamentos" value={totalDepartamentos} icon={<FaBuilding />} color="bg-[#B20027]" />
                        <StatCard title="Asistencia Diaria" value={asistenciaDiaria} icon={<FaCheckCircle />} color="bg-[#B20027]" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">Asistencia Mensual</h2>
                            <div style={{ height: '300px' }}>
                                <Line data={asistenciaData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-white shadow-md p-4 flex justify-center items-center rounded-t-lg">
                <p className="text-gray-600">&copy; 2024 Fiesta Inn Hoteles. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
