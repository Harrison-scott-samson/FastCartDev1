import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="landing-container animate-fade">
        <div className="hero-section">
          <h1 className="hero-title">
            Skip the queue. <br/> <span className="highlight-text">Pre-order</span> your campus essentials.
          </h1>
          <p className="hero-subtitle">
            Order snacks, stationery, and drinks securely and pick them up using a secure OTP token. Fast. Easy. Premium.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary hero-btn">Explore Shop</Link>
            <Link to="/login" className="btn-secondary hero-btn">Login / Signup</Link>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="circle-bg"></div>
          {/* Using CSS art and float animations to look premium */}
          <div className="floating-card c1">🛍️ Snacks</div>
          <div className="floating-card c2">📚 Stationery</div>
          <div className="floating-card c3">🥤 Drinks</div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="features-section">
        <h2>How it works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3>1. Order Online</h3>
            <p>Browse categories and add your favorite items to your cart.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>2. Get OTP Token</h3>
            <p>Receive a unique token and OTP to secure your order pickup.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏃</div>
            <h3>3. Fast Pickup</h3>
            <p>Show your token at the store counter, verify your OTP securely, and you're good to go!</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
