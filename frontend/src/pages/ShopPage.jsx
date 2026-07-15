import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const categories = ['All', 'Snacks', 'Stationery', 'Essentials', 'Drinks'];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/products';
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const { data } = await axios.get(url);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="shop-container animate-fade">
        <div className="shop-header">
          <h2>Campus Shop</h2>
          <div className="shop-controls">
            <input 
              type="text" 
              placeholder="Search items..." 
              className="input-field search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="category-chips">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`chip ${activeCategory === cat ? 'chip-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products found.</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ShopPage;
