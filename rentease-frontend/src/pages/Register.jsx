import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: { street: '', city: '', state: '', zipCode: '', country: 'India' } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { 
      toast.error('Passwords do not match');
      setError('Passwords do not match'); 
      return; 
    }
    if (formData.password.length < 6) { 
      toast.error('Password must be at least 6 characters');
      setError('Password must be at least 6 characters'); 
      return; 
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, address: formData.address })
      });
      const data = await res.json();
      if (res.ok) { 
        toast.success('Account created successfully!');
        onRegister(data.user, data.token); 
        navigate('/'); 
      }
      else { 
        toast.error(data.message || 'Registration failed');
        setError(data.message || 'Registration failed'); 
      }
    } catch (err) { 
      toast.error('Network error');
      setError('Network error'); 
    }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: 'var(--space-6)' }}>
      <div style={{ maxWidth: '520px', width: '100%', background: 'var(--gray-100)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🏠</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--gray-500)' }}>Join RentEase and start renting today</p>
        </div>

        {error && <div style={{ background: 'var(--danger-light)', color: '#991b1b', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-5)', fontSize: '0.9375rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required /></div>
          <div className="form-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required /></div>
          <div className="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required /></div>
          <div className="form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" /></div>

          <div style={{ background: 'var(--gray-50)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-5)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--gray-700)' }}>📍 Delivery Address</h4>
            <div className="form-group"><label>Street</label><input type="text" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="House no, Street name" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group"><label>City</label><input type="text" name="address.city" value={formData.address.city} onChange={handleChange} /></div>
              <div className="form-group"><label>State</label><input type="text" name="address.state" value={formData.address.state} onChange={handleChange} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group"><label>ZIP Code</label><input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} /></div>
              <div className="form-group"><label>Country</label><input type="text" name="address.country" value={formData.address.country} onChange={handleChange} /></div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', padding: '1.125rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--gray-500)', fontSize: '1rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}