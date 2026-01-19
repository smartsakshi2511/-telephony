import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const PrivateRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
 
  if (loading) {
    return <div>Loading...</div>;  
  }

  if (!isAuthenticated || !allowedRoles.includes(user?.user_type)) {
    return <Navigate to="/login" />;
    
  }

  return children;
};

export default PrivateRoute;
