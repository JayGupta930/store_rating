import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Dashboard from './dashboard';
import User from './user';
import Stores from './stores';
import './systemAdmin.css';

const SystemAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  // Fetch dashboard data, users, and stores
  useEffect(() => {
    // TODO: Replace with actual API calls
    // Mock data for demonstration
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St', role: 'user'},
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', address: '456 Oak Ave', role: 'admin' },
      { id: 3, name: 'Store One', email: 'store1@example.com', address: '789 Market St', role: 'store'}
    ];

    const mockStores = [
      { id: 1, name: 'Store One', email: 'store1@example.com', address: '789 Market St', rating: 4.5 },
      { id: 2, name: 'Store Two', email: 'store2@example.com', address: '321 Shop Ave', rating: 4.0 }
    ];

    setUsers(mockUsers);
    setStores(mockStores);
    setDashboardStats({
      totalUsers: mockUsers.length,
      totalStores: mockStores.length,
      totalRatings: 320
    });
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = (newUser) => {
    // TODO: Implement API call to add new user
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/loginPage');
  };

  return (
    <div className="admin-dashboard">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout}
      />

      <main className="admin-main">
        {activeTab === 'dashboard' && <Dashboard stats={dashboardStats} />}

        {activeTab === 'users' && (
          <User 
            users={users}
            filters={filters}
            handleFilterChange={handleFilterChange}
            onAddUser={handleAddUser}
          />
        )}

        {activeTab === 'stores' && (
          <Stores 
            stores={stores}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        )}
      </main>
    </div>
  );
};

export default SystemAdmin;