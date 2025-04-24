import React, { useState } from 'react';
import './user.css';

const User = ({ users, filters, handleFilterChange, onAddUser }) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });

  const handleNewUserChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    onAddUser(newUser);
    setShowAddUserModal(false);
  };

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (filters.role === '' || user.role === filters.role)
    );
  });

  // Function to get role display text
  const getRoleDisplay = (role) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'store': return 'Store Owner';
      default: return 'User';
    }
  };

  return (
    <div className="users-section">
      <div className="section-header">
        <h2>Users Management</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddUserModal(true)}
        >
          Add New User
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleFilterChange}
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store">Store Owner</option>
        </select>
      </div>

      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <div className="no-results">No users found matching your filters</div>
        ) : (
          filteredUsers.map(user => (
            <div className="modern-card" key={user.id}>
              <div className="card-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="card-content">
                <h2 className="card-headline">{user.name}</h2>
                <div className="role-tag" data-role={user.role}>{getRoleDisplay(user.role)}</div>
                <h3 className="card-subheadline">{user.address}</h3>
                
                <div className="card-body-text">
                  <div className="user-detail">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                  
                  {user.lastLogin && (
                    <div className="user-detail">
                      <span className="detail-label">Last Login:</span>
                      <span className="detail-value">{new Date(user.lastLogin).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {user.status && (
                    <div className="user-detail">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{user.status}</span>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button className="btn-secondary">Edit</button>
                  <button className="btn-primary btn-delete">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New User</h2>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleNewUserChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleNewUserChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleNewUserChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newUser.address}
                onChange={handleNewUserChange}
                required
              />
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                required
              >
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store">Store Owner</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Add User</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;