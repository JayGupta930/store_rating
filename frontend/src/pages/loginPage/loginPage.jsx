import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';
import { loginUser } from '../../services/authService';
import './loginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Hardcoded admin credentials check
    if (formData.email === 'jay.gupta@gmail.com' && formData.password === 'Jay123') {
      const adminData = {
        role: 'ADMIN',
        email: 'jay.gupta@gmail.com'
      };
      localStorage.setItem('user', JSON.stringify({ email: 'jay.gupta@gmail.com' }));
      localStorage.setItem('userData', JSON.stringify(adminData));
      navigate('/systemAdmin');
      return;
    }

    try {
      const { user, userData, error } = await loginUser(formData);
      
      if (error) {
        setError(error);
        return;
      }

      if (user && userData) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Clear any temporary registration data
        localStorage.removeItem('registeredRole');

        // Redirect based on role
        switch (userData.role) {
          case 'USER':
            navigate('/userDash');
            break;
          case 'STORE_OWNER':
            navigate('/ownerDashboard');
            break;
          case 'ADMIN':
            navigate('/systemAdmin');
            break;
          default:
            setError('Invalid role assigned');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <img 
            src="/assets/image.gif" 
            alt="Login illustration" 
            className="login-illustration"
          />
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h1>Log in</h1>
          </div>

          {error && (
            <div className="error-message" role="alert">
              <FaExclamationTriangle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                aria-invalid={!emailValid}
                aria-describedby={!emailValid ? 'email-error' : undefined}
                className={!emailValid ? 'input-error' : ''}
              />
              {!emailValid && (
                <span id="email-error" className="input-error-message">
                  Please enter a valid email address
                </span>
              )}
            </div>
            
            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !emailValid}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span>Logging in...</span>
                </>
              ) : 'Log in'}
            </button>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/registrationPage" className="signup-link">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;