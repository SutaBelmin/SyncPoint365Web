import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PrivateRoutes = () => {
    const { loggedUser } = useAuth();

    if(!loggedUser)
        return <Navigate to="/" replace />;

    return <Outlet />;
};

export default PrivateRoutes;






