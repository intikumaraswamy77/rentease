import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import { API_URL } from './config';
import { Toaster, toast } from 'react-hot-toast';
import Spinner from './components/Spinner';
import { useTheme } from './context/ThemeContext';



function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          setCartCount(res.data.items ? res.data.items.length : 0);
        }).catch(() => {});
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
    navigate('/');
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/');
  };

  const handleBecomeVendor = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/auth/become-vendor`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success('🎉 You are now a Vendor! You can start listing items.');
    } catch (err) {
      toast.error('Failed to upgrade account');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Spinner size="4rem" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gray-50)' }}>
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: 'var(--gray-800)', color: 'var(--gray-50)' } }} />
      {/* Header */}
      <header style={{
        background: 'var(--gray-50)',
        borderBottom: '1px solid var(--gray-200)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>🏠</div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>RentEase</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '-2px' }}>Premium Rentals</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', padding: '0.5rem', marginRight: '1rem' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/" style={{
              color: location.pathname === '/' ? 'var(--primary-600)' : 'var(--gray-600)',
              fontWeight: location.pathname === '/' ? 700 : 500,
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}>Home</Link>
            
            <Link to="/products" style={{
              color: location.pathname.includes('/products') ? 'var(--primary-600)' : 'var(--gray-600)',
              fontWeight: location.pathname.includes('/products') ? 700 : 500,
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}>Products</Link>
            
            {user && (user.role === 'vendor' || user.role === 'admin') ? (
              <Link to="/add-product" style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>+ List an Item</Link>
            ) : user && user.role === 'user' ? (
              <button onClick={handleBecomeVendor} style={{
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                border: 'none',
                color: '#fff',
                fontWeight: 600,
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}>Become a Vendor</button>
            ) : null}

            {user ? (
              <>
                <Link to="/wishlist" style={{
                  color: location.pathname === '/wishlist' ? 'var(--primary-600)' : 'var(--gray-600)',
                  fontWeight: location.pathname === '/wishlist' ? 700 : 500,
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}>Wishlist</Link>
                <Link to="/cart" style={{
                  position: 'relative',
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 500
                }}>
                  Cart
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '4px',
                      background: 'var(--danger)',
                      color: '#fff',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>{cartCount}</span>
                  )}
                </Link>
                
                <Link to="/profile" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    border: '2px solid var(--gray-50)',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                  }}>{user.name.charAt(0).toUpperCase()}</div>
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                
                {user.role === 'admin' && (
                  <Link to="/admin" style={{
                    background: 'linear-gradient(135deg, var(--danger), #dc2626)',
                    color: '#fff',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    marginLeft: '0.5rem'
                  }}>Admin</Link>
                )}
                
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'var(--gray-100)',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: 'var(--gray-700)',
                    fontSize: '0.875rem',
                    marginLeft: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 500
                }}>Login</Link>
                <Link to="/register" style={{
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                  color: '#fff',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  marginLeft: '0.5rem'
                }}>Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist user={user} />} />
          <Route path="/add-product" element={<AddProduct user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/admin" element={<Admin user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--gray-900)', color: 'var(--gray-50)', padding: '3rem 0 1.5rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>🏠 RentEase</h3>
              <p style={{ color: 'var(--gray-400)', lineHeight: 1.7 }}>Affordable furniture & appliance rentals for students and professionals across India.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gray-200)' }}>Quick Links</h4>
              <a href="/products" style={{ display: 'block', color: 'var(--gray-400)', textDecoration: 'none', marginBottom: '0.5rem' }}>Browse Products</a>
              <a href="/register" style={{ display: 'block', color: 'var(--gray-400)', textDecoration: 'none', marginBottom: '0.5rem' }}>Create Account</a>
              <a href="/login" style={{ display: 'block', color: 'var(--gray-400)', textDecoration: 'none' }}>Sign In</a>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gray-200)' }}>Categories</h4>
              <a href="/products?category=furniture" style={{ display: 'block', color: 'var(--gray-400)', textDecoration: 'none', marginBottom: '0.5rem' }}>Furniture</a>
              <a href="/products?category=appliances" style={{ display: 'block', color: 'var(--gray-400)', textDecoration: 'none' }}>Appliances</a>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gray-200)' }}>Support</h4>
              <a href="#" style={{ display: 'block', color: 'var(--gray-400)', textDecoration: 'none', marginBottom: '0.5rem' }}>Help Center</a>
              <a href="#" style={{ display: 'block', color: 'var(--gray-400)', textDecoration: 'none' }}>Contact Us</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            <p>© 2024 RentEase. All rights reserved. Made with ❤️ for students and professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;