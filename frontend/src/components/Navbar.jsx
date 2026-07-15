import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <span className="brand-text">FAST<span className="accent">CART</span></span>
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/shop" className="nav-link">Shop</Link>
        
        {user ? (
          <>
            <Link to="/history" className="nav-link"><Package size={20}/> Orders</Link>
            {user.role === 'shopkeeper' && (
              <Link to="/admin" className="nav-link">Dashboard</Link>
            )}
            <Link to="/cart" className="cart-link">
              <ShoppingCart size={24} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
