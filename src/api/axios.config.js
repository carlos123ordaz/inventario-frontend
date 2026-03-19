import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: 'https://inventario-backend-production-bb08.up.railway.app/api',
    timeout: 100000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosInstance.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);


export default axiosInstance;