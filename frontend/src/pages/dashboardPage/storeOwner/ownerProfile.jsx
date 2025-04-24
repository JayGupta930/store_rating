import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaCamera,
  FaBriefcase,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { supabase } from "../../../services/supabaseClient";
import "./ownerProfile.css";

const OwnerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: JSON.parse(localStorage.getItem("userData"))?.email || "",
    phone: "",
    address: "",
    businessName: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", userData.email)
            .single();

          if (error) throw error;

          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            businessName: data.business_name || "",
            avatar: data.avatar_url || null,
          });

          const updatedUserData = { ...userData, name: data.name };
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `owner-avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("user-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("user-images")
          .getPublicUrl(filePath);

        setProfile((prev) => ({
          ...prev,
          avatar: data.publicUrl,
        }));
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          address: profile.address,
        })
        .eq("email", profile.email);

      if (error) throw error;

      const userData = JSON.parse(localStorage.getItem("userData"));
      const updatedUserData = { ...userData, name: profile.name };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="owner-profile-container">
      <div className="owner-profile-card">
        <div className="profile-header">
          <h2>Store Owner Profile</h2>
          <button
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FaEdit /> {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="avatar-section">
            <div className="avatar-container">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <FaUser />
                </div>
              )}
              {isEditing && (
                <label className="avatar-upload">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="profile-fields">
            <div className="form-group">
              <label>
                <FaUser className="field-icon" />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Your Name"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <FaBriefcase className="field-icon" />
                <input
                  type="text"
                  name="businessName"
                  value={profile.businessName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Business Name"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope className="field-icon" />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled={true}
                  readOnly
                  style={{
                    backgroundColor: "#f5f5f5",
                    color: "#333",
                  }}
                />
                <small
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "12px",
                    fontSize: "0.75rem",
                    color: "#666",
                  }}
                ></small>
              </label>
            </div>

            <div className="form-group">
              <label>
                <FaPhone className="field-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Phone Number"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="field-icon" />
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Address"
                  required
                />
              </label>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerProfile;
