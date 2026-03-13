import axios from 'axios';

/**
 * Centralized Axios instance for all backend interactions.
 * Configured with base URL and interceptors for authentication.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to attach the authentication token if available
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			// Using Django REST Framework's Token authentication header format
			config.headers.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle common error scenarios (like 401 Unauthorized)
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Handle unauthorized access (e.g., clear token, redirect to login)
			localStorage.removeItem('token');
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
