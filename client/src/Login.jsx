import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // 👈 create navigate instance
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMsg(''); // Reset the error message

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password,role }),
        credentials: 'include', // Make sure cookies are included with the request
      });

      const data = await res.json();
      console.log(data);
      console.log(res);
      if (res.ok) {
        console.log('Login successful', data);
        navigate('/home'); // ✅ redirect on successful login
      } else {
        setErrorMsg(data.msg || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="role" className="form-label">
            role
          </label>
          <select
            className="form-select"
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select your role</option>
            
              <option key={1} value='admin'>
                 admin
              </option>
                <option key={2} value='client'>
                 client
              </option>
          </select>
            <br></br>
        <button type="submit">Login</button>

        <div className="forgot-link">
          <a href="/forgot-password">Forgot password?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
