import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hospital-management-system-backend-zeta.vercel.app/api',
});

// Optionally add interceptors here for JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hms_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
