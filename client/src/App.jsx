import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import RegisterPage from './RegisterPage'
import ForgotPassword from './ForgotPassword'
import VerifyOtp from './VerifyOtp'
import ResetPassword from './ResetPassword'
import Home from './home'
import React from 'react'
import Friend from './Friend'
import FriendSuggestion from './FriendSujjestion'
// import FriendsList from './FriendsList'
import FriendRequests from './FriendRequests'
import EditForm from './editForm'
import './App.css'
import Friends from './friends'

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
        <Route path="/profile" element={<EditForm />} />

        {/* Parent route with nested routes */}
        <Route path="/friends" element={<Friend />}>
          <Route index element={<FriendSuggestion />} />
          <Route path="friends/suggestions" element={<FriendSuggestion />} />
          <Route path="friends/friends" element={<Friends />} />
          <Route path="friends/requests" element={<FriendRequests />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
