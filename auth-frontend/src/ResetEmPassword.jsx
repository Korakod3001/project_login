import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./css/App.css";

/**
 * รีเซ็ตรหัสผ่านผ่าน OTP (เวอร์ชันปรับปรุง)
 * - ตรวจสอบรหัสผ่านและยืนยันรหัสผ่านตรงกันก่อนส่ง
 * - ปุ่มแสดง/ซ่อนรหัสผ่านด้วยไอคอนตา
 * - ป้องกันการกดส่งซ้ำด้วย state loading และ disabled button
 */
export default function ResetEmPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  /**
   * STEP 1 – ส่ง OTP ไปยังอีเมล
   */
  const handleRequestOtp = async () => {
    if (!email) {
      setError("กรุณากรอกอีเมลก่อน");
      return;
    }
    setMessage("");
    setError("");
    setLoadingOtp(true);
    try {
      const res = await axios.post("http://localhost:5000/api/request-reset", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.error || "ไม่สามารถส่ง OTP ได้";
      setError(msg);
    } finally {
      setLoadingOtp(false);
    }
  };

  /**
   * STEP 2 – รีเซ็ตรหัสผ่านด้วย OTP
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoadingReset(true);
    try {
      const res = await axios.post("http://localhost:5000/api/reset-password-otp", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      // Reset form
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setStep(1);
    } catch (err) {
      const msg = err.response?.data?.error || "ไม่สามารถรีเซ็ตรหัสผ่านได้";
      setError(msg);
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">🔐 รีเซ็ตรหัสผ่านผ่าน OTP</h2>

        {/* STEP 1 – ขอ OTP */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              onClick={handleRequestOtp}
              disabled={loadingOtp}
              className={`py-2 rounded-md text-white transition ${
                loadingOtp ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loadingOtp ? "กำลังส่ง..." : "ส่ง OTP ไปยังอีเมล"}
            </button>
            <p className="mt-6 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2 – รีเซ็ตรหัสผ่าน */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">📩 เราได้ส่ง OTP ไปยังอีเมลของคุณแล้ว</p>

            <input
              type="text"
              placeholder="กรอก OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />

            {/* รหัสผ่านใหม่ */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="รหัสผ่านใหม่"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* ยืนยันรหัสผ่าน */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่านใหม่"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loadingReset}
              className={`py-2 rounded-md text-white transition ${
                loadingReset ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingReset ? "กำลังรีเซ็ต..." : "รีเซ็ตรหัสผ่าน"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              ← ย้อนกลับไป Step 1
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
}
