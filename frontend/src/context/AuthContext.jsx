import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRoleState] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
            setRoleState(savedUser.role);
        }
        setLoading(false);
    }, []);

    const login = async (email, password, requestedRole = null) => {
        const data = await authService.login(email, password, requestedRole);
        setUser(data);
        setRoleState(data.role);
        localStorage.setItem('userRole', data.role);
        return data;
    };

    const register = async (email, password, fullName) => {
        return authService.register(email, password, fullName);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setRoleState(null);
        localStorage.removeItem('userRole');
    };

    const setRole = (newRole) => {
        setRoleState(newRole);
        if (user) {
            const updatedUser = { ...user, role: newRole };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login, register, logout, setRole }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
