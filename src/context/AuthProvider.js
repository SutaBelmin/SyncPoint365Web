import { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthStore } from '../stores/AuthStore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const authStore = useMemo(() => new AuthStore(), []);
    const [loggedUser, setloggedUser] = useState(authStore.getUser());
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('loggedUser');

            if (!token || !storedUser) {
                authStore.removeUser();
                setloggedUser(null);
                navigate('/', { replace: true });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [authStore, navigate]);

    const setUser = (user, token) => {
        authStore.setUser(user, token);
        setloggedUser(user);
    };

    const removeUser = () => {
        authStore.removeUser();
        setloggedUser(null);
    };

    const userHasRole = (role) => {
        return loggedUser?.role === role;
    };

    return (
        <AuthContext.Provider value={{ loggedUser, setUser, removeUser, userHasRole }}>
            {children}
        </AuthContext.Provider>
    );
};
