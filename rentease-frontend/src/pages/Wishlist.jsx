import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';
import Spinner from '../components/Spinner';

export default function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data);
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/wishlist/toggle`, { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Removed from wishlist');
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>My Wishlist</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-8)' }}>
        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
      </p>

      {wishlist.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>❤️</div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>Save items you love so you don't lose sight of them.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Explore Products</button>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(product => (
            <Link to={`/products/${product._id}`} key={product._id} className="product-card"
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              style={{ position: 'relative' }}
            >
              <button 
                onClick={(e) => removeFromWishlist(e, product._id)}
                style={{
                  position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', zIndex: 10,
                  background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: 'var(--shadow-md)', color: 'var(--danger)', fontSize: '1.25rem'
                }}
                title="Remove from wishlist"
              >
                ❤️
              </button>
              
              <div className="product-image" style={{ height: '200px' }}>
                <span style={{ fontSize: '5rem', position: 'relative', zIndex: 1 }}>{product.category === 'furniture' ? '🛋️' : '📺'}</span>
              </div>
              <div className="product-info" style={{ padding: 'var(--space-5)' }}>
                <div className="product-category">{product.category}</div>
                <h3 className="product-name" style={{ fontSize: '1.125rem', margin: 'var(--space-2) 0' }}>{product.name}</h3>
                <div className="product-price">
                  ₹{product.monthlyRent.toLocaleString()}<span>/month</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
