// //src/ResetPassword.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// function ResetPassword() {
//   const [email, setEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');

//   const handleReset = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/reset-password', { email, newPassword });
//       alert('Password reset successful!');
//     } catch (err) {
//       alert('Error: ' + (err.response?.data?.error || 'Something went wrong'));
//     }
//   };

//   return (
//     <div>
//       <h2>Reset Password</h2>
//       <form onSubmit={handleReset}>
//         <input type="email" placeholder="Your Email" value={email}
//           onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="New Password" value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)} required />
//         <button type="submit">Reset Password</button>
//       </form>
//       <p className="mt-6 text-sm text-center text-gray-600">
//       Already have an account?{" "}
//       <Link to="/login" className="text-indigo-600 hover:underline">
//       Login
//       </Link>
//       </p>
//     </div>
//   );
// }

// export default ResetPassword;
