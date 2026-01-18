import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://bloom-backend-pq68.onrender.com');

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // This is important for sending cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
    (config) => {
        // Check for either client or admin token
        const clientInfo = JSON.parse(localStorage.getItem('clientInfo') || '{}');
        const adminInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const token = clientInfo?.token || adminInfo?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
