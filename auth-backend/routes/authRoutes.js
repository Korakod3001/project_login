const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');


router.post('/register', authController.register);
router.post('/login', authController.login);
// router.post('/reset-password', authController.resetPassword);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password-token', authController.resetPasswordWithToken);
// ฟีเจอร์ OTP Reset
router.post('/request-reset', authController.requestReset);
router.post('/reset-password-otp', authController.resetPasswordOtp);



// ✅ เพิ่ม route นี้ให้แน่ใจว่ามี
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

// ✅ เพิ่ม route /me เพื่อให้ frontend ตรวจสอบข้อมูลผู้ใช้
router.get('/me', verifyToken, authController.getMe); 

router.get('/admin-only', verifyToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

router.get('/user-only', verifyToken, authorizeRole('user'), (req, res) => {
  res.json({ message: 'Welcome, user!' });
});

module.exports = router;
