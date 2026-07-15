import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  // Products state
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Snacks', price: '', stock: '', image: '' });

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(() => {
      if (activeTab === 'orders') fetchOrdersOnly();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [activeTab]);

  const fetchOrdersOnly = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const { data } = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'orders') {
        const [ordersRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/orders', { headers }),
          axios.get('http://localhost:5000/api/admin/stats', { headers })
        ]);
        setOrders(ordersRes.data);
        setStats(statsRes.data);
      } else {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const headers = { Authorization: `Bearer ${token}` };
      
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image
      };

      if (currentProduct) {
        await axios.put(`http://localhost:5000/api/products/${currentProduct.id}`, payload, { headers });
      } else {
        await axios.post('http://localhost:5000/api/products', payload, { headers });
      }
      
      setShowProductForm(false);
      setCurrentProduct(null);
      setFormData({ name: '', category: 'Snacks', price: '', stock: '', image: '' });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to save product');
    }
  };

  const editProduct = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image || ''
    });
    setShowProductForm(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container animate-fade">
        <div className="admin-header-flex">
          <h2>Shopkeeper Dashboard</h2>
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Order Management
            </button>
            <button 
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Product Inventory
            </button>
          </div>
        </div>
        
        {activeTab === 'orders' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <div className="stat-value">{stats.orders}</div>
              </div>
              <div className="stat-card">
                <h3>Total Products</h3>
                <div className="stat-value">{stats.products}</div>
              </div>
              <div className="stat-card">
                <h3>Registered Students</h3>
                <div className="stat-value">{stats.users}</div>
              </div>
            </div>

            <h3>Recent Orders</h3>
            {loading && orders.length === 0 ? (
              <div className="loader">Loading orders...</div>
            ) : (
              <div className="admin-orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Student</th>
                      <th>Token</th>
                      <th>OTP</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className={order.status === 'Pending' ? 'highlight-row' : ''}>
                        <td>#{order.id}</td>
                        <td>{order.user_name}</td>
                        <td><strong>{order.token}</strong></td>
                        <td className="admin-otp">{order.otp}</td>
                        <td>₹{Number(order.total_price).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge badge-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={order.status} 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="status-select"
                            disabled={order.status === 'Completed'}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No orders received yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="tab-content">
            <div className="products-actions">
              <h3>Inventory Management</h3>
              <button 
                className="btn-primary"
                onClick={() => {
                  setCurrentProduct(null);
                  setFormData({ name: '', category: 'Snacks', price: '', stock: '', image: '' });
                  setShowProductForm(true);
                }}
              >
                <Plus size={18} /> Add New Product
              </button>
            </div>

            {showProductForm && (
              <div className="product-form-modal">
                <div className="product-form-content">
                  <div className="form-header">
                    <h3>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={() => setShowProductForm(false)} className="close-btn"><X/></button>
                  </div>
                  <form onSubmit={handleProductSubmit}>
                    <input type="text" placeholder="Product Name" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Snacks">Snacks</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Essentials">Essentials</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                    <input type="number" placeholder="Price (₹)" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    <input type="number" placeholder="Stock Quantity" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                    <input type="text" placeholder="Image URL (Optional)" className="input-field" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '10px'}}>Save Product</button>
                  </form>
                </div>
              </div>
            )}

            <div className="admin-orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        {product.image && <img src={product.image} alt="" style={{width:'40px', height:'40px', borderRadius:'8px', objectFit:'cover'}} />}
                        <strong>{product.name}</strong>
                      </td>
                      <td>{product.category}</td>
                      <td>₹{Number(product.price).toFixed(2)}</td>
                      <td>
                        <span style={{color: product.stock < 10 ? 'red' : 'inherit', fontWeight: product.stock < 10 ? 'bold' : 'normal'}}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="action-cells">
                        <button onClick={() => editProduct(product)} className="icon-btn edit-btn" title="Edit"><Edit2 size={18}/></button>
                        <button onClick={() => deleteProduct(product.id)} className="icon-btn delete-btn" title="Delete"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
