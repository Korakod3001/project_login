import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './Register';
import Login from './login';
import Home from './HomePage';
// import ResetPassword from './ResetPassword';
import ResetEmPassword from './ResetEmPassword';
import ProtectedRoute from './ProtectedRoute';

import AdminPage from './AdminPage';


function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/home" /> : <Register />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/Reset-EmPassword" element={<ResetEmPassword />} />
        
        <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

        <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Home />  {/* หรือ UserPage ถ้าคุณเปลี่ยนชื่อ */}
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    );
  }

export default App;
