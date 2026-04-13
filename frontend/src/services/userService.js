import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

const getAllUsers = () => {
    return axios.get(API_URL, { headers: getAuthHeader() });
};

const getAllRoles = () => {
    return axios.get(`${API_URL}/roles`, { headers: getAuthHeader() });
};

const deleteUser = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const updateUserRoles = (id, roleNames) => {
    return axios.put(`${API_URL}/${id}/roles`, roleNames, { 
        headers: { 
            ...getAuthHeader(),
            'Content-Type': 'application/json'
        } 
    });
};

export default {
    getAllUsers,
    getAllRoles,
    deleteUser,
    updateUserRoles
};
