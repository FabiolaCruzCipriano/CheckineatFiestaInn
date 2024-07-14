import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FiLoader } from 'react-icons/fi';

const logoPath = '/logo.jpeg';  // Ruta relativa a la imagen del logo en la carpeta public

const Reportes = () => {
    const [reportes, setReportes] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [loading, setLoading] = useState(false);
    const [tipoReporte, setTipoReporte] = useState(''); // Estado para el tipo de reporte

    const validarFechas = () => {
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            toast.error('La fecha de inicio no puede ser mayor que la fecha de fin.');
            return false;
        }
        return true;
    };

    const generarReporte = async (tipo) => {
        if (!validarFechas()) return;

        setLoading(true);
        setTipoReporte(tipo); // Establecer el tipo de reporte aquí
        try {
            let url = `http://localhost:3001/reportes/generar?tipo=${tipo}`;
            if (fechaInicio && fechaFin) {
                url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
            const response = await axios.get(url);
            console.log('Response status:', response.status); // Verificar el estado de la respuesta
            console.log('Response data:', response.data); // Verificar los datos de respuesta
            if (response.status === 200 && Array.isArray(response.data)) {
                setReportes(response.data);
            } else {
                setReportes([]);
                toast.error('Error al recibir los datos del reporte. Verifica que la API esté devolviendo un arreglo.');
            }
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            toast.error('Error al generar el reporte. Verifica que el servidor esté respondiendo correctamente.');
        }
        setLoading(false);
    };

    const exportarCSV = () => {
        const csvData = reportes.map(reporte => ({
            "Número de Registro": reporte.id_registro,
            "Número de Empleado": reporte.numeroempleado,
            "Nombre": reporte.nombre,
            "Apellidos": reporte.apellidos,
            "Departamento": reporte.departamento,
            "Fecha Asistencia": reporte.fecha_asistencia,
            "Hora Asistencia": reporte.hora_asistencia
        }));

        const csvContent = [
            Object.keys(csvData[0]).join(","),
            ...csvData.map(row => Object.values(row).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "reportes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportarPDF = () => {
        const doc = new jsPDF();

        // Agregar logo al PDF
        const img = new Image();
        img.src = logoPath;
        img.onload = () => {
            doc.addImage(img, 'JPEG', 10, 10, 50, 20);
            completarPDF(doc); // Pasar tipoReporte a la función completarPDF
        };
        img.onerror = (error) => {
            console.error('Error al cargar el logo en el PDF:', error);
            toast.error('Error al cargar el logo en el PDF.');
            completarPDF(doc);  // Completar el PDF sin el logo
        };
    };

    const completarPDF = (doc) => {
        const columns = [
            { header: "Número de Registro", dataKey: "id_registro" },
            { header: "Número de Empleado", dataKey: "numeroempleado" },
            { header: "Nombre", dataKey: "nombre" },
            { header: "Apellidos", dataKey: "apellidos" },
            { header: "Departamento", dataKey: "departamento" },
            { header: "Fecha Asistencia", dataKey: "fecha_asistencia" },
            { header: "Hora Asistencia", dataKey: "hora_asistencia" }
        ];
        const rows = reportes.map(reporte => ({
            id_registro: reporte.id_registro,
            numeroempleado: reporte.numeroempleado,
            nombre: reporte.nombre,
            apellidos: reporte.apellidos,
            departamento: reporte.departamento,
            fecha_asistencia: reporte.fecha_asistencia,
            hora_asistencia: reporte.hora_asistencia
        }));

        // Agregar el tipo de reporte y cantidad de registros
        const tipoReporteTexto = tipoReporte.charAt(0).toUpperCase() + tipoReporte.slice(1);  // Capitalizar el tipo de reporte
        const cantidadRegistros = rows.length;

        doc.setFontSize(14);
        doc.text(`Tipo de Reporte: Reporte ${tipoReporteTexto}`, 10, 35);
        doc.text(`Cantidad de Registros: ${cantidadRegistros}`, 10, 45);

        doc.autoTable({
            columns: columns,
            body: rows,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: '#B20027' }
        });

        doc.save("reportes.pdf");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-4 flex-grow">
                <h1 className="text-2xl mb-4">Reportes</h1>
                <div className="mb-4">
                    <label>
                        Fecha Inicio:
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="ml-2 p-2 border rounded"
                        />
                    </label>
                    <label className="ml-4">
                        Fecha Fin:
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="ml-2 p-2 border rounded"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <button onClick={() => generarReporte('diario')} className="mr-2 px-4 py-2 bg-darkRed text-white rounded">Diario</button>
                    <button onClick={() => generarReporte('semanal')} className="mr-2 px-4 py-2 bg-darkRed text-white rounded">Semanal</button>
                    <button onClick={() => generarReporte('mensual')} className="px-4 py-2 bg-darkRed text-white rounded">Mensual</button>
                    <button onClick={exportarCSV} className="ml-4 px-4 py-2 bg-darkRed text-white rounded">Exportar CSV</button>
                    <button onClick={exportarPDF} className="ml-4 px-4 py-2 bg-darkRed text-white rounded">Exportar PDF</button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <FiLoader className="animate-spin text-4xl" />
                    </div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Número de Registro</th>
                                <th className="py-2 px-4 border">Número de Empleado</th>
                                <th className="py-2 px-4 border">Nombre</th>
                                <th className="py-2 px-4 border">Apellidos</th>
                                <th className="py-2 px-4 border">Departamento</th>
                                <th className="py-2 px-4 border">Fecha Asistencia</th>
                                <th className="py-2 px-4 border">Hora Asistencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportes.map((reporte) => (
                                <tr key={reporte.id_registro}>
                                    <td className="py-2 px-4 border">{reporte.id_registro}</td>
                                    <td className="py-2 px-4 border">{reporte.numeroempleado}</td>
                                    <td className="py-2 px-4 border">{reporte.nombre}</td>
                                    <td className="py-2 px-4 border">{reporte.apellidos}</td>
                                    <td className="py-2 px-4 border">{reporte.departamento}</td>
                                    <td className="py-2 px-4 border">{reporte.fecha_asistencia}</td>
                                    <td className="py-2 px-4 border">{reporte.hora_asistencia}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <footer className="bg-white text-gray-800 p-4 text-center">
                © {new Date().getFullYear()} Fiesta Inn Hoteles. Todos los derechos reservados.
            </footer>
            <ToastContainer />
        </div>
    );
};

export default Reportes;
