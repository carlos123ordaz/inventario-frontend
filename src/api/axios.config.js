import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
    //baseURL: 'https://inventario-backend-production-a435.up.railway.app/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});



export default axiosInstance;