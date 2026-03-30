import axios from 'axios';

const API_URL = 'http://localhost:8080/api/suppliers';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllSuppliers = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
};

const getSupplierCount = async () => {
    const response = await axios.get(`${API_URL}/count`, { headers: getAuthHeader() });
    return response.data;
};

const getSupplierById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
};

const createSupplier = async (supplier) => {
    const response = await axios.post(API_URL, supplier, { headers: getAuthHeader() });
    return response.data;
};

const updateSupplier = async (id, supplierDetails) => {
    const response = await axios.put(`${API_URL}/${id}`, supplierDetails, { headers: getAuthHeader() });
    return response.data;
};

const deleteSupplier = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

export default {
    getAllSuppliers,
    getSupplierCount,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
