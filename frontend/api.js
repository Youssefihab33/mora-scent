import axiosInstance from './axiosInstance';

/**
 * API service layer refactored to use Axios instance for all backend interactions.
 */
export const api = {
	// Authentication
	login: async (username, password) => {
		const response = await axiosInstance.post('/auth/login/', { username, password });
		const { token, user } = response.data;
		localStorage.setItem('token', token);
		return user;
	},

	register: async (userData) => {
		const response = await axiosInstance.post('/auth/register/', userData);
		const { token, user } = response.data;
		localStorage.setItem('token', token);
		return user;
	},

	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout/');
		} finally {
			// Always clear token locally even if logout request fails
			localStorage.removeItem('token');
		}
	},

	getUser: async () => {
		const response = await axiosInstance.get('/auth/user/');
		return response.data;
	},

	// Products and Categories
	getProducts: async () => {
		const response = await axiosInstance.get('/products/');
		return response.data;
	},

	getCategories: async () => {
		const response = await axiosInstance.get('/categories/');
		return response.data;
	},

	// Orders
	createOrder: async (orderData) => {
		const response = await axiosInstance.post('/orders/', orderData);
		return response.data;
	},

	getOrders: async () => {
		const response = await axiosInstance.get('/orders/');
		return response.data;
	},

	updateOrderStatus: async (orderId, status) => {
		const response = await axiosInstance.patch(`/orders/${orderId}/`, { status });
		return response.data;
	},

	// Reviews
	getReviews: async () => {
		const response = await axiosInstance.get('/reviews/');
		return response.data;
	},

	addReview: async (reviewData) => {
		const response = await axiosInstance.post('/reviews/', reviewData);
		return response.data;
	},

	// Store Settings
	getSettings: async () => {
		const response = await axiosInstance.get('/settings/');
		return response.data;
	},

	updateSettings: async (id, settingsData) => {
		const response = await axiosInstance.patch(`/settings/${id}/`, settingsData);
		return response.data;
	},

	// Admin-specific
	getCustomers: async () => {
		const response = await axiosInstance.get('/customers/');
		return response.data;
	},

	updateCustomer: async (id, customerData) => {
		const response = await axiosInstance.patch(`/customers/${id}/`, customerData);
		return response.data;
	},

	// Coupons
	getCoupons: async () => {
		const response = await axiosInstance.get('/coupons/');
		return response.data;
	},

	addCoupon: async (couponData) => {
		const response = await axiosInstance.post('/coupons/', couponData);
		return response.data;
	},

	deleteCoupon: async (id) => {
		await axiosInstance.delete(`/coupons/${id}/`);
	},

	// Shipping
	getShippingCompanies: async () => {
		const response = await axiosInstance.get('/shipping-companies/');
		return response.data;
	},

	getShippingZones: async () => {
		const response = await axiosInstance.get('/shipping-zones/');
		return response.data;
	},

	// AI Chat
	chat: async (messages, lang) => {
		const response = await axiosInstance.post('/chat/', { messages, lang });
		return response.data;
	},
};
