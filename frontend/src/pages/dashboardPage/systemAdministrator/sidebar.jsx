import React from 'react';
import './sidebar.css';
import { MdDashboard } from 'react-icons/md';
import { FaUsers, FaStore } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  return (
    <nav className="admin-sidebar">
      <div className="admin-logo">
        <h2>Admin Panel</h2>
      </div>
      <ul className="admin-nav-items">
        <li 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <MdDashboard className="nav-icon" /> Dashboard
        </li>
        <li 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          <FaUsers className="nav-icon" /> Users
        </li>
        <li 
          className={activeTab === 'stores' ? 'active' : ''} 
          onClick={() => setActiveTab('stores')}
        >
          <FaStore className="nav-icon" /> Stores
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        <BiLogOut className="nav-icon" /> Logout
      </button>
    </nav>
  );
};

export default Sidebar;