import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:4000/api',
    baseURL: 'https://inventario-backend-production-a435.up.railway.app/api',
    timeout: 10000,
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