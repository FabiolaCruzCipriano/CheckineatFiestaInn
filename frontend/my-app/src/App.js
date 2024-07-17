import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Empleados from './components/Empleados';
import Departamentos from './components/Departamentos';
import Reportes from './components/Reportes';
import Registro from './components/Registro'; // Asegúrate de que está importado correctamente
import VerRegistros from './components/VerRegistros'; // Importa el nuevo componente
import Administradores from './components/Administradores'; // Importa el nuevo componente Admin

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  return (
    <Router>
      <div className="relative min-h-screen">
        {isAuth && (
          <button
            onClick={handleLogout}
            className="bg-[#B20027] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md absolute top-4 right-4 flex items-center justify-center"
          >
            Cerrar Sesión
          </button>
        )}
        <Routes>
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Login setAuth={setIsAuth} />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/empleados" element={isAuth ? <Empleados /> : <Navigate to="/login" />} />
          <Route path="/departamentos" element={isAuth ? <Departamentos /> : <Navigate to="/login" />} />
          <Route path="/reportes" element={isAuth ? <Reportes /> : <Navigate to="/login" />} />
          <Route path="/registros" element={isAuth ? <Registro /> : <Navigate to="/login" />} />
          <Route path="/ver-registros" element={isAuth ? <VerRegistros /> : <Navigate to="/login" />} />
          <Route path="/administradores" element={isAuth ? <Administradores /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
