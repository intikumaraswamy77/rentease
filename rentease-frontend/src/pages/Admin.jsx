import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';
import Spinner from '../components/Spinner';

export default function Admin({ user }) {
  const [stats, setStats] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'furniture', subcategory: '', description: '', image: '',
    monthlyRent: 0, securityDeposit: 0, stock: 10, available: true
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [s, r, p, u] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/rentals`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(s.data); setRentals(r.data); setProducts(p.data); setUsers(u.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // --- RENTALS ---
  const updateRentalStatus = async (rentalId, status) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/admin/rentals/${rentalId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    toast.success('Rental status updated');
    fetchData();
  };

  // --- MAINTENANCE ---
  const updateMaintenanceStatus = async (rentalId, requestId, status) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/admin/rentals/${rentalId}/maintenance/${requestId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    toast.success('Maintenance status updated');
    fetchData();
  };

  // --- USERS ---
  const updateUserRole = async (userId, role) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/admin/users/${userId}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } });
    toast.success('User role updated');
    fetchData();
  };

  // --- PRODUCTS ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/admin/products/${editingProduct._id}`, productForm, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Product updated');
      } else {
        await axios.post(`${API_URL}/admin/products`, productForm, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Product added');
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'furniture', subcategory: '', description: '', image: '', monthlyRent: 0, securityDeposit: 0, stock: 10, available: true });
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductModal(true);
  };

  if (loading) return <Spinner />;

  // Extract all maintenance requests from rentals
  const maintenanceRequests = rentals.flatMap(r => 
    (r.maintenanceRequests || []).map(req => ({ ...req, rentalId: r._id, user: r.user, items: r.items }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#3b82f6' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: '📦', color: '#8b5cf6' },
    { label: 'Total Rentals', value: stats?.totalRentals || 0, icon: '📋', color: '#10b981' },
    { label: 'Active Rentals', value: stats?.activeRentals || 0, icon: '🏠', color: '#f59e0b' },
    { label: 'Pending Orders', value: stats?.pendingRentals || 0, icon: '⏳', color: '#ef4444' },
    { label: 'Monthly Revenue', value: `₹${(stats?.monthlyRevenue || 0).toLocaleString()}`, icon: '💰', color: '#06b6d4' }
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-10) 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Admin Dashboard</h1>
        <span style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700, boxShadow: '0 4px 12px rgb(239 68 68 / 0.3)' }}>ADMIN</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', borderBottom: '2px solid var(--gray-200)', paddingBottom: 0, overflowX: 'auto' }}>
        {[
          { key: 'stats', label: 'Overview', icon: '📊' },
          { key: 'rentals', label: 'Rentals', count: rentals.length },
          { key: 'products', label: 'Products', count: products.length },
          { key: 'users', label: 'Users', count: users.length },
          { key: 'maintenance', label: 'Maintenance', count: maintenanceRequests.filter(r => r.status === 'open').length }
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap',
              border: 'none', borderBottom: tab.key === activeTab ? '3px solid var(--primary-600)' : '3px solid transparent',
              background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
              color: tab.key === activeTab ? 'var(--primary-700)' : 'var(--gray-500)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)', transition: 'all 0.2s'
            }}>
            <span>{tab.icon}</span> {tab.label}
            {tab.count !== undefined && <span style={{ background: tab.key === 'maintenance' && tab.count > 0 ? 'var(--danger)' : 'var(--gray-100)', color: tab.key === 'maintenance' && tab.count > 0 ? '#fff' : 'inherit', padding: '0.125rem 0.625rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600 }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
          {statCards.map((stat, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-6)' }}>
              <div style={{ width: '64px', height: '64px', background: `${stat.color}15`, borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: `0 4px 12px ${stat.color}20` }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500, marginTop: 'var(--space-1)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rentals Tab */}
      {activeTab === 'rentals' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead><tr><th>ID</th><th>User</th><th>Items</th><th>Delivery</th><th>Amount</th><th>Status</th><th>Update Status</th></tr></thead>
              <tbody>
                {rentals.map(rental => (
                  <tr key={rental._id}>
                    <td><code style={{ background: 'var(--gray-100)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>#{rental._id.slice(-6)}</code></td>
                    <td>{rental.user?.name || 'N/A'}</td>
                    <td>{rental.items.length}</td>
                    <td>{new Date(rental.deliveryDate).toLocaleDateString()}</td>
                    <td>₹{rental.totalAmount.toLocaleString()}</td>
                    <td><span className={`badge ${rental.status === 'active' ? 'badge-success' : rental.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{rental.status}</span></td>
                    <td>
                      <select value={rental.status} onChange={e => updateRentalStatus(rental._id, e.target.value)} style={{ padding: '0.375rem', borderRadius: '4px', border: '1px solid var(--gray-300)' }}>
                        {['pending', 'confirmed', 'delivered', 'active', 'returned', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray-200)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Inventory Management</h2>
            <button className="btn btn-primary btn-sm" onClick={openAddProduct}>+ Add Product</button>
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Rent/mo</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ width: '40px', height: '40px', background: 'var(--gray-100)', borderRadius: '8px', overflow: 'hidden' }}>
                        {p.image ? <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                      </div>
                    </td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category}</td>
                    <td>₹{p.monthlyRent.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td><span className={`badge ${p.available ? 'badge-success' : 'badge-danger'}`}>{p.available ? 'Available' : 'Out of Stock'}</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditProduct(p)} style={{ marginRight: '0.5rem' }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Change Role</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select value={u.role} onChange={e => updateUserRole(u._id, e.target.value)} disabled={u._id === user.id} style={{ padding: '0.375rem', borderRadius: '4px', border: '1px solid var(--gray-300)' }}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {maintenanceRequests.length === 0 ? (
            <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--gray-500)' }}>No maintenance requests</div>
          ) : (
            <div className="table-container">
              <table>
                <thead><tr><th>Date</th><th>User</th><th>Rental ID</th><th>Issue Description</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {maintenanceRequests.map(req => (
                    <tr key={req._id}>
                      <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td>{req.user?.name}</td>
                      <td><code style={{ background: 'var(--gray-100)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>#{req.rentalId.slice(-6)}</code></td>
                      <td style={{ maxWidth: '300px' }}>{req.description}</td>
                      <td><span className={`badge ${req.status === 'open' ? 'badge-danger' : req.status === 'in_progress' ? 'badge-warning' : 'badge-success'}`}>{req.status.replace('_', ' ')}</span></td>
                      <td>
                        <select value={req.status} onChange={e => updateMaintenanceStatus(req.rentalId, req._id, e.target.value)} style={{ padding: '0.375rem', borderRadius: '4px', border: '1px solid var(--gray-300)' }}>
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-4)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleProductSubmit} style={{ padding: 'var(--space-6)' }}>
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}>
                    <option value="furniture">Furniture</option>
                    <option value="appliances">Appliances</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subcategory *</label>
                  <input type="text" value={productForm.subcategory} onChange={e => setProductForm({...productForm, subcategory: e.target.value})} placeholder="e.g. Sofa, Bed, Fridge" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label>Monthly Rent (₹) *</label>
                  <input type="number" value={productForm.monthlyRent} onChange={e => setProductForm({...productForm, monthlyRent: Number(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Deposit (₹) *</label>
                  <input type="number" value={productForm.securityDeposit} onChange={e => setProductForm({...productForm, securityDeposit: Number(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL (Optional - e.g. Unsplash URL)</label>
                <input type="url" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input type="checkbox" checked={productForm.available} onChange={e => setProductForm({...productForm, available: e.target.checked})} id="available" />
                <label htmlFor="available" style={{ margin: 0 }}>Available for Rent</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}