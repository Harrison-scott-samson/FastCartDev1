import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container animate-fade">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Login to FASTCART to skip the queue.</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <input type="email" placeholder="Email Address" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="btn-primary auth-btn">Login</button>
          </form>
          <p className="auth-switcher">
            Don't have an account? <Link to="/signup" className="accent-link">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
