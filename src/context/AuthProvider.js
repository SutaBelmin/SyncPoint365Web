import { useState, createContext, useContext } from 'react';
import { AuthStore } from '../stores/AuthStore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const authStore = new AuthStore();
    const [loggedUser, setloggedUser] = useState(authStore.getUser());

    const setUser = (user, token) => {
        authStore.setUser(user, token);
        setloggedUser(user);
    };

    const removeUser = () => {
        authStore.removeUser();
        setloggedUser(null);
    };

    return (
        <AuthContext.Provider value={{ loggedUser, setUser, removeUser }}>
            {children}
        </AuthContext.Provider>
    );
};