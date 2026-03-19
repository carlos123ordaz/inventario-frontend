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
    previsualizarCSV: async (file, delimitador = ',') => {
        try {
            const formData = new FormData();
            formData.append('archivo', file);
            formData.append('delimitador', delimitador);
            const response = await axiosInstance.post('/equipos/previsualizar-csv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener campos disponibles para mapeo
    getCamposMapeo: async () => {
        try {
            const response = await axiosInstance.get('/equipos/campos-mapeo');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Importar equipos desde CSV con mapeo
    importar: async (file, mapeo, actualizarExistentes = false, delimitador = ',') => {
        try {
            const formData = new FormData();
            formData.append('archivo', file);
            formData.append('mapeo', JSON.stringify(mapeo));
            formData.append('actualizarExistentes', actualizarExistentes);
            formData.append('delimitador', delimitador);
            const response = await axiosInstance.post('/equipos/importar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Exportar equipos a Excel
    exportar: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/equipos/exportar', {
                params,
                responseType: 'blob'
            });
            // Descargar archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fecha = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `equipos_${fecha}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw error;
        }
    },
};

export default equiposService;