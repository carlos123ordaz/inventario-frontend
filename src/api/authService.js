import axiosInstance from './axios.config';

const authService = {
    login: async (correo, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                correo,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error al conectar con el servidor' };
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error al cerrar sesión' };
        }
    },
};

export default authService;