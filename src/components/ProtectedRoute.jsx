// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/apiService';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = authAPI.isAuthenticated();
    
    // Check if token exists
    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    console.log('Authenticated, rendering children');
    return children;
};

export default ProtectedRoute;