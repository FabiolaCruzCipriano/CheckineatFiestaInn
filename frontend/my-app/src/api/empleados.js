// src/api/empleados.js

import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const getEmpleados = () => api.get('/empleados');
export const createEmpleado = (data) => api.post('/empleados', data);
export const getEmpleado = (id) => api.get(`/empleados/${id}`);
export const updateEmpleado = (id, data) => api.put(`/empleados/${id}`, data);
export const deleteEmpleado = (id) => api.delete(`/empleados/${id}`);
