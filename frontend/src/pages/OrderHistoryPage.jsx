import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import './OrderHistory.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock size={20} className="status-pending" />;
      case 'Preparing': return <Package size={20} className="status-preparing" />;
      case 'Ready': return <CheckCircle size={20} className="status-ready" />;
      case 'Completed': return <CheckCircle size={20} className="status-completed" />;
      default: return <Clock size={20} />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="history-container animate-fade">
        <h2>My Orders</h2>
        
        {loading && orders.length === 0 ? (
          <div className="loader">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} style={{ color: '#ccc', marginBottom: '16px' }} />
            <h3>No orders yet</h3>
            <p>You haven't placed any orders.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Order #{order.id}</div>
                  <div className={`order-status badge-${order.status.toLowerCase()}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>
                <div className="order-body">
                  <div className="order-info">
                    <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Total:</strong> ₹{Number(order.total_price).toFixed(2)}</p>
                    <p><strong>Payment:</strong> {order.payment_method === 'online' ? 'Paid Online' : 'Cash on Pickup'}</p>
                  </div>
                  <div className="order-tokens">
                    <div className="token-display">
                      <span className="label">Token</span>
                      <span className="value">{order.token}</span>
                    </div>
                    <div className="token-display ml">
                      <span className="label">OTP</span>
                      <span className="value otp">{order.otp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistoryPage;
