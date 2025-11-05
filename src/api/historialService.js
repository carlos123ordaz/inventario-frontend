import axiosInstance from './axios.config';

const historialService = {
    // Obtener todo el historial
    getAll: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/historial', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener asignación por ID
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/historial/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener asignaciones activas
    getActivos: async () => {
        try {
            const response = await axiosInstance.get('/historial/activos');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener estadísticas del historial
    getEstadisticas: async () => {
        try {
            const response = await axiosInstance.get('/historial/estadisticas');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Asignar equipo a usuario
    asignar: async (asignacionData) => {
        try {
            const response = await axiosInstance.post('/historial/asignar', asignacionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Devolver equipo (por ID de historial)
    devolver: async (historialId, observaciones = '') => {
        try {
            const response = await axiosInstance.patch(`/historial/devolver/${historialId}`, {
                observaciones
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Devolver equipo (por ID de equipo)
    devolverPorEquipo: async (equipoId, observaciones = '') => {
        try {
            const response = await axiosInstance.patch(`/historial/devolver-equipo/${equipoId}`, {
                observaciones
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Transferir equipo entre usuarios
    transferir: async (transferenciaData) => {
        try {
            const response = await axiosInstance.post('/historial/transferir', transferenciaData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Filtrar historial
    filter: async (filters) => {
        try {
            const response = await axiosInstance.get('/historial', {
                params: {
                    activo: filters.activo,
                    equipoId: filters.equipoId,
                    usuarioId: filters.usuarioId,
                    page: filters.page || 1,
                    limit: filters.limit || 20
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener historial de un equipo específico
    getByEquipo: async (equipoId) => {
        try {
            const response = await axiosInstance.get('/historial', {
                params: { equipoId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener historial de un usuario específico
    getByUsuario: async (usuarioId) => {
        try {
            const response = await axiosInstance.get('/historial', {
                params: { usuarioId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener asignaciones activas de un usuario
    getActivosByUsuario: async (usuarioId) => {
        try {
            const response = await axiosInstance.get('/historial', {
                params: { usuarioId, activo: true }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default historialService;