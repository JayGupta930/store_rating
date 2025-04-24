import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaSearch,
  FaSignOutAlt,
  FaStore,
  FaMapMarkerAlt,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { supabase } from "../../../services/supabaseClient";
import "./userDash.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const autoPlayDelay = 3000; 

  const carouselImages = [
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1546213290-e1b492ab3eee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1603191659812-ee978eeeef72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1610878227099-3ac7608c8b3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  ];

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase.from("Stores").select("*");

        if (error) {
          console.error("Error fetching stores:", error);
          return;
        }

        const transformedStores = data.map((store) => ({
          id: store.id,
          name: store.Store_Name,
          address: store.Address,
          overallRating: store.Rating || 4.5,
          image: store.Image_Url,
          tag: store.Category || "Uncategorized",
          description: store.Description,
          email: store.Email,
        }));

        setStores(transformedStores);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) =>
          prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
        );
      }, autoPlayDelay);
    };

    if (isAutoPlaying) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, carouselImages.length]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentSlide * carouselRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchCategoryChange = (category) => {
    setSearchCategory(category);
  };

  const filteredStores = stores.filter((store) => {
    const searchValue = searchTerm.toLowerCase();
    if (searchCategory === "name") {
      return store.name.toLowerCase().includes(searchValue);
    }
    return store.address.toLowerCase().includes(searchValue);
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/home");
  };

  const handleViewStore = (storeId) => {
    const selectedStore = stores.find((store) => store.id === storeId);
    navigate(`/viewStore/${storeId}`, { state: { store: selectedStore } });
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
    );
  };

  const handleCarouselInteraction = (isPaused) => {
    setIsAutoPlaying(!isPaused);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Store Ratings</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <section className="modern-carousel-section">
        <h2 className="section-title">Featured Highlights</h2>
        <div
          className="modern-carousel-container"
          onMouseEnter={() => handleCarouselInteraction(true)}
          onMouseLeave={() => handleCarouselInteraction(false)}
        >
          <div ref={carouselRef} className="modern-carousel">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`modern-carousel-item ${
                  currentSlide === index ? "active" : ""
                }`}
              >
                <img src={image} alt={`Featured ${index + 1}`} />
                <div className="carousel-item-overlay">
                  <h3>Featured Collection {index + 1}</h3>
                  <p>Discover our exclusive selection of premium products.</p>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-nav prev" onClick={handlePrevSlide}>
            <FaArrowLeft />
          </button>
          <button className="carousel-nav next" onClick={handleNextSlide}>
            <FaArrowRight />
          </button>

          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  currentSlide === index ? "active" : ""
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div
            className={`auto-scroll-indicator ${isAutoPlaying ? "active" : ""}`}
          >
            <div className="progress-bar"></div>
          </div>
        </div>
      </section>

      <div className="search-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Search stores by ${searchCategory}`}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="search-categories">
          <button
            className={`category-btn ${
              searchCategory === "name" ? "active" : ""
            }`}
            onClick={() => handleSearchCategoryChange("name")}
          >
            Search by Name
          </button>
          <button
            className={`category-btn ${
              searchCategory === "address" ? "active" : ""
            }`}
            onClick={() => handleSearchCategoryChange("address")}
          >
            Search by Address
          </button>
        </div>
      </div>

      <div className="stores-grid">
        {filteredStores.map((store) => (
          <div key={store.id} className="store-card">
            <div className="store-image">
              {store.image ? (
                <img src={store.image} alt={store.name} loading="lazy" />
              ) : (
                <div className="store-image-placeholder">
                  <FaStore />
                </div>
              )}
            </div>
            <div className="store-content">
              <div className="store-name">
                <h3>{store.name}</h3>
                <p className="store-tag">{store.tag}</p>
              </div>
              <p className="store-description">
                {store.description || "No description available"}
              </p>
              <p className="store-address">
                <FaMapMarkerAlt className="location-icon" />
                <span>{store.address || "Address not available"}</span>
              </p>
              <div className="rating-info">
                <div className="overall-rating">
                  <span>Overall Rating</span>
                  <div className="stars">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`star ${
                          index < Math.floor(store.overallRating)
                            ? "filled"
                            : ""
                        }`}
                      />
                    ))}
                    <span className="rating-value">
                      ({store.overallRating?.toFixed(1) || "N/A"})
                    </span>
                  </div>
                </div>
                <button
                  className="view-store-button"
                  onClick={() => handleViewStore(store.id)}
                >
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
