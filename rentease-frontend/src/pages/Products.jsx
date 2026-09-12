import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    let url = `${API_URL}/products`;
    const params = [];
    if (selectedCategory !== 'all') params.push(`category=${selectedCategory}`);
    if (searchQuery) params.push(`search=${searchQuery}`);
    if (params.length) url += '?' + params.join('&');
    
    axios.get(url)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setWishlistIds(new Set(res.data.map(item => item._id))))
        .catch(() => {});
    }
  }, []);

  const handleWishlistToggle = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/wishlist/toggle`, { productId }, { headers: { Authorization: `Bearer ${token}` } });
      setWishlistIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
          toast.success('Removed from wishlist');
        } else {
          newSet.add(productId);
          toast.success('Added to wishlist');
        }
        return newSet;
      });
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ padding: 'var(--space-8) 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Our Collection</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>Browse {products.length} premium products available for rent</p>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '0.75rem 1.25rem', border: '2px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', fontSize: '0.9375rem', minWidth: '280px', outline: 'none' }}
            />
            {['all', 'furniture', 'appliances'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-full)',
                  border: `2px solid ${selectedCategory === cat ? 'var(--primary-600)' : 'var(--gray-200)'}`,
                  background: selectedCategory === cat ? 'var(--primary-50)' : '#fff',
                  color: selectedCategory === cat ? 'var(--primary-700)' : 'var(--gray-600)',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem', transition: 'all 0.2s'
                }}
              >
                {cat === 'all' ? 'All Products' : cat === 'furniture' ? '🪑 Furniture' : '📺 Appliances'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-500)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⏳</div>
            Loading products...
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <Link to={`/products/${product._id}`} key={product._id} className="product-card"
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div className="product-image" style={{ height: '240px' }}>
                  <button 
                    onClick={(e) => handleWishlistToggle(e, product._id)}
                    style={{
                      position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', zIndex: 10,
                      background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                      width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: 'var(--shadow-md)', color: wishlistIds.has(product._id) ? 'var(--danger)' : 'var(--gray-400)', fontSize: '1.25rem'
                    }}
                  >
                    {wishlistIds.has(product._id) ? '❤️' : '🤍'}
                  </button>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
                  ) : (
                    <span style={{ fontSize: '5.5rem', position: 'relative', zIndex: 1 }}>{product.category === 'furniture' ? '🛋️' : '📺'}</span>
                  )}
                  {product.available && (
                    <span className="product-badge" style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>In Stock</span>
                  )}
                </div>
                <div className="product-info" style={{ padding: 'var(--space-5)' }}>
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name" style={{ fontSize: '1.25rem', margin: 'var(--space-2) 0' }}>{product.name}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: 'var(--space-3)' }}>{product.subcategory}</p>
                  <div className="product-price">
                    ₹{product.monthlyRent.toLocaleString()}<span>/month</span>
                  </div>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.8125rem', marginTop: 'var(--space-1)' }}>
                    Deposit: ₹{product.securityDeposit.toLocaleString()}
                  </p>
                  <div className="product-footer">
                    <div className="product-rating">
                      <span>⭐</span> {product.rating} ({product.reviews})
                    </div>
                    <span style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.9375rem' }}>Rent Now →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-500)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📭</div>
            <h3>No products found</h3>
            <p>Try a different category or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}