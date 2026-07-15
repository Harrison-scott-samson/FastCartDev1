import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Checkout.css';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        { orderItems, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      clearCart();
      navigate('/success', { state: { orderData: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const total = (getCartTotal() + 5).toFixed(2);

  return (
    <>
      <Navbar />
      <div className="checkout-container animate-fade">
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Checkout</h2>
            {error && <div className="checkout-error">{error}</div>}
            
            <form onSubmit={handlePlaceOrder}>
              <div className="payment-options">
                <h3>Select Payment Method</h3>
                <label className={`payment-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="online" 
                    checked={paymentMethod === 'online'} 
                    onChange={() => setPaymentMethod('online')}
                  />
                  <div className="payment-details">
                    <h4>Pay Online (Simulation)</h4>
                    <p>Pay securely via UPI or Card</p>
                  </div>
                </label>
                
                <label className={`payment-card ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cash" 
                    checked={paymentMethod === 'cash'} 
                    onChange={() => setPaymentMethod('cash')}
                  />
                  <div className="payment-details">
                    <h4>Pay on Pickup</h4>
                    <p>Pay cash when you get your order</p>
                  </div>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary place-order-btn" 
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Processing...' : `Place Order • ₹${total}`}
              </button>
            </form>
          </div>

          <div className="checkout-summary-section">
            <div className="cart-summary">
              <h3>Order Total</h3>
              <div className="summary-row">
                <span>Items Subtotal ({cartItems.length})</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span>₹5.00</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
