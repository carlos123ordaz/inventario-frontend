import axiosInstance from './axios.config';

const equiposService = {
    /**
     * Obtiene equipos con filtros, búsqueda y paginación unificados
     * @param {Object} params - Parámetros opcionales
     * @param {string} params.termino - Búsqueda por término (marca, modelo, serie, host, procesador)
     * @param {string} params.estado - Filtro por estado (Disponible, En Uso, Mantenimiento, etc)
     * @param {string} params.tipo - Filtro por tipo (LAPTOP, DESKTOP, CELULAR, etc)
     * @param {string} params.marca - Filtro por marca
     * @param {number} params.page - Página (default: 1)
     * @param {number} params.limit - Límite por página (default: 10)
     * @returns {Promise} Respuesta con data y pagination
     */
    getAll: async (params = {}) => {
        try {
            const cleanParams = {
                ...params,
                page: params.page || 1,
                limit: params.limit || 10
            };

            const response = await axiosInstance.get('/equipos', { params: cleanParams });
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
};

export default equiposService;