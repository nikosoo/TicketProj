import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Component }) => {
    const isAdmin = useSelector((state) => state.user.isAdmin);  // Access isAdmin from Redux state

    if (!isAdmin) {
        return <Navigate to="/" replace />;  // Redirect non-admin users
    }

    return <Component />;
};

export default ProtectedRoute;
