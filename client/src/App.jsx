import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import RegisterPage from './RegisterPage'
import ForgotPassword from './ForgotPassword'
import VerifyOtp from './VerifyOtp'
import ResetPassword from './ResetPassword'
import Home from './home'
import React from 'react'
import './App.css'
import EditForm from './editForm'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<EditForm/>} />

      </Routes>
    </Router>
  )
}

export default App
