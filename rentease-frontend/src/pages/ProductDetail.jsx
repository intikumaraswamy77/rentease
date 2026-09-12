import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';
import Spinner from '../components/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [tenure, setTenure] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
      
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setIsWishlisted(res.data.some(item => item._id === id)))
        .catch(() => {});
    }
  }, [id]);

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }
    try {
      await axios.post(`${API_URL}/wishlist/toggle`, { productId: id }, { headers: { Authorization: `Bearer ${token}` } });
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await axios.post(
        `${API_URL}/cart/add`,
        { productId: id, quantity, selectedTenure: tenure },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Added to cart!');
      window.location.href = '/cart';
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      console.error(err); 
    }
    finally { setAdding(false); }
  };

  if (!product) return <Spinner />;

  const totalCost = product.monthlyRent * tenure * quantity + product.securityDeposit * quantity;

  return (
    <div className="container" style={{ padding: 'var(--space-10) 0' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 'var(--space-6)', color: 'var(--gray-500)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <a href="/" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>Home</a>
        <span style={{ color: 'var(--gray-400)' }}>›</span>
        <a href="/products" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>Products</a>
        <span style={{ color: 'var(--gray-400)' }}>›</span>
        <span style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
        {/* Image Section */}
        <div>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--gray-200)', overflow: 'hidden', marginBottom: 'var(--space-4)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ height: '480px', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12rem', position: 'relative' }}>
              <button 
                onClick={handleWishlistToggle}
                style={{
                  position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', zIndex: 10,
                  background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                  width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: 'var(--shadow-md)', color: isWishlisted ? 'var(--danger)' : 'var(--gray-400)', fontSize: '1.5rem'
                }}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
              ) : (
                <span style={{ fontSize: '12rem', position: 'relative', zIndex: 1 }}>{product.category === 'furniture' ? '🛋️' : '📺'}</span>
              )}
              {product.available && (
                <span style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)', background: 'var(--success)', color: '#fff', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700, boxShadow: '0 4px 12px rgb(16 185 129 / 0.3)' }}>
                  ✓ In Stock
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: '100px', height: '80px', background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: i === 1 ? '2px solid var(--primary-500)' : '2px solid transparent' }}></div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div>
          <div style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'inline-block', padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
            {product.category}
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 var(--space-2)', color: 'var(--gray-900)', lineHeight: 1.2 }}>{product.name}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem', marginBottom: 'var(--space-5)' }}>{product.subcategory}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.375rem' }}>⭐</span>
              <strong style={{ fontSize: '1.25rem' }}>{product.rating}</strong>
              <span style={{ color: 'var(--gray-400)', fontSize: '0.9375rem' }}>({product.reviews} reviews)</span>
            </div>
            <span className={`badge ${product.available ? 'badge-success' : 'badge-danger'}`}>
              {product.available ? '✓ Available' : '✗ Out of Stock'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-6)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Monthly Rent</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1 }}>
              ₹{product.monthlyRent.toLocaleString()}
              <span style={{ fontSize: '1.125rem', color: 'var(--gray-500)', fontWeight: 400, marginLeft: 'var(--space-2)' }}>/month</span>
            </div>
            <p style={{ color: 'var(--gray-500)', marginTop: 'var(--space-2)', fontSize: '0.9375rem' }}>
              Security Deposit: ₹{product.securityDeposit.toLocaleString()} (fully refundable)
            </p>
          </div>

          {/* Tenure Selection */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--gray-700)' }}>Select Rental Duration</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {product.rentalTenureOptions.map(t => (
                <button
                  key={t}
                  onClick={() => setTenure(t)}
                  style={{
                    flex: 1, padding: 'var(--space-4) var(--space-3)',
                    border: tenure === t ? '2px solid var(--primary-600)' : '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-lg)', background: tenure === t ? 'var(--primary-50)' : '#fff',
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    color: tenure === t ? 'var(--primary-700)' : 'var(--gray-600)'
                  }}
                >
                  <div style={{ fontSize: '1.375rem' }}>{t}</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--gray-400)' }}>months</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--gray-700)' }}>Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '48px', height: '48px', border: '2px solid var(--gray-300)', borderRadius: 'var(--radius-lg)', background: '#fff', cursor: 'pointer', fontSize: '1.375rem', fontWeight: 600, color: 'var(--gray-600)' }}>−</button>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, minWidth: '60px', textAlign: 'center', color: 'var(--gray-900)' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                style={{ width: '48px', height: '48px', border: '2px solid var(--gray-300)', borderRadius: 'var(--radius-lg)', background: '#fff', cursor: 'pointer', fontSize: '1.375rem', fontWeight: 600, color: 'var(--gray-600)' }}>+</button>
            </div>
          </div>

          {/* Cost Summary */}
          <div style={{ background: 'var(--gray-50)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
              <span>Monthly Rent × {tenure} months × {quantity}</span>
              <span>₹{(product.monthlyRent * quantity * tenure).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
              <span>Security Deposit</span>
              <span>₹{(product.securityDeposit * quantity).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.5rem', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '2px solid var(--gray-200)', color: 'var(--primary-700)' }}>
              <span>Total Amount</span>
              <span>₹{totalCost.toLocaleString()}</span>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', marginBottom: 'var(--space-4)' }} onClick={handleAddToCart} disabled={adding}>
            {adding ? 'Adding to Cart...' : '🛒 Add to Cart'}
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--gray-500)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--gray-200)' }}>
            <span>🚚 Free Delivery</span>
            <span>🔧 Maintenance Included</span>
            <span>🔄 Easy Return</span>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div style={{ marginTop: 'var(--space-12)' }}>
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-5)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', borderBottom: '2px solid var(--gray-100)' }}>
                <span style={{ color: 'var(--gray-500)', textTransform: 'capitalize', fontSize: '0.9375rem' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <strong style={{ color: 'var(--gray-800)', fontSize: '0.9375rem' }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}