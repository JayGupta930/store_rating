import React, { useState, useEffect } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { supabase } from "../../../services/supabaseClient";
import "./stores.css";

const EditStoreModal = ({ isOpen, onClose, onSubmit, store }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    category: "",
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.Store_Name || "",
        email: store.Email || "",
        address: store.Address || "",
        category: store.Category || "",
        image: null,
        imagePreview: store.Image_Url || null
      });
    }
  }, [store]);

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

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imagePreview;
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

      onSubmit({
        ...formData,
        image: imageUrl,
        id: store.id
      });
      
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Store</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <input
              type="text"
              name="name"
              placeholder="Store Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="email"
              name="email"
              placeholder="Store Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="text"
              name="address"
              placeholder="Store Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="retail">Retail</option>
              <option value="restaurant">Restaurant</option>
              <option value="services">Services</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field image-field">
            <div className="image-upload-wrapper">
              <div className={`image-drop-area ${formData.imagePreview ? 'has-image' : ''}`}>
                {formData.imagePreview ? (
                  <div className="image-preview-container">
                    <img src={formData.imagePreview} alt="Store preview" />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
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
                />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Update Store</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddStoreModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    category: "",
    image: null,
    imagePreview: null
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

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
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

      onSubmit({
        ...formData,
        image: imageUrl
      });
      
      setFormData({
        name: "",
        email: "",
        address: "",
        category: "",
        image: null,
        imagePreview: null
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Store</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <input
              type="text"
              name="name"
              placeholder="Store Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="email"
              name="email"
              placeholder="Store Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="text"
              name="address"
              placeholder="Store Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="retail">Retail</option>
              <option value="restaurant">Restaurant</option>
              <option value="services">Services</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field image-field">
            <div className="image-upload-wrapper">
              <div className={`image-drop-area ${formData.imagePreview ? 'has-image' : ''}`}>
                {formData.imagePreview ? (
                  <div className="image-preview-container">
                    <img src={formData.imagePreview} alt="Store preview" />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
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
                />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Store</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Stores = ({ stores: initialStores, filters, handleFilterChange }) => {
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState(initialStores || []);
  const [isLoading, setIsLoading] = useState(true);
  const defaultStoreImage = process.env.PUBLIC_URL + '/assets/image1.png';

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('Stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stores:', error);
        return;
      }

      setStores(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleAddStore = async (newStore) => {
    try {
      const { data, error } = await supabase
        .from('Stores')
        .insert([{
          Store_Name: newStore.name,
          Email: newStore.email,
          Address: newStore.address,
          Category: newStore.category,
          Image_Url: newStore.image,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error adding store:', error);
        return;
      }

      if (data) {
        setStores(prevStores => [data[0], ...prevStores]);
      }
      setIsAddStoreModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditStore = async (updatedStore) => {
    try {
      const { data, error } = await supabase
        .from('Stores')
        .update({
          Store_Name: updatedStore.name,
          Email: updatedStore.email,
          Address: updatedStore.address,
          Category: updatedStore.category,
          Image_Url: updatedStore.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedStore.id)
        .select();

      if (error) {
        console.error('Error updating store:', error);
        return;
      }

      if (data) {
        setStores(prevStores =>
          prevStores.map(store =>
            store.id === updatedStore.id ? data[0] : store
          )
        );
      }
      setIsEditStoreModalOpen(false);
      setSelectedStore(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        const { error } = await supabase
          .from('Stores')
          .delete()
          .eq('id', storeId);

        if (error) {
          console.error('Error deleting store:', error);
          return;
        }

        setStores(prevStores => prevStores.filter(store => store.id !== storeId));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEditClick = (store) => {
    setSelectedStore(store);
    setIsEditStoreModalOpen(true);
  };

  const filteredStores = stores.filter((store) => {
    return (
      store.Store_Name?.toLowerCase().includes(filters.name.toLowerCase()) &&
      store.Email?.toLowerCase().includes(filters.email.toLowerCase()) &&
      store.Address?.toLowerCase().includes(filters.address.toLowerCase())
    );
  });

  return (
    <>
      <div className="section-header">
        <h2>Stores Management</h2>
        <button className="add-btn" onClick={() => setIsAddStoreModalOpen(true)}>Add New Store</button>
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
      </div>

      <div className="stores-list">
        {isLoading ? (
          <div className="loading">Loading stores...</div>
        ) : filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div key={store.id} className="modern-card">
              <div className="card-image">
                <img src={store.Image_Url || defaultStoreImage} alt={store.Store_Name} />
              </div>
              <div className="card-content">
                <h2 className="card-headline">{store.Store_Name}</h2>
                <div className="card-body-text">
                  <p><strong>Name:</strong> {store.Store_Name}</p>
                  <p><strong>Address:</strong> {store.Address || "N/A"}</p>
                  <p><strong>Email:</strong> {store.Email || "N/A"}</p>
                  <p><strong>Category:</strong> {store.Category || "N/A"}</p>
                  <p className="rating-row">
                    <strong>Rating:</strong> 
                    <span className="rating-display">
                      <span className="rating-stars">
                        {'★'.repeat(Math.round(store.Rating || 0))}
                        {'☆'.repeat(5 - Math.round(store.Rating || 0))}
                      </span>
                      <span className="rating-value">{store.Rating || "N/A"}</span>
                    </span>
                  </p>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleEditClick(store)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-primary btn-delete"
                    onClick={() => handleDeleteStore(store.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No stores found matching your filters</div>
        )}
      </div>

      <AddStoreModal
        isOpen={isAddStoreModalOpen}
        onClose={() => setIsAddStoreModalOpen(false)}
        onSubmit={handleAddStore}
      />

      <EditStoreModal
        isOpen={isEditStoreModalOpen}
        onClose={() => {
          setIsEditStoreModalOpen(false);
          setSelectedStore(null);
        }}
        onSubmit={handleEditStore}
        store={selectedStore}
      />
    </>
  );
};

export default Stores;
