import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';
import Spinner from '../components/Spinner';

export default function Profile({ user }) {
  const [rentals, setRentals] = useState([]);
  const [listings, setListings] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rentals');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const token = localStorage.getItem('token');
    
    const reqs = [
      axios.get(`${API_URL}/rentals`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/products/me/listings`, { headers: { Authorization: `Bearer ${token}` } })
    ];

    if (user.role === 'vendor' || user.role === 'admin') {
      reqs.push(axios.get(`${API_URL}/vendor/orders`, { headers: { Authorization: `Bearer ${token}` } }));
    }

    Promise.all(reqs)
    .then(responses => {
      setRentals(responses[0].data);
      setListings(responses[1].data);
      if (responses[2]) setVendorOrders(responses[2].data);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setListings(prev => prev.filter(p => p._id !== id));
      toast.success('Listing removed successfully');
    } catch (err) {
      toast.error('Failed to remove listing');
    }
  };

  const handleVendorMaintenanceUpdate = async (rentalId, requestId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/vendor/rentals/${rentalId}/maintenance/${requestId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Maintenance status updated');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) { toast.error('Failed to update status'); }
  };

  const handleMaintenanceRequest = async (rentalId, description) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/rentals/${rentalId}/maintenance`, { description }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('✅ Maintenance request submitted! Our team will contact you within 24 hours.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) { toast.error('Failed to submit request'); }
  };

  const activeRentalsCount = rentals.filter(r => ['pending', 'confirmed', 'delivered', 'active', 'maintenance'].includes(r.status)).length;
  const totalSpent = rentals.reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      
      {/* Cover Banner */}
      <div style={{
        height: '200px',
        borderRadius: 'var(--radius-2xl)',
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 50%, var(--primary-200) 100%)',
        marginBottom: '-60px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'
      }}>
        <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)' }}>
          <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', backdropFilter: 'blur(10px)' }}>
            ✏️ Edit Cover
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-8)', padding: '0 var(--space-6)' }}>
        
        {/* Sidebar */}
        <div>
          <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center', marginBottom: 'var(--space-6)', backdropFilter: 'blur(10px)', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', position: 'relative', zIndex: 10 }}>
            <div style={{ 
              width: '120px', height: '120px', 
              background: '#fff', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '3rem', color: 'var(--primary-600)', 
              margin: '0 auto var(--space-4)', fontWeight: 800, 
              border: '6px solid var(--gray-50)', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)' 
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 style={{ marginBottom: 'var(--space-1)', fontSize: '1.5rem', fontWeight: 800 }}>{user?.name || 'User'}</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', marginBottom: 'var(--space-3)' }}>{user?.email || ''}</p>
            <span style={{ 
              background: user?.role === 'admin' ? 'var(--danger-light)' : 'var(--primary-100)', 
              color: user?.role === 'admin' ? 'var(--danger)' : 'var(--primary-700)', 
              padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)', 
              fontSize: '0.8125rem', fontWeight: 700 
            }}>
              {user?.role === 'admin' ? '👑 Administrator' : '🌟 Premium Member'}
            </span>
          </div>

          <div className="card" style={{ padding: 'var(--space-4)' }}>
            {[
              { id: 'rentals', icon: '📋', label: 'My Rentals' },
              { id: 'listings', icon: '🏷️', label: 'My Listings', reqRole: ['vendor', 'admin'] },
              { id: 'vendor_orders', icon: '📦', label: 'Vendor Orders', reqRole: ['vendor', 'admin'] },
              { id: 'settings', icon: '👤', label: 'Account Settings' },
              { id: 'addresses', icon: '📍', label: 'Saved Addresses' },
              { id: 'payments', icon: '💳', label: 'Payment Methods' }
            ].filter(item => !item.reqRole || item.reqRole.includes(user?.role)).map((item) => (
              <div 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                style={{ 
                  padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', 
                  background: activeTab === item.id ? 'var(--primary-50)' : 'transparent', 
                  color: activeTab === item.id ? 'var(--primary-700)' : 'var(--gray-600)', 
                  fontWeight: activeTab === item.id ? 700 : 500, 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', 
                  marginBottom: 'var(--space-2)', fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  border: activeTab === item.id ? '1px solid var(--primary-100)' : '1px solid transparent'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ paddingTop: '80px' }}>
          
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderLeft: '4px solid var(--primary-500)' }}>
              <div style={{ fontSize: '2.5rem' }}>📦</div>
              <div>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: 600 }}>Active Rentals</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeRentalsCount}</div>
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderLeft: '4px solid var(--success)' }}>
              <div style={{ fontSize: '2.5rem' }}>₹</div>
              <div>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: 600 }}>Total Spent</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalSpent.toLocaleString()}</div>
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderLeft: '4px solid var(--warning)' }}>
              <div style={{ fontSize: '2.5rem' }}>⭐</div>
              <div>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: 600 }}>Reward Points</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalSpent > 0 ? Math.floor(totalSpent / 100) : 0}</div>
              </div>
            </div>
          </div>

          {/* Dynamic Tabs Content */}
          {activeTab === 'rentals' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>My Rentals</h2>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse More</button>
              </div>

              {rentals.length === 0 ? (
                <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🛋️</div>
                  <h3 style={{ marginBottom: 'var(--space-2)' }}>No rentals yet</h3>
                  <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>Explore our premium collection and start renting today.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/products')}>Explore Products</button>
                </div>
              ) : (
                rentals.map(rental => (
                  <div key={rental._id} className="card" style={{ marginBottom: 'var(--space-6)', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--gray-100)', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 800, marginRight: 'var(--space-4)' }}>Order #{rental._id.slice(-6).toUpperCase()}</span>
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Placed on {new Date(rental.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>Total: ₹{rental.totalAmount.toLocaleString()} / mo</div>
                    </div>
                    
                    <div style={{ padding: 'var(--space-6)' }}>
                      {/* Visual Timeline Tracker */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginBottom: 'var(--space-8)', padding: '0 var(--space-8)' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 'var(--space-8)', right: 'var(--space-8)', height: '4px', background: 'var(--gray-200)', zIndex: 1, transform: 'translateY(-50%)', borderRadius: '2px' }}></div>
                        
                        {/* Dynamic Progress Bar */}
                        <div style={{ 
                          position: 'absolute', top: '50%', left: 'var(--space-8)', 
                          height: '4px', background: 'var(--primary-500)', zIndex: 2, 
                          transform: 'translateY(-50%)', borderRadius: '2px', transition: 'width 0.5s ease',
                          width: rental.status === 'pending' ? '0%' : 
                                 rental.status === 'confirmed' ? '33%' : 
                                 rental.status === 'delivered' ? '66%' : 
                                 rental.status === 'active' || rental.status === 'maintenance' ? '100%' : '0%'
                        }}></div>

                        {['Pending', 'Confirmed', 'Delivered', 'Active'].map((step, idx) => {
                          const isActive = ['pending', 'confirmed', 'delivered', 'active'].indexOf(rental.status) >= idx;
                          return (
                            <div key={step} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ 
                                width: '24px', height: '24px', borderRadius: '50%', 
                                background: isActive ? 'var(--primary-500)' : 'var(--gray-200)',
                                border: '4px solid var(--gray-50)',
                                boxShadow: isActive ? '0 0 0 4px var(--primary-100)' : 'none'
                              }}></div>
                              <span style={{ position: 'absolute', top: '32px', fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--gray-800)' : 'var(--gray-400)' }}>{step}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Items */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-10)' }}>
                        {rental.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-3)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ width: '64px', height: '64px', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', overflow: 'hidden' }}>
                              {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '2px' }}>{item.name}</div>
                              <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>Qty: {item.quantity} • {item.selectedTenure} Months</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                        <button className="btn btn-secondary">View Invoice</button>
                        {rental.status === 'active' && (
                          <button className="btn btn-primary" onClick={() => { const d = prompt('Please describe the issue:'); if (d) handleMaintenanceRequest(rental._id, d); }}>
                            🔧 Request Maintenance
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'listings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>My Listings</h2>
                <button className="btn btn-primary" onClick={() => navigate('/add-product')}>+ Add New Item</button>
              </div>
              
              {listings.length === 0 ? (
                <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📦</div>
                  <h3 style={{ marginBottom: 'var(--space-2)' }}>No active listings</h3>
                  <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>Turn your unused items into monthly income.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/add-product')}>List an Item Now</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
                  {listings.map(item => (
                    <div key={item._id} className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '200px', background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>📸</div>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{item.name}</h3>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
                        {item.category} • {item.subcategory}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>₹{item.monthlyRent}/mo</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Stock: {item.stock}</div>
                        </div>
                        <button className="btn" style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', padding: '0.5rem 1rem' }} onClick={() => handleDeleteListing(item._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'vendor_orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Vendor Orders</h2>
              </div>
              
              {vendorOrders.length === 0 ? (
                <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🛍️</div>
                  <h3 style={{ marginBottom: 'var(--space-2)' }}>No orders yet</h3>
                  <p style={{ color: 'var(--gray-500)' }}>When customers rent your products, the orders will appear here.</p>
                </div>
              ) : (
                vendorOrders.map(order => (
                  <div key={order._id} className="card" style={{ marginBottom: 'var(--space-6)', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--gray-100)', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 800, marginRight: 'var(--space-4)' }}>Order #{order._id.slice(-6).toUpperCase()}</span>
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Customer: {order.user?.name} ({order.user?.email})</span>
                      </div>
                      <div style={{ fontWeight: 800, color: 'var(--primary-700)', display: 'flex', gap: 'var(--space-4)' }}>
                        <span style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-100)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>Status: {order.status.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div style={{ padding: 'var(--space-6)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-3)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden' }}>
                              {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '2px' }}>{item.name}</div>
                              <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>Qty: {item.quantity} • {item.selectedTenure} Months</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.maintenanceRequests?.length > 0 && (
                        <div style={{ background: 'var(--warning-light)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-4)' }}>
                          <h4 style={{ color: 'var(--warning-dark)', marginBottom: 'var(--space-3)' }}>🔧 Maintenance Requests</h4>
                          {order.maintenanceRequests.map(req => (
                            <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: '#fff', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)' }}>
                              <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{req.description}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{new Date(req.createdAt).toLocaleDateString()}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', background: req.status === 'resolved' ? 'var(--success-light)' : 'var(--gray-100)', color: req.status === 'resolved' ? 'var(--success-dark)' : 'var(--gray-700)' }}>
                                  {req.status.toUpperCase()}
                                </span>
                                {req.status !== 'resolved' && (
                                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleVendorMaintenanceUpdate(order._id, req._id, 'resolved')}>
                                    Mark Resolved
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card" style={{ padding: 'var(--space-8)' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-6)' }}>Account Settings</h2>
              <form>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue={user?.name} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={user?.email} className="form-control" disabled />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" defaultValue={user?.phone || ''} placeholder="+91 98765 43210" className="form-control" />
                  </div>
                </div>
                <button type="button" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => toast.success('Profile updated successfully!')}>Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="card" style={{ padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Saved Addresses</h2>
                <button className="btn btn-secondary">+ Add New Address</button>
              </div>
              <div style={{ border: '2px dashed var(--gray-300)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--gray-500)' }}>
                No addresses saved yet. Add one to speed up your checkout.
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card" style={{ padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Payment Methods</h2>
                <button className="btn btn-secondary">+ Add Card</button>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', alignItems: 'center' }}>
                <div style={{ fontSize: '2rem' }}>💳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>•••• •••• •••• 4242</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Expires 12/24</div>
                </div>
                <span className="badge badge-success">Default</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}