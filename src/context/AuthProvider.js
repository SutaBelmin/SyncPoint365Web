import { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthStore } from '../stores/AuthStore';
import { eventEmitter } from '../utils/EventEmitter';

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
            const accessToken = authStore.getAccessToken();
            const storedUser = authStore.getUser();
            const refreshToken = authStore.getRefreshToken();
            if (!accessToken || !refreshToken || !storedUser) {
                setloggedUser(null);
                navigate('/', { replace: true });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        eventEmitter.on('navigateToLogin', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            eventEmitter.off('navigateToLogin', handleStorageChange);
        };
    }, [authStore, navigate]);

    useEffect(() => {
        if (loggedUser && location.pathname === '/') {
            navigate('/home', { replace: true });
        }
    }, [loggedUser, location, navigate]);

    const setUser = (user, accessToken, refreshToken) => {
        authStore.setUser(user, accessToken, refreshToken);
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
