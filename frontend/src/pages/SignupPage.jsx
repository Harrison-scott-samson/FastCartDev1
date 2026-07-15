import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Auth.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container animate-fade">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join FASTCART today.</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <input type="text" placeholder="Full Name" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="College Email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
            <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="shopkeeper">Shopkeeper</option>
            </select>
            <button type="submit" className="btn-primary auth-btn">Sign Up</button>
          </form>
          <p className="auth-switcher">
            Already have an account? <Link to="/login" className="accent-link">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
