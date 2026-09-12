import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';
import Spinner from '../components/Spinner';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCart(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCheckout = async () => {
    if (!deliveryDate || !pickupDate || !address.street || !address.city) {
      toast.error('Please fill in all delivery details');
      return;
    }
    navigate('/checkout', { state: { deliveryDate, pickupDate, deliveryAddress: address, cartAmount: cart.totalMonthlyRent + cart.totalSecurityDeposit } });
  };

  if (loading) return <Spinner />;
  if (!cart) return null;

  return (
    <div className="container" style={{ padding: 'var(--space-10) 0' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}>
        Shopping Cart <span style={{ color: 'var(--gray-400)', fontWeight: 400, fontSize: '1.125rem' }}>({cart.items.length} items)</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 'var(--space-8)' }}>
        {/* Cart Items */}
        <div>
          {cart.items.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🛒</div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>Start adding products to your cart</p>
              <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
            </div>
          ) : (
            cart.items.map((item, i) => (
              <div key={i} className="cart-item" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="cart-item-image" style={{ width: '120px', height: '120px', fontSize: '3rem', borderRadius: 'var(--radius-xl)' }}>
                  {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} /> : '📦'}
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: 'var(--space-1)' }}>{item.name}</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem' }}>Monthly: ₹{item.monthlyRent.toLocaleString()} × {item.quantity} × {item.selectedTenure} months</p>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 'var(--space-1)' }}>Deposit: ₹{item.securityDeposit.toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                      ₹{(item.monthlyRent * item.quantity * item.selectedTenure).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Delivery Form */}
          {cart.items.length > 0 && (
            <div className="card" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-5)' }}>📦 Delivery Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group"><label>Delivery Date *</label><input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
                <div className="form-group"><label>Pickup Date *</label><input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={deliveryDate} /></div>
              </div>
              <div className="form-group"><label>Street Address *</label><input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="House No, Street Name, Area" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group"><label>City *</label><input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="City" /></div>
                <div className="form-group"><label>State</label><input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group"><label>ZIP Code</label><input type="text" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} /></div>
                <div className="form-group"><label>Country</label><input type="text" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} /></div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: 'var(--space-5)' }}>Order Summary</h3>
            {cart.items.length > 0 ? (
              <>
                <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 'var(--space-4)' }}>
                  {cart.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', fontSize: '0.9375rem' }}>
                      <span style={{ color: 'var(--gray-600)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                      <span style={{ fontWeight: 500 }}>₹{(item.monthlyRent * item.quantity * item.selectedTenure).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '2px solid var(--gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.9375rem' }}>
                    <span>Subtotal</span><span>₹{cart.totalMonthlyRent.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.9375rem' }}>
                    <span>Delivery</span><span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.9375rem' }}>
                    <span>Security Deposit</span><span>₹{cart.totalSecurityDeposit.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.5rem', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--gray-200)', color: 'var(--primary-700)' }}>
                    <span>Total</span>
                    <span>₹{(cart.totalMonthlyRent + cart.totalSecurityDeposit).toLocaleString()}</span>
                  </div>
                </div>
                <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-6)', padding: '1.125rem' }} onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: 'var(--space-3)' }}>
                  🔒 Secure checkout • Free cancellation within 24h
                </p>
              </>
            ) : (
              <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: 'var(--space-6) 0' }}>Add items to see summary</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}