import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  if (!state || !state.deliveryAddress) {
    navigate('/cart');
    return null;
  }

  const { deliveryDate, pickupDate, deliveryAddress, cartAmount } = state;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !name) {
      toast.error('Please fill in all payment details');
      return;
    }

    setProcessing(true);

    // Simulate payment gateway delay
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/rentals/create`,
          { deliveryDate, pickupDate, deliveryAddress },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('🎉 Payment successful! Order placed.');
        navigate('/profile');
      } catch (err) {
        toast.error('Payment failed. Please try again.');
        setProcessing(false);
      }
    }, 2000);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', background: 'var(--gray-50)' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>💳</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Secure Checkout</h2>
          <p style={{ color: 'var(--gray-500)' }}>Complete your rental order</p>
        </div>

        <div style={{ background: 'var(--primary-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>Total Amount</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹{cartAmount?.toLocaleString()}</span>
        </div>

        <form onSubmit={handlePayment}>
          <div className="form-group">
            <label>Name on Card</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          
          <div className="form-group">
            <label>Card Number</label>
            <input 
              type="text" 
              value={cardNumber} 
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').substring(0,16);
                setCardNumber(val.replace(/(.{4})/g, '$1 ').trim());
              }} 
              placeholder="0000 0000 0000 0000" 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label>Expiry Date</label>
              <input 
                type="text" 
                value={expiry} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').substring(0,4);
                  if (val.length > 2) {
                    setExpiry(`${val.substring(0,2)}/${val.substring(2,4)}`);
                  } else {
                    setExpiry(val);
                  }
                }} 
                placeholder="MM/YY" 
                required 
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input 
                type="password" 
                value={cvv} 
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').substring(0,3))} 
                placeholder="123" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', padding: '1.25rem', marginTop: 'var(--space-2)' }}
            disabled={processing}
          >
            {processing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span> Processing...
              </span>
            ) : (
              `Pay ₹${cartAmount?.toLocaleString()}`
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.8125rem', marginTop: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)' }}>
          🔒 Powered by RentEase SecurePay
        </p>
      </div>
    </div>
  );
}
