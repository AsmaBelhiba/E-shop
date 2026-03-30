import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllUsers = () => {
    return axios.get(API_URL, { headers: getAuthHeader() });
};

const deleteUser = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const updateRole = (id, role) => {
    return axios.put(`${API_URL}/${id}/role`, JSON.stringify(role), {
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
    });
};

export default { getAllUsers, deleteUser, updateRole };
