import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { authService } from "../services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email, password) => {
        try {
            const { user: loggedInUser, token } = await authService.login(email, password);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            return { loggedInUser, token };
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('user');
        setUser(null);
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    return useContext(AuthContext);
};