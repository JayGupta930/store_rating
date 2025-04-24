import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';
import { registerUser } from '../../services/authService';
import './registrationPage.css';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setRoleError('');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRoleError('');
    
    if (!formData.role) {
      setRoleError('Please select a role to continue');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { error, success } = await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        address: formData.address,
        role: formData.role
      });

      if (error) {
        setError(error);
        return;
      }

      if (success) {
        navigate('/loginPage');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-box">
        <div className="registration-left">
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="registration-header">
              <h1>Sign up</h1>
            </div>

            {error && (
              <div className="error-message" role="alert">
                <FaExclamationTriangle /> {error}
              </div>
            )}

            <div className="role-selector">
              <div className="role-option">
                <input
                  type="radio"
                  id="user"
                  name="role"
                  value="USER"
                  checked={formData.role === 'USER'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="user">Normal User</label>
              </div>

              <div className="role-option">
                <input
                  type="radio"
                  id="store_owner"
                  name="role"
                  value="STORE_OWNER"
                  checked={formData.role === 'STORE_OWNER'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="store_owner">Store Owner</label>
              </div>
            </div>
            {roleError && (
              <div className="error-message" role="alert">
                <FaExclamationTriangle /> {roleError}
              </div>
            )}

            {formData.role === 'USER' && (
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
            )}

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
                </span>
              )}
            </div>

            {formData.role === 'USER' && (
              <div className="form-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  required
                />
              </div>
            )}
            
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
                  onClick={() => togglePasswordVisibility('password')}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="password-toggle"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className={`signup-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !emailValid}
            >
              {isLoading ? (
                <>
                  <CircularProgress color="inherit" />
                  <span>Signing up...</span>
                </>
              ) : 'Sign up'}
            </button>

            <div className="registration-footer">
              <p>
                Already have an account?{' '}
                <Link to="/loginPage" className="login-link">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="registration-right">
          <img 
            src={require('./Signup.gif')} 
            alt="Registration illustration" 
            className="registration-illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;