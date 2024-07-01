// src/api/departamentos.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getDepartamentos = async () => {
    return await axios.get(`${API_URL}/departamentos`);
};

export const createDepartamento = async (departamento) => {
    return await axios.post(`${API_URL}/departamentos`, departamento);
};

export const deleteDepartamento = async (id) => {
    return await axios.delete(`${API_URL}/departamentos/${id}`);
};
