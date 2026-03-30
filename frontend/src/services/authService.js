import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

const login = async (email, password, role = null) => {
    const response = await axios.post(`${API_URL}/login`, { email, password, role });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const register = async (email, password, fullName) => {
    return axios.post(`${API_URL}/register`, { email, password, fullName });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    register,
    logout,
    getCurrentUser,
};

export default authService;
