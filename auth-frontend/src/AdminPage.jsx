// src/AdminPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setName(decoded.name);
      } catch (error) {
        console.error('Invalid token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to {name ? name : 'Admin'} </h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPage;
