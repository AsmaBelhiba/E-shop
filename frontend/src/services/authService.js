import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const register = async (email, fullName) => {
    return axios.post(`${API_URL}/register`, { email, fullName });
};

const setPassword = async (token, password) => {
    return axios.post(`${API_URL}/set-password?token=${token}`, { password });
};

const validateToken = async (token) => {
    return axios.get(`${API_URL}/validate-token?token=${token}`);
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
    setPassword,
    validateToken,
    logout,
    getCurrentUser,
};

export default authService;
