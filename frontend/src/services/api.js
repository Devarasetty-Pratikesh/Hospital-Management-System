import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
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
