import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api/products';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const getAllProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const getRecentProducts = async () => {
    const response = await axios.get(`${API_URL}/recent`);
    return response.data;
};

const getProductCount = async () => {
    const response = await axios.get(`${API_URL}/count`);
    return response.data;
};

const createProduct = (product) => {
    return axios.post(API_URL, product, { headers: getAuthHeader() });
};

const updateProduct = (id, product) => {
    return axios.put(`${API_URL}/${id}`, product, { headers: getAuthHeader() });
};

const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

export default {
    getAllProducts,
    getProductById,
    getRecentProducts,
    getProductCount,
    createProduct,
    updateProduct,
    deleteProduct,
};
