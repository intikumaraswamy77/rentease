import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';

export default function AddProduct({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'furniture',
    subcategory: '',
    description: '',
    image: '',
    monthlyRent: '',
    securityDeposit: '',
    stock: 1
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/products/list`, {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: Number(formData.securityDeposit),
        stock: Number(formData.stock)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Product listed successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to list product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', maxWidth: '800px' }}>
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>List Your Item for Rent</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-8)' }}>
          Turn your unused furniture and appliances into monthly income.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Modern Wooden Dining Table" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="furniture">Furniture</option>
                <option value="appliances">Appliances</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subcategory</label>
              <input type="text" name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g., Table, Bed, Fridge" required />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the condition, age, and features of your item..." rows="4" required></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label>Monthly Rent (₹)</label>
              <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Security Deposit (₹)</label>
              <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Stock Available</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="1" />
            </div>
          </div>

          <div style={{ background: 'var(--primary-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
            <h4 style={{ color: 'var(--primary-700)', marginBottom: 'var(--space-2)' }}>💡 Pro Tip for Lenders</h4>
            <p style={{ color: 'var(--primary-600)', fontSize: '0.9375rem', margin: 0 }}>
              Ensure your item is thoroughly cleaned before pickup. We'll handle the delivery and assembly for the renter!
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Listing Item...' : 'List Item Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
