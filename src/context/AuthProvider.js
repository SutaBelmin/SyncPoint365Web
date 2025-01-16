import { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthStore } from '../stores/AuthStore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const authStore = useMemo(() => new AuthStore(), []);
    const [loggedUser, setloggedUser] = useState(authStore.getUser());
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleStorageChange = () => {
            const token = authStore.getToken();
            const storedUser = authStore.getUser();

            if (!token || !storedUser) {
                setloggedUser(null);
                navigate('/', { replace: true });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [authStore, navigate]);

    useEffect(() => {
        if (loggedUser) {
            if (location.pathname === '/') {
                navigate('/home', { replace: true });
            }
        }
    }, [loggedUser, location, navigate]);

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
