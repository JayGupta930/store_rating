import React, { useState } from "react";
import { FaUsers, FaStore, FaStar, FaUserPlus, FaSync } from "react-icons/fa";
import "./dashboard.css";

const Dashboard = ({ stats }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sampleActivities = [
    {
      type: "store",
      description: "New store added: Urban Threads",
      time: "2 hours ago",
    },
    {
      type: "user",
      description: "New user registered: Jane Smith",
      time: "4 hours ago",
    },
    {
      type: "rating",
      description: "New review for Tech Haven (⭐ 4.5)",
      time: "5 hours ago",
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaStore />
          </div>
          <div className="stat-content">
            <h3>Total Stores</h3>
            <p>{stats.totalStores}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>Total Ratings</h3>
            <p>{stats.totalRatings}</p>
          </div>
        </div>
      </div>
      <div className="recent-activity">
        <div className="activity-header">
          <h2>Recent Activity</h2>
          <button
            className={`refresh-button ${isRefreshing ? "refreshing" : ""}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FaSync />
          </button>
        </div>
        <div className="activity-list">
          {sampleActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {activity.type === "user" && <FaUserPlus />}
                {activity.type === "store" && <FaStore />}
                {activity.type === "rating" && <FaStar />}
              </div>
              <div className="activity-content">
                <p>{activity.description}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
