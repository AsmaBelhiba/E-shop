import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const checkout = (items) => {
    return axios.post(`${API_URL}/checkout`, items, { headers: getAuthHeader() });
};

const getMyOrders = () => {
    return axios.get(`${API_URL}/my`, { headers: getAuthHeader() });
};

const getAllOrders = () => {
    return axios.get(`${API_URL}/all`, { headers: getAuthHeader() });
};

export default { checkout, getMyOrders, getAllOrders };
