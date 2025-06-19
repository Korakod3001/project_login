// src/Login.js
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './/css/App.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid server response format');
      }

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        alert(data.error || 'Login failed');
      }

    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600 space-y-1">
          <p>
            <Link to="/register" className="text-indigo-600 hover:underline">
              Create new account
            </Link>
          </p>
          {/* <p>
            <Link to="/reset-password" className="text-indigo-600 hover:underline">
              Forgotten password?
            </Link>
          </p> */}
          <p>
            <Link to="/Reset-EmPassword" className="text-indigo-600 hover:underline">
              Forgotten password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
