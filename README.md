# 🔐 Full-Stack Authentication System with Role-Based Access Control

ระบบยืนยันตัวตนที่พัฒนาด้วย React + Node.js พร้อมฟีเจอร์การสมัครสมาชิก ล็อกอิน และรีเซ็ตรหัสผ่านด้วย OTP รวมถึง RBAC (Role-Based Access Control) สำหรับแยกหน้าแสดงผลตามบทบาทของผู้ใช้

---

## 🚀 เทคโนโลยีที่ใช้

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **CSS:** ผสมผสานระหว่าง Tailwind CSS (`v3.4.17`) และ CSS ปกติ

---

## 🧠 ฟีเจอร์หลัก

### ✅ 1. ระบบล็อกอิน (Login)
- เข้าสู่ระบบด้วย **Email + Password**
- ใช้ **JWT** สำหรับเก็บ Token บน `localStorage`
- แยกเส้นทางตามบทบาท (Role):
  - `admin` → `/admin`
  - `user` → `/user`
- ตรวจสอบ token และ redirect โดยอัตโนมัติหากผู้ใช้ล็อกอินอยู่แล้ว

---

### ✅ 2. ระบบสมัครสมาชิก (Register)
- ฟอร์มสมัครสมาชิกประกอบด้วย:
  - First Name
  - Surname
  - Date of Birth
  - Gender
  - Email
  - Password + Confirm Password
  - Role (`user` / `admin`)
- มีระบบแสดง / ซ่อนรหัสผ่าน (ใช้ `react-icons`)

---

### ✅ 3. ระบบรีเซ็ตรหัสผ่านด้วย OTP (ResetEmPassword)
- **Step 1:** ป้อนอีเมลเพื่อขอรหัส OTP
- **Step 2:** ป้อน OTP + รหัสผ่านใหม่ + ยืนยันรหัสผ่าน
- ส่ง OTP ผ่าน API และรีเซ็ตโดยไม่ต้องส่งอีเมลจริง (demo logic)

---

### ✅ 4. ระบบ RBAC (Role-Based Access Control)
- ใช้ `ProtectedRoute` เพื่อตรวจสอบสิทธิ์การเข้าถึงหน้าแต่ละประเภท
- บทบาทที่รองรับ:
  - Admin → เข้าถึง `/admin`
  - User → เข้าถึง `/user`

---

### ✅ 5. การจัดการเส้นทาง (Routing)
- ใช้ `react-router-dom` v6
- เส้นทางหลัก:
  - `/login`
  - `/register`
  - `/Reset-EmPassword`
  - `/admin`
  - `/user`
- เส้นทางเริ่มต้น (`/`) → จะ redirect ไปยัง `/login`

---

### ✅ 6. การตกแต่ง UI
- ใช้ **CSS ปกติ** สำหรับ layout (`App.css`, `login.css`)
- ใช้ **Tailwind CSS** สำหรับปรับแต่งส่วนประกอบอย่างรวดเร็ว
- ส่วนประกอบที่ตกแต่ง ได้แก่:
  - Input
  - ปุ่ม
  - Container
  - ลิงก์

---

## 🔐 Backend API ที่เกี่ยวข้อง

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | เข้าสู่ระบบ |
| `POST` | `/api/register` | สมัครสมาชิก |
| `POST` | `/api/request-reset` | ส่ง OTP ไปยังอีเมล |
| `POST` | `/api/reset-password-otp` | รีเซ็ตรหัสผ่านด้วย OTP |

---
