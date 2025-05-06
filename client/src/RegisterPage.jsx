import cityOptions from "./cityOptions"; // adjust the path as needed

import React, { useState, useEffect } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0); // countdown in seconds

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setOtpSent(false); // Re-enable form fields after 5 min
      setMessage("");
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: form.email,
          username: form.username,
          password: form.password,
          city: form.city,
        }
      );
      setOtpSent(true);
      setTimer(300); // 5 minutes = 300 seconds
      setMessage(data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: form.email,
          otp: form.otp,
        }
      );
      setOtpVerified(true);
      setMessage(data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to verify OTP");
    }
  };

  const registerUser = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email: form.email,
        }
      );
      setMessage(data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to register");
    }
  };

  const isFormDisabled = otpSent && timer > 0;

  return (
    <div className="container mt-5 p-5">
      <div
        className="border rounded p-4 shadow-sm bg-light mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <h2 className="mb-4 text-center fs-3">Register</h2>

        {/* Username */}
        <div className="mb-3 d-flex flex-column flex-md-row align-items-md-center">
          <label
            htmlFor="user"
            className="form-label fs-5 mb-2 mb-md-0 me-md-3"
            style={{ minWidth: "120px" }}
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="user"
            className="form-control form-control-lg"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        {/* Email */}
        <div className="mb-3 d-flex flex-column flex-md-row align-items-md-center">
          <label
            htmlFor="email"
            className="form-label fs-5 mb-2 mb-md-0 me-md-3"
            style={{ minWidth: "120px" }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control form-control-lg"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        {/* Password */}
        <div className="mb-3 d-flex flex-column flex-md-row align-items-md-center">
          <label
            htmlFor="password"
            className="form-label fs-5 mb-2 mb-md-0 me-md-3"
            style={{ minWidth: "120px" }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control form-control-lg"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        {/* City */}
        {/* City Dropdown */}
        <div className="mb-3 d-flex flex-column flex-md-row align-items-md-center">
          <label
            htmlFor="city"
            className="form-label fs-5 mb-2 mb-md-0 me-md-3"
            style={{ minWidth: "120px" }}
          >
            City
          </label>
          <select
            name="city"
            id="city"
            className="form-control form-control-lg"
            value={form.city}
            onChange={handleChange}
            disabled={isFormDisabled}
          >
            <option value="">Select City</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Send OTP */}
        <button
          className="btn btn-primary btn-lg w-100 mb-3"
          onClick={sendOtp}
          disabled={isFormDisabled}
        >
          Send OTP
        </button>

        {/* Timer */}
        {isFormDisabled && (
          <div className="text-center text-muted mb-3 fs-6">
            You can resend OTP in <strong>{formatTime(timer)}</strong>
          </div>
        )}

        {/* OTP Input */}
        {otpSent && (
          <>
            <div className="mb-3">
              <label className="form-label fs-5">OTP</label>
              <input
                type="text"
                name="otp"
                className="form-control form-control-lg"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
              />
            </div>
            <button
              className="btn btn-success btn-lg w-100 mb-3"
              onClick={verifyOtp}
              disabled={otpVerified}
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Register */}
        <button
          className="btn btn-dark btn-lg w-100"
          onClick={registerUser}
          disabled={!otpVerified}
        >
          Register
        </button>

        {/* Message */}
        {message && (
          <div
            className={`alert mt-4 fs-5 ${
              message.includes("success") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
