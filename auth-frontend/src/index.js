import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ ใช้ React 18+
import App from './App';                // ✅ นำเข้า App component หลัก
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root')); 
// ✅ ค้นหา <div id="root"></div> ใน public/index.html

root.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);


