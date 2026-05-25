import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const checkout = async (items) => {
    const response = await axios.post(`${API_URL}/checkout`, items, { headers: getAuthHeader() });
    return response.data;
};

const getMyOrders = async () => {
    const response = await axios.get(`${API_URL}/my`, { headers: getAuthHeader() });
    return response.data;
};

const getAllOrders = async () => {
    const response = await axios.get(`${API_URL}/all`, { headers: getAuthHeader() });
    return response.data;
};

export default { checkout, getMyOrders, getAllOrders };
