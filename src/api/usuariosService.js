import axiosInstance from './axios.config';

const usuariosService = {
    getAll: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/usuarios', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    search: async (termino) => {
        try {
            const response = await axiosInstance.get('/usuarios/buscar', {
                params: { termino }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getHistorial: async (id) => {
        try {
            const response = await axiosInstance.get(`/usuarios/${id}/historial`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (usuarioData) => {
        try {
            const response = await axiosInstance.post('/usuarios', usuarioData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, usuarioData) => {
        try {
            const response = await axiosInstance.put(`/usuarios/${id}`, usuarioData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    filter: async (filters) => {
        try {
            const response = await axiosInstance.get('/usuarios', {
                params: {
                    estado: filters.estado,
                    area: filters.area,
                    page: filters.page || 1,
                    limit: filters.limit || 10
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default usuariosService;