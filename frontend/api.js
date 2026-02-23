
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Something went wrong');
    }
    if (response.status === 204) return null;
    return response.json();
};
const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Token ${token}`;
    return headers;
};
export const api = {
    login: async (username, password) => {
        const data = await handleResponse(await fetch(`${API_BASE_URL}/auth/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }));
        localStorage.setItem('token', data.token);
        return data.user;
    },
    register: async (userData) => {
        const data = await handleResponse(await fetch(`${API_BASE_URL}/auth/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData) }));
        localStorage.setItem('token', data.token);
        return data.user;
    },
    logout: async () => {
        await fetch(`${API_BASE_URL}/auth/logout/`, { method: 'POST', headers: getHeaders() });
        localStorage.removeItem('token');
    },
    getUser: () => handleResponse(fetch(`${API_BASE_URL}/auth/user/`, { headers: getHeaders() })),
    getProducts: () => handleResponse(fetch(`${API_BASE_URL}/products/`)),
    getCategories: () => handleResponse(fetch(`${API_BASE_URL}/categories/`)),
    createOrder: (orderData) => handleResponse(fetch(`${API_BASE_URL}/orders/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(orderData) })),
    getOrders: () => handleResponse(fetch(`${API_BASE_URL}/orders/`, { headers: getHeaders() })),
    updateOrderStatus: (orderId, status) => handleResponse(fetch(`${API_BASE_URL}/orders/${orderId}/`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) })),
    getReviews: () => handleResponse(fetch(`${API_BASE_URL}/reviews/`)),
    addReview: (reviewData) => handleResponse(fetch(`${API_BASE_URL}/reviews/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(reviewData) })),
    getSettings: () => handleResponse(fetch(`${API_BASE_URL}/settings/`)),
    updateSettings: (id, settingsData) => handleResponse(fetch(`${API_BASE_URL}/settings/${id}/`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(settingsData) })),
    getCustomers: () => handleResponse(fetch(`${API_BASE_URL}/customers/`, { headers: getHeaders() })),
    updateCustomer: (id, customerData) => handleResponse(fetch(`${API_BASE_URL}/customers/${id}/`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(customerData) })),
    getCoupons: () => handleResponse(fetch(`${API_BASE_URL}/coupons/`)),
    addCoupon: (couponData) => handleResponse(fetch(`${API_BASE_URL}/coupons/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(couponData) })),
    deleteCoupon: (id) => handleResponse(fetch(`${API_BASE_URL}/coupons/${id}/`, { method: 'DELETE', headers: getHeaders() })),
    getShippingCompanies: () => handleResponse(fetch(`${API_BASE_URL}/shipping-companies/`)),
    getShippingZones: () => handleResponse(fetch(`${API_BASE_URL}/shipping-zones/`)),
    chat: (messages, lang) => handleResponse(fetch(`${API_BASE_URL}/chat/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ messages, lang }) })),
};
