import axiosInstance from './axios.config';

const equiposService = {
    getAll: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/equipos', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/equipos/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    search: async (termino) => {
        try {
            const response = await axiosInstance.get('/equipos/buscar', {
                params: { termino }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getEstadisticas: async () => {
        try {
            const response = await axiosInstance.get('/equipos/estadisticas');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (equipoData) => {
        try {
            const response = await axiosInstance.post('/equipos', equipoData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, equipoData) => {
        try {
            const response = await axiosInstance.put(`/equipos/${id}`, equipoData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(`/equipos/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    filter: async (filters) => {
        try {
            const response = await axiosInstance.get('/equipos', {
                params: {
                    estado: filters.estado,
                    equipo: filters.equipo,
                    marca: filters.marca,
                    page: filters.page || 1,
                    limit: filters.limit || 10
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDisponibles: async () => {
        try {
            const response = await axiosInstance.get('/equipos', {
                params: { estado: 'Disponible' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getEnUso: async () => {
        try {
            const response = await axiosInstance.get('/equipos', {
                params: { estado: 'En Uso' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getByTipo: async (tipo) => {
        try {
            const response = await axiosInstance.get('/equipos', {
                params: { equipo: tipo }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default equiposService;