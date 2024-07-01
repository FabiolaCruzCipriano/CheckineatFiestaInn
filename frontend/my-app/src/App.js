import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Empleados from './components/Empleados';
import Departamentos from './components/Departamentos';
import Reportes from './components/Reportes';
import Registro from './components/Registro'; // Asegúrate de que está importado correctamente

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/departamentos" element={<Departamentos />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/registros" element={<Registro />} /> {/* Asegúrate de que la ruta es correcta */}
      </Routes>
    </Router>
  );
};

export default App;
