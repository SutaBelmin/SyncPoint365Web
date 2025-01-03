import React from 'react';
import {  Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PrivateRoutes = ({ children }) => {
    const { loggedUser } = useAuth();

    if(!loggedUser)
        return <Navigate to="/" replace />;

    return children;
};

export default PrivateRoutes;