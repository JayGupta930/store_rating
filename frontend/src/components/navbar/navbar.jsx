import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import './navbar.css';

const ProfileDropdown = ({ userRole, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));

  const handleEditProfile = () => {
    switch (userRole) {
      case 'USER':
        navigate('/userDash/profile');
        break;
      case 'STORE_OWNER':
        navigate('/ownerDashboard/profile');
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="profile-dropdown">
      <button className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
        <FaUserCircle className="profile-icon" />
        <span>{userData?.name || 'User'}</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleEditProfile}>
            <FaCog /> Edit Profile
          </button>
          <button onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const logoPath = '/assets/store.svg';
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsLoggedIn(true);
      setUserRole(JSON.parse(userData).role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/home');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={logoPath} alt="Store Rating Logo" className="navbar-logo" />
          <h1>Store Rating</h1>
        </div>
        <div className="navbar-right">
          <ul className="navbar-links">
            <li className={isActive('/') ? 'active' : ''}><Link to="/">Home</Link></li>
            {userRole === 'ADMIN' && (
              <li className={isActive('/systemAdmin') ? 'active' : ''}><Link to="/systemAdmin">Admin</Link></li>
            )}
          </ul>
          {isLoggedIn ? (
            <ProfileDropdown userRole={userRole} onLogout={handleLogout} />
          ) : (
            <div className="auth-buttons">
              <Link to="/loginPage" className="login-btn">Login</Link>
              <Link to="/registrationPage" className="signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;