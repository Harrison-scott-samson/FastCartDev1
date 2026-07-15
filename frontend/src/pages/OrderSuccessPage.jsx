import { useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './OrderSuccess.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return <Navigate to="/shop" />;
  }

  return (
    <>
      <Navbar />
      <div className="success-container animate-fade">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p className="success-subtitle">Skip the line and pick up your items fast.</p>
          
          <div className="token-board">
            <div className="token-item">
              <span className="token-label">Token Number</span>
              <span className="token-value highlight-text">{orderData.token}</span>
            </div>
            <div className="divider"></div>
            <div className="token-item">
              <span className="token-label">Secret OTP</span>
              <span className="token-value otp-text">{orderData.otp}</span>
            </div>
          </div>
          
          <div className="instructions">
            <h3>Pickup Instructions</h3>
            <ul>
              <li>Wait until your order status is <strong>"Ready"</strong></li>
              <li>Show your Token Number at the counter</li>
              <li>Provide your Secret OTP for verification</li>
            </ul>
          </div>

          <div className="success-actions">
            <Link to="/history" className="btn-primary">View My Orders</Link>
            <Link to="/shop" className="btn-secondary">Back to Shop</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
