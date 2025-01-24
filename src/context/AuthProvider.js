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

    // const handleStorageChange = useCallback(() => {
    //     const refreshToken = authStore.getRefreshToken();
    //     const accessToken = authStore.getAccessToken();
    //     const storedUser = authStore.getUserFromLocalStorage();
    //     console.log("adgslaglaidgldag");

    //     if (!refreshToken || !accessToken || !storedUser) {
    //         console.log('Redirecting to login...');
    //         navigate('/login', { replace: true });
    //     }
    // }, [navigate, authStore])

    // useEffect(() => {
    //     window.addEventListener('storage', handleStorageChange);

    //     return () => {
    //         window.removeEventListener('storage', handleStorageChange);
    //     };
    // }, [ handleStorageChange]);

    useEffect(() => {
        const handleStorageChange = () => {
            const accessToken = authStore.getAccessToken();
            const storedUser = authStore.getUser();
            const refreshToken = authStore.getRefreshToken();
            console.log(refreshToken);
            if (!accessToken || !refreshToken || !storedUser) {
                setloggedUser(null);
                navigate('/login', { replace: true });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [authStore, navigate]);

    useEffect(() => {
        if (loggedUser && location.pathname === '/login') {
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
