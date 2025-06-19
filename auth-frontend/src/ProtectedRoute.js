// src/ProtectedRoute.js
//✅ ใช้สำหรับ route แบบ login-only

import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // ตรวจสอบว่า token หมดอายุหรือไม่
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }

    // ตรวจสอบว่า role ตรงกับที่อนุญาตหรือไม่
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/" replace />;
    }

    return children;

  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
