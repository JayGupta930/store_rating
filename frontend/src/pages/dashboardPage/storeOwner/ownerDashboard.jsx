import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ownerDashboard.css";
import { supabase } from "../../../services/supabaseClient";
import AddStore from "./addstore";
import {
  FaStore,
  FaEdit,
  FaTrash,
  FaShoppingBag,
  FaRegStar,
} from "react-icons/fa";

const StarRating = ({ rating }) => {
  return (
    <div className="rating-stars">
      {[...Array(5)].map((_, index) => (
        <span key={index}>{index < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

const UserAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return <div className="user-avatar">{initials}</div>;
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card" style={{ "--card-color": color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h4 className="stat-title">{title}</h4>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};

const RatingCard = ({ user, formatDate }) => {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / card.offsetWidth) * 100;
    const y = ((e.clientY - rect.top) / card.offsetHeight) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div className="rating-card" onMouseMove={handleMouseMove} key={user.id}>
      <div className="rating-header">
        <UserAvatar name={user.name} />
        <div className="user-info">
          <p className="user-name">{user.name}</p>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
      <StarRating rating={user.rating} />
      <span className="rating-date">{formatDate(user.date)}</span>
    </div>
  );
};

const StoreCard = ({
  store,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [editedStore, setEditedStore] = useState(store);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStore((prevStore) => ({ ...prevStore, [name]: value }));
  };

  return (
    <div className="store-card">
      {store.Image_Url ? (
        <div className="store-image">
          <img src={store.Image_Url} alt={store.Store_Name} />
        </div>
      ) : (
        <div className="store-icon">
          <FaStore />
        </div>
      )}
      <div className="store-content">
        {isEditing ? (
          <div className="store-info">
            <input
              type="text"
              name="Store_Name"
              value={editedStore.Store_Name}
              onChange={handleChange}
              placeholder="Store Name"
            />
            <input
              type="email"
              name="Email"
              value={editedStore.Email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="Category"
              value={editedStore.Category}
              onChange={handleChange}
              placeholder="Category"
            />
            <input
              type="text"
              name="Address"
              value={editedStore.Address}
              onChange={handleChange}
              placeholder="Address"
            />
            <textarea
              name="Description"
              value={editedStore.Description}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>
        ) : (
          <div className="store-info">
            <p className="store-name">Name : {store.Store_Name}</p>
            <p className="store-email">Email : {store.Email}</p>
            <p className="store-category">Category : {store.Category}</p>
            <p className="store-address">Address : {store.Address}</p>
            <p className="store-description">
              Description : {store.Description}
            </p>
          </div>
        )}
        <div className="store-actions">
          {isEditing ? (
            <>
              <button onClick={() => onSave(editedStore)} className="save-btn">
                Save
              </button>
              <button onClick={onCancel} className="cancel-btn">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onEdit(store)} className="edit-btn">
                <FaEdit /> Edit
              </button>
              <button onClick={() => onDelete(store.id)} className="delete-btn">
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [ratedUsers, setRatedUsers] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRatedUsers([
          {
            id: 1,
            name: "Alice Smith",
            email: "alice@example.com",
            rating: 5,
            date: "2025-04-21",
          },
          {
            id: 2,
            name: "Bob Johnson",
            email: "bob@example.com",
            rating: 4,
            date: "2025-04-20",
          },
          {
            id: 3,
            name: "Charlie Brown",
            email: "charlie@example.com",
            rating: 3,
            date: "2025-04-22",
          },
        ]);
        setAverageRating(4.0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData?.email) {
          console.error("No user email found");
          return;
        }

        const { data, error } = await supabase
          .from("Stores")
          .select("*")
          .eq("Email", userData.email);

        if (error) {
          console.error("Error fetching stores:", error);
          return;
        }

        setStores(data || []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStores();
  }, []);

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...ratedUsers];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [ratedUsers, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/home");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddStore = async (newStore) => {
    setIsAddStoreOpen(false);
    setStores((prevStores) => [...prevStores, newStore]);
  };

  const handleEditStore = async (updatedStore) => {
    try {
      const { error } = await supabase
        .from("Stores")
        .update({
          Store_Name: updatedStore.Store_Name,
          Email: updatedStore.Email,
          Category: updatedStore.Category,
          Address: updatedStore.Address,
          Description: updatedStore.Description,
          Image_Url: updatedStore.Image_Url,
        })
        .eq("id", updatedStore.id)
        .select();

      if (error) {
        console.error("Error updating store:", error);
        return;
      }

      setStores(
        stores.map((store) =>
          store.id === updatedStore.id ? updatedStore : store
        )
      );
      setEditingStore(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      const { error } = await supabase
        .from("Stores")
        .delete()
        .eq("id", storeId);

      if (error) {
        console.error("Error deleting store:", error);
        return;
      }

      setStores(stores.filter((store) => store.id !== storeId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <h2>Store Owner Dashboard</h2>
        <button
          className="add-store-button"
          onClick={() => setIsAddStoreOpen(true)}
        >
          <FaStore /> Add New Store
        </button>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Total Stores"
          value={stores.length}
          icon={<FaShoppingBag />}
          color="#4f46e5"
        />
        <StatCard
          title="Total Reviews"
          value={ratedUsers.length}
          icon={<FaRegStar />}
          color="#10b981"
        />
      </div>

      <div className="stores-section">
        <h3>My Stores</h3>
        {stores.length > 0 ? (
          <div className="stores-grid">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                isEditing={editingStore === store.id}
                onEdit={() => setEditingStore(store.id)}
                onSave={handleEditStore}
                onCancel={() => setEditingStore(null)}
                onDelete={handleDeleteStore}
              />
            ))}
          </div>
        ) : (
          <div className="no-stores">
            <p>You haven't added any stores yet.</p>
            <p>Click the "Add New Store" button to get started!</p>
          </div>
        )}
      </div>

      <div className="dashboard-summary">
        <h3>Store Performance</h3>
        {averageRating !== null ? (
          <p>
            {averageRating.toFixed(1)}
            <StarRating rating={Math.round(averageRating)} />
          </p>
        ) : (
          <p>Loading average rating...</p>
        )}
      </div>

      <div className="user-ratings-list">
        <h3>Customer Ratings</h3>

        <div className="rating-sort">
          <button
            className={`sort-button ${
              sortConfig.key === "date" ? "active" : ""
            }`}
            onClick={() => requestSort("date")}
          >
            {sortConfig.key === "date"
              ? sortConfig.direction === "ascending"
                ? "Newest First ↑"
                : "Oldest First ↓"
              : "Sort by Date"}
          </button>
          <button
            className={`sort-button ${
              sortConfig.key === "rating" ? "active" : ""
            }`}
            onClick={() => requestSort("rating")}
          >
            {sortConfig.key === "rating"
              ? sortConfig.direction === "ascending"
                ? "Highest Rating ↑"
                : "Lowest Rating ↓"
              : "Sort by Rating"}
          </button>
          <button
            className={`sort-button ${
              sortConfig.key === "name" ? "active" : ""
            }`}
            onClick={() => requestSort("name")}
          >
            {sortConfig.key === "name"
              ? sortConfig.direction === "ascending"
                ? "Name A-Z ↑"
                : "Name Z-A ↓"
              : "Sort by Name"}
          </button>
        </div>

        {ratedUsers.length > 0 ? (
          <div className="ratings-grid">
            {sortedUsers.map((user) => (
              <RatingCard key={user.id} user={user} formatDate={formatDate} />
            ))}
          </div>
        ) : (
          <div className="no-ratings">
            <p>No ratings submitted yet.</p>
          </div>
        )}
      </div>

      <AddStore
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onSubmit={handleAddStore}
      />

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default OwnerDashboard;
