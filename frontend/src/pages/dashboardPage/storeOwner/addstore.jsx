import React, { useState } from 'react';
import { supabase } from '../../../services/supabaseClient';
import './addStore.css';
import { FaStore, FaMapMarkerAlt, FaImage, FaTags, FaFileAlt, FaTimes, FaPlus, FaEnvelope } from 'react-icons/fa';

const AddStore = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        storeName: '',
        email: '',
        address: '',
        image: null,
        imagePreview: null,
        description: '',
        category: ''
    });

    const [touched, setTouched] = useState({
        storeName: false,
        email: false,
        address: false,
        description: false,
        category: false
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        image: file,
                        imagePreview: reader.result
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFocus = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let imageUrl = null;
            if (formData.image) {
                const fileExt = formData.image.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('image-store')
                    .upload(`store-images/${fileName}`, formData.image);

                if (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    return;
                }

                const { data } = supabase.storage
                    .from('image-store')
                    .getPublicUrl(`store-images/${fileName}`);
                
                imageUrl = data.publicUrl;
            }

            const { data, error } = await supabase.from('Stores').insert([{
                Store_Name: formData.storeName,
                Address: formData.address,
                Category: formData.category,
                Description: formData.description,
                Image_Url: imageUrl,
                Email: formData.email,
                created_at: new Date().toISOString()
            }]).select();

            if (error) {
                console.error('Error inserting store:', error);
                return;
            }

            setFormData({
                storeName: '',
                email: '',
                address: '',
                image: null,
                imagePreview: null,
                description: '',
                category: ''
            });
            
            setTouched({
                storeName: false,
                email: false,
                address: false,
                description: false,
                category: false
            });

            if (data && data[0]) {
                onSubmit(data[0]);
            }
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <FaStore className="modal-icon" />
                        <h2>Add New Store</h2>
                    </div>
                    <button className="close-button" onClick={onClose} aria-label="Close">
                        <FaTimes />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="store-form">
                    <div className={`form-field ${touched.storeName || formData.storeName ? 'active' : ''}`}>
                        <FaStore className="field-icon" />
                        <input
                            type="text"
                            id="storeName"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleChange}
                            onFocus={() => handleFocus('storeName')}
                            required
                        />
                        <label htmlFor="storeName" className="floating-label">Store Name</label>
                    </div>

                    <div className={`form-field ${touched.email || formData.storeName ? 'active' : ''}`}>
                        <FaEnvelope className="field-icon" />
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => handleFocus('email')}
                            required
                        />
                        <label htmlFor="email" className="floating-label">Store Email</label>
                    </div>

                    <div className={`form-field ${touched.address || formData.address ? 'active' : ''}`}>
                        <FaMapMarkerAlt className="field-icon" />
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            onFocus={() => handleFocus('address')}
                            required
                        />
                        <label htmlFor="address" className="floating-label">Address</label>
                    </div>

                    <div className="form-field image-field">
                        <div className="field-label">
                            <FaImage className="field-icon" />
                            <span>Store Image</span>
                        </div>
                        <div className="image-upload-wrapper">
                            <div className={`image-drop-area ${formData.imagePreview ? 'has-image' : ''}`}>
                                {formData.imagePreview ? (
                                    <div className="image-preview-container">
                                        <img src={formData.imagePreview} alt="Store preview" />
                                        <button 
                                            type="button" 
                                            className="remove-image-btn"
                                            onClick={() => setFormData(prev => ({
                                                ...prev, 
                                                image: null, 
                                                imagePreview: null
                                            }))}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <FaImage className="upload-icon" />
                                        <p>Drag & drop image or click to browse</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="file-input"
                                    required={!formData.imagePreview}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`form-field ${touched.category || formData.category ? 'active' : ''}`}>
                        <FaTags className="field-icon" />
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            onFocus={() => handleFocus('category')}
                            required
                        >
                            <option value="" disabled></option>
                            <option value="retail">Retail</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="services">Services</option>
                            <option value="technology">Technology</option>
                            <option value="other">Other</option>
                        </select>
                        <label htmlFor="category" className="floating-label">Category</label>
                    </div>

                    <div className={`form-field ${touched.description || formData.description ? 'active' : ''}`}>
                        <FaFileAlt className="field-icon" />
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onFocus={() => handleFocus('description')}
                            required
                        />
                        <label htmlFor="description" className="floating-label">Description</label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onSubmit}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            <FaPlus className="button-icon" />
                            Add Store
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStore;