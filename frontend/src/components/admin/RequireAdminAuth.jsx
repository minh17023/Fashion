// src/components/admin/RequireAdminAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdminAuth = ({ children }) => {
  const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
  const token = localStorage.getItem('access_token');

  return isLoggedIn && token ? children : <Navigate to="/admin/login" replace />;
};

export default RequireAdminAuth;
