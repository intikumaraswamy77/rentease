import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
        onLogin(data.user, data.token);
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
        setError(data.message || 'Login failed');
      }
    } catch (err) { 
      toast.error('Network error. Please try again.');
      setError('Network error. Please try again.'); 
    }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: 'var(--space-6)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: '950px', width: '100%', background: 'var(--gray-100)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
        {/* Left Side - Branding */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)', padding: 'var(--space-12)', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '3rem' }}>🏠</span> RentEase
          </div>
          <p style={{ opacity: 0.9, fontSize: '1.25rem', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
            Welcome back! Sign in to manage your rentals and browse our latest collection.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {['Free delivery on all orders', '24/7 maintenance support', 'Flexible rental plans'].map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', opacity: 0.95, fontSize: '1.0625rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✓</span> {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{ padding: 'var(--space-12)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Sign In</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-8)' }}>Enter your credentials to continue</p>
          
          {error && <div style={{ background: 'var(--danger-light)', color: '#991b1b', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', fontSize: '0.9375rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ paddingLeft: 'var(--space-4)' }} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingLeft: 'var(--space-4)' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', padding: '1.125rem', marginTop: 'var(--space-4)' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--gray-500)', fontSize: '1rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--gray-400)', background: 'var(--gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
            Demo admin: <strong>admin@rentease.com</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}