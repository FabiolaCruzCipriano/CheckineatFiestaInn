import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBuilding, FaChartBar, FaBell, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
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
    Filler
);

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Datos de ejemplo para el gráfico
    const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                label: 'Empleados',
                data: [12, 19, 3, 5, 2, 3, 7, 11, 6, 9, 15, 12],
                backgroundColor: 'rgba(178, 0, 39, 0.2)',
                borderColor: '#B20027',
                borderWidth: 2,
                pointBackgroundColor: '#B20027',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#B20027',
                fill: true, // Relleno debajo de la línea
                tension: 0.4, // Curvatura de la línea
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'gray', // Color de las etiquetas de la leyenda
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#B20027', // Color del borde del tooltip ajustado al color del logotipo
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
            y: {
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
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="md:hidden text-gray-800 hover:text-gray-600 transition duration-200">
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <img src="/logo.jpeg" alt="Logo" className="h-10 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-800">CheckInEat</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <FaBell className="text-gray-800 hover:text-gray-600 transition duration-200" />
                    <FaCog className="text-gray-800 hover:text-gray-600 transition duration-200" />
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className={`fixed md:static z-50 w-64 bg-[#B20027] text-white shadow-lg flex flex-col justify-between transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div>
                        <div className="p-8 text-2xl font-extrabold border-b">Dashboard</div>
                        <nav className="p-6">
                            <ul>
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
                                    <Link to="/reportes" className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
                                        <FaChartBar className="mr-2" /> Reportes
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 md:p-8">
                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <StatCard title="Total Empleados" value="150" icon={<FaUser />} color="#FF89A2" />
                        <StatCard title="Departamentos" value="5" icon={<FaChartBar />} color="#FF89A2" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">Empleados por Mes</h2>
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
