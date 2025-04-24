import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import homeImage from './home.png';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <h1 className="hero-title">We Create</h1>
            <p className="hero-description">
              A revolutionary platform that transforms how you discover and rate stores. 
              We bring together shoppers and businesses, creating a trusted community 
              where authentic reviews shape better shopping experiences. Join us in 
              building a more transparent and reliable shopping ecosystem.
            </p>
            <div className="hero-buttons">
              <Link to="/loginPage" className="btn btn-primary">Login</Link>
              <Link to="/registrationPage" className="btn btn-secondary">Sign Up</Link>
            </div>
          </div>
          <div className="hero-right">
            <img src={homeImage} alt="Platform Overview" className="hero-image" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>What Our Platform Offers</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏪</div>
            <h3>Find Stores</h3>
            <p>Discover local and online stores with detailed information and reviews</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rate & Review</h3>
            <p>Share your experiences and help others make informed decisions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Store Analytics</h3>
            <p>Store owners can track their performance and customer feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Join a community of shoppers and store owners</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up as a user or store owner</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Explore Stores</h3>
            <p>Browse through various stores and their ratings</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Share Experience</h3>
            <p>Rate stores and leave helpful reviews</p>
          </div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <h4>About Us</h4>
            <p>We help you discover and rate stores, creating a trusted community for better shopping experiences.</p>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/loginPage">Login</Link></li>
              <li><Link to="/registrationPage">Sign Up</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/jaygupta.web.app">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>Email: jaygupta.works@gmail.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Rating Street</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="/" className="social-link">Twitter</a>
              <a href="/" className="social-link">Instagram</a>
              <a href="/" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Store Rating. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;