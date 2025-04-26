import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/reset-password', { state: { email } });
      } else {
        setErrorMsg(data.msg || 'Invalid OTP.');
      }
    } catch {
      setErrorMsg('Server error.');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleVerify} className="login-form">
        <h2>Verify OTP</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <label>Enter OTP sent to {email}</label>
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOtp;
