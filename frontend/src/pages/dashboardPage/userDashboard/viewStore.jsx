import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  FaStar,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaTags,
  FaFileAlt,
  FaStore,
} from "react-icons/fa";
import { supabase } from "../../../services/supabaseClient";
import {
  getStoreRatings,
  addStoreRating,
  updateStoreRating,
  deleteStoreRating,
} from "../../../services/storeRatingsService";
import "./viewStore.css";

const ViewStore = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        if (!location.state?.store) {
          const numericStoreId = parseInt(storeId, 10);
          if (isNaN(numericStoreId)) {
            console.error("Invalid store ID");
            return;
          }

          const { data, error } = await supabase
            .from("Stores")
            .select("*")
            .eq("id", numericStoreId)
            .single();

          if (error) {
            console.error("Error fetching store:", error);
            return;
          }

          setStore({
            id: data.id,
            name: data.Store_Name,
            email: data.Email,
            address: data.Address,
            category: data.Category || "Uncategorized",
            description: data.Description,
            image: data.Image_Url,
          });
        } else {
          const storeData = location.state.store;
          setStore({
            ...storeData,
            id:
              typeof storeData.id === "string"
                ? parseInt(storeData.id, 10)
                : storeData.id,
            category: storeData.tag || storeData.category || "Uncategorized",
          });
        }

        const ratingStoreId = store?.id || parseInt(storeId, 10);
        const { data: ratingsData, error: ratingsError } =
          await getStoreRatings(ratingStoreId);
        if (!ratingsError && ratingsData) {
          setReviews(ratingsData);
          if (currentUser) {
            const userReview = ratingsData.find(
              (review) => review.user_id === currentUser.id
            );
            if (userReview) {
              setUserRating(userReview);
              setRating(userReview.rating);
              setReviewText(userReview.comment);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, location.state?.store, currentUser, store?.id]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setError("");
    setIsEditing(false); // Reset editing mode after submission

    if (!currentUser) {
      setError("Please log in to submit a rating");
      return;
    }
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!store?.id) {
      setError("Store information is not available");
      return;
    }

    try {
      let result;
      if (userRating) {
        result = await updateStoreRating(userRating.id, rating, reviewText);
        if (result.error) throw new Error(result.error);
      } else {
        result = await addStoreRating(
          store.id,
          currentUser.id,
          rating,
          reviewText
        );
        if (result.error) throw new Error(result.error);
      }

      const { data: ratingsData, error: fetchError } = await getStoreRatings(
        store.id
      );
      if (fetchError) throw new Error(fetchError);

      setReviews(ratingsData || []);

      if (!userRating) {
        setReviewText("");
        setRating(0);
      }
      setError("");
    } catch (error) {
      console.error("Rating submission error:", error);
      setError(
        error.message || "An error occurred while submitting the rating"
      );
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!currentUser) return;
    try {
      await deleteStoreRating(ratingId);
      setReviews(reviews.filter((review) => review.id !== ratingId));
      setUserRating(null);
      setRating(0);
      setReviewText("");
      setIsEditing(false); // Reset editing mode after deletion
    } catch (error) {
      setError("Error deleting rating: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!store) return <div>Store not found</div>;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "No ratings yet";

  return (
    <div className="view-store-container">
      <div className="store-details">
        <div className="store-header">
          <div className="store-image-container">
            {store.image ? (
              <img
                src={store.image}
                alt={store.name}
                className="store-image"
              />
            ) : (
              <div className="store-image-placeholder">
                <FaStore />
                <span>No image available</span>
              </div>
            )}
          </div>
          <div className="store-info">
            <h1>{store.name}</h1>
            <div className="store-features">
              <div className="feature">
                <FaMapMarkerAlt className="feature-icon" />
                <div className="feature-content">
                  <span className="feature-label">Location</span>
                  <span className="feature-value">{store.address}</span>
                </div>
              </div>
              <div className="feature">
                <FaEnvelope className="feature-icon" />
                <div className="feature-content">
                  <span className="feature-label">Email</span>
                  <a href={`mailto:${store.email}`} className="feature-value">
                    {store.email}
                  </a>
                </div>
              </div>
              <div className="feature">
                <FaTags className="feature-icon" />
                <div className="feature-content">
                  <span className="feature-label">Services</span>
                  <span className="feature-value">{store.category}</span>
                </div>
              </div>
              <div className="feature">
                <FaStar className="feature-icon" />
                <div className="feature-content">
                  <span className="feature-label">Average Rating</span>
                  <div className="feature-value">
                    {averageRating} 
                    <span className="total-reviews">
                      ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>
              {store.description && (
                <div className="feature description-feature">
                  <FaFileAlt className="feature-icon" />
                  <div className="feature-content">
                    <span className="feature-label">About</span>
                    <p className="feature-value description">{store.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <div className="no-reviews">No reviews yet</div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <FaUser className="user-icon" />
                      <span className="reviewer-name">
                        {review.profiles?.name || "Anonymous"}
                      </span>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={index < review.rating ? "active" : ""}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="review-content">{review.comment}</p>
                  )}
                  <div className="review-date">
                    <FaCalendarAlt className="calendar-icon" />
                    <span>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Section */}
        <div className="rating-section">
          <div className="rating-header">
            <h2>Rate this Store</h2>
            {currentUser && userRating && !isEditing && (
              <button
                className="edit-rating-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Rating
              </button>
            )}
          </div>
          {error && <div className="error-message">{error}</div>}
          {!currentUser ? (
            <p>Please log in to rate this store</p>
          ) : (
            <form onSubmit={handleSubmitRating} className="rating-form">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? "active" : ""}`}
                    onClick={() => isEditing || !userRating ? setRating(star) : null}
                    onMouseEnter={() => isEditing || !userRating ? setHoverRating(star) : null}
                    onMouseLeave={() => isEditing || !userRating ? setHoverRating(0) : null}
                    style={{ cursor: isEditing || !userRating ? "pointer" : "default" }}
                  />
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this store (optional)"
                rows="4"
                disabled={!isEditing && userRating}
              />
              {(!userRating || isEditing) && (
                <div className="rating-buttons">
                  {isEditing && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setIsEditing(false);
                        if (userRating) {
                          setRating(userRating.rating);
                          setReviewText(userRating.comment);
                        }
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit">
                    {userRating ? "Update Rating" : "Submit Rating"}
                  </button>
                  {isEditing && userRating && (
                    <button
                      type="button"
                      className="delete-rating"
                      onClick={() => handleDeleteRating(userRating.id)}
                    >
                      Delete Rating
                    </button>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStore;
