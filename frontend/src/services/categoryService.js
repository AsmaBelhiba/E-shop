import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api/categories';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const getAllCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getCategoryById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const getCategoryCount = async () => {
    const response = await axios.get(`${API_URL}/count`);
    return response.data;
};
const createCategory = (category) => {
    return axios.post(API_URL, category, { headers: getAuthHeader() });
};

const updateCategory = (id, category) => {
    return axios.put(`${API_URL}/${id}`, category, { headers: getAuthHeader() });
};

const deleteCategory = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

export default {
    getAllCategories,
    getCategoryById,
    getCategoryCount,
    createCategory,
    updateCategory,
    deleteCategory,
};
