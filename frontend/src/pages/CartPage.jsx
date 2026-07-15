import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Cart.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Navbar />
      <div className="cart-container animate-fade">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <span className="cart-count">{cartItems.length} items</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items yet.</p>
            <Link to="/shop" className="btn-primary" style={{ marginTop: '20px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.product_id} className="cart-item">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="item-placeholder">{item.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">₹{Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}><Minus size={16}/></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock}><Plus size={16}/></button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.product_id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span>₹5.00</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{(getCartTotal() + 5).toFixed(2)}</span>
              </div>
              <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
