//controllers/authControllers.js

require('dotenv').config(); // ✅ โหลด .env

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'auth_db'
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// ✅ Register
exports.register = (req, res) => {
  const { first_name, surname, dob, gender, email, password, role } = req.body;

  if (!first_name || !surname || !dob || !gender || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const userRole = role || 'user';

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Email already exists' });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: 'Hashing error' });

      db.query(
        'INSERT INTO users (name, surname, dob, gender, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [first_name, surname, dob, gender, email, hashedPassword, userRole],
        (err) => {
          if (err) return res.status(500).json({ error: 'Insert error' });
          res.json({ message: 'User registered successfully' });
        }
      );
    });
  });
};

// ✅ Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch)
        return res.status(401).json({ error: 'Invalid email or password' });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          surname: user.surname
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    });
  });
};

// ✅ Get Current User
exports.getMe = (req, res) => {
  res.json({ user: req.user });
};

// ✅ Token Middleware
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = decoded;
    next();
  });
};

// // ✅ Reset Password (Without Email Method)
// exports.resetPassword = (req, res) => {
//   const { email, newPassword } = req.body;
//   if (!email || !newPassword) {
//     return res.status(400).json({ error: 'Email and new password are required' });
//   }

//   bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
//     if (err) return res.status(500).json({ error: 'Hashing error' });

//     db.query(
//       'UPDATE users SET password = ? WHERE email = ?',
//       [hashedPassword, email],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: 'Database error' });
//         if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });

//         res.json({ message: 'Password reset successfully' });
//       }
//     );
//   });
// };

// ✅ Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // ใช้ App Password (อย่า hardcode!)
  }
});

// ✅ Request Password Reset
exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    db.query('DELETE FROM password_reset_tokens WHERE email = ?', [email], () => {
      db.query(
        'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
        [email, token, expiresAt],
        (err) => {
          if (err) return res.status(500).json({ error: 'Token creation failed' });

          const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
          };

          transporter.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).json({ error: 'Email sending failed' });
            res.json({ message: 'Reset email sent successfully' });
          });
        }
      );
    });
  });
};

// ✅ Reset Password Using Token
exports.resetPasswordWithToken = (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ error: 'Token and new password required' });

  db.query(
    'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
    [token],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(400).json({ error: 'Invalid or expired token' });

      const userEmail = results[0].email;

      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: 'Hashing failed' });

        db.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [hashedPassword, userEmail],
          (err) => {
            if (err) return res.status(500).json({ error: 'Password update failed' });

            db.query(
              'DELETE FROM password_reset_tokens WHERE token = ?',
              [token],
              () => {
                res.json({ message: 'Password reset successfully' });
              }
            );
          }
        );
      });
    }
  );
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// (1) ขอ OTP
exports.requestReset = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (results.length === 0) return res.status(404).json({ error: "Email not found" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 นาที

    db.query('INSERT INTO otp (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt], (err2) => {
      if (err2) return res.status(500).json({ error: "Failed to save OTP" });

      // ✅ ส่ง OTP ทาง Email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code for Password Reset',
        html: `
          <h2>Password Reset Request</h2>
          <p>Your OTP code is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Email send error:", error);
          return res.status(500).json({ error: "Failed to send OTP email" });
        }

        console.log(`✅ OTP email sent: ${info.response}`);
        res.json({ message: "OTP has been sent to your email" });
      });
    });
  });
};


// (2) ยืนยัน OTP และรีเซ็ตรหัสผ่าน
exports.resetPasswordOtp = (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    'SELECT * FROM otp WHERE email = ? AND otp = ? ORDER BY created_at DESC LIMIT 1',
    [email, otp],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Server error" });
      if (results.length === 0) return res.status(400).json({ error: "Invalid OTP" });

      const otpEntry = results[0];
      if (new Date(otpEntry.expires_at) < new Date()) {
        return res.status(400).json({ error: "OTP has expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err2) => {
        if (err2) return res.status(500).json({ error: "Failed to update password" });
        res.json({ message: "Password has been reset successfully" });
      });
    }
  );
};
