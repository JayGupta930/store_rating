import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaCamera } from 'react-icons/fa';
import { supabase } from '../../../services/supabaseClient';
import './profile.css';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        address: '',
        avatar: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData) {
                    const { data, error } = await supabase
                        .from('Users')
                        .select('*')
                        .eq('email', userData.email)
                        .single();

                    if (error) throw error;

                    setProfile({
                        name: data.name || '',
                        email: data.email || '',
                        address: data.address || '',
                        avatar: data.avatar_url || null
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                // Upload image
                const { error: uploadError } = await supabase.storage
                    .from('user-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('user-images')
                    .getPublicUrl(filePath);

                // Update profile
                setProfile(prev => ({
                    ...prev,
                    avatar: publicUrl
                }));
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('Users')
                .update({
                    name: profile.name,
                    address: profile.address,
                    avatar_url: profile.avatar,
                    updated_at: new Date().toISOString()
                })
                .eq('email', profile.email);

            if (error) throw error;
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return <div className="profile-loading">Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <button 
                        className="edit-button"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
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
                                        style={{ display: 'none' }}
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
                                <FaEnvelope className="field-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    disabled={true}
                                    placeholder="Email Address"
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

export default Profile;