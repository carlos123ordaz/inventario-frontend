// src/api/actasService.js
import axiosInstance from './axios.config';
const actasService = {
    filter: async (params = {}) => {
        const response = await axiosInstance.get(`/actas`, { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(`/actas/${id}`);
        return response.data;
    },

    create: async (formData) => {
        const response = await axiosInstance.post(`/actas`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(`${API_URL}/actas/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/actas/${id}`);
        return response.data;
    },

    generate: async (data) => {
        const response = await axiosInstance.post(`/actas/generar`, data);
        return response.data;
    },

    getGenerated: async (params = {}) => {
        const response = await axiosInstance.get(`/actas/generadas`, { params });
        return response.data;
    },

    getStatistics: async () => {
        const response = await axiosInstance.get(`/actas/estadisticas`);
        return response.data;
    },
};

export default actasService;