import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://noory-backend.onrender.com';

const PRODUCT_IMAGES = {
  'sukuma': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&fit=crop',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
  'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&fit=crop',
  'tomato': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&fit=crop',
  'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&fit=crop',
  'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&fit=crop',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&fit=crop',
  'green pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&fit=crop',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&fit=crop',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&fit=crop',
  'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&fit=crop',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&fit=crop',
  'watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e7851b2?w=400&fit=crop',
  'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&fit=crop',
  'steak': 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&fit=crop',
  'chicken': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  'fish': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  'bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&fit=crop',
  'rice': 'https://images.unsplash.com/photo-1536304993881-ff86e0c9c4f4?w=400&fit=crop',
};

const CATEGORY_DEFAULTS = {
  vegetables: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&fit=crop',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&fit=crop',
  meat: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&fit=crop',
  poultry: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  fish: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  beverages: 'https://images.unsplash.com/photo-1534353473418-4cfa0c2e3e5e?w=400&fit=crop',
  snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop',
  bakery: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&fit=crop',
};

const getProductImage = (product) => {
  if (product.image_url && product.image_url.startsWith('http')) return product.image_url;
  const nameLower = product.name.toLowerCase();
  for (const [keyword, url] of Object.entries(PRODUCT_IMAGES)) {
    if (nameLower.includes(keyword)) return url;
  }
  return CATEGORY_DEFAULTS[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop';
};

const CATEGORIES = [
  { id: 'all', label: '🏪 All' },
  { id: 'vegetables', label: '🥦 Veg' },
  { id: 'fruits', label: '🍎 Fruits' },
  { id: 'meat', label: '🥩 Meat' },
  { id: 'poultry', label: '🍗 Poultry' },
  { id: 'fish', label: '🐟 Fish' },
  { id: 'dairy', label: '🥛 Dairy' },
  { id: 'beverages', label: '🥤 Drinks' },
  { id: 'snacks', label: '🍿 Snacks' },
  { id: 'bakery', label: '🍞 Bakery' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const url = category !== 'all' ? `${API}/api/products?category=${category}` : `${API}/api/products`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (isAuthenticated) fetchCartCount();
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setCartCount(data.count || 0);
    } catch (e) { /* ignore */ }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const addToCart = async (product) => {
    if (!isAuthenticated) { navigate('/working'); return; }
    try {
      setAddingId(product.id);
      const res = await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (res.ok) {
        setCartCount(prev => prev + 1);
        showToast(\`✅ \${product.name} added!\`);
      }
    } catch (e) {
      showToast('❌ Failed');
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: '#1a1a2e', color: '#fff', padding: '12px 18px',
          borderRadius: '12px', fontWeight: '700', fontSize: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: '#1a1a2e', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Top Row: Logo + Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
              <span style={{ fontSize: '24px' }}>🛍️</span>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0, lineHeight: 1 }}>
                  NOORY <span style={{ color: '#e94560' }}>SHOP</span>
                </h1>
                <p style={{ fontSize: '8px', color: '#64748b', margin: 0, fontWeight: '600', letterSpacing: '0.5px' }}>FRESH GROCERIES 🇰🇪</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <button onClick={() => navigate('/admin')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', fontFamily: 'inherit' }}>⚙️</button>
                  )}
                  {user?.role === 'driver' && (
                    <button onClick={() => navigate('/driver-dashboard')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', fontFamily: 'inherit' }}>🏍️</button>
                  )}
                  <button onClick={() => navigate('/cart')} style={{ background: '#0f3460', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', fontFamily: 'inherit', position: 'relative' }}>
                    🛒 {cartCount > 0 && <span style={{ background: '#e94560', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', marginLeft: '3px' }}>{cartCount}</span>}
                  </button>
                  <button onClick={logout} style={{ background: 'transparent', color: '#64748b', border: '1px solid #0f3460', padding: '6px 10px', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', fontFamily: 'inherit' }}>Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/working')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #0f3460', padding: '6px 12px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', fontFamily: 'inherit' }}>Login</button>
                  <button onClick={() => navigate('/register')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', fontFamily: 'inherit' }}>Sign Up</button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Row: Search (Full Width) */}
          <input type="text" placeholder="🔍 Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 16px', borderRadius: '50px', border: '2px solid #0f3460', background: '#16213e', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '24px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&fit=crop") center/cover', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Fresh Groceries Delivered 🛵</h2>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px' }}>500+ products • Fast delivery</p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.4)', color: '#e94560', padding: '5px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: '700' }}>📦 Same Day</span>
            <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', padding: '5px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: '700' }}>💚 M-Pesa</span>
            <span onClick={() => navigate('/contact')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '5px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>💬 Contact</span>
            <span onClick={() => navigate('/driver-apply')} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa', padding: '5px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>🏍️ Driver</span>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ background: '#fff', borderBottom: '2px solid #f0f0f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ display: 'flex', gap: '6px', padding: '10px 16px', minWidth: 'max-content' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              style={{ padding: '7px 12px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: category === cat.id ? '#e94560' : '#f8f9fa', color: category === cat.id ? '#fff' : '#555', fontWeight: '700', fontSize: '11px', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 }}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', marginBottom: '14px' }}>
          {CATEGORIES.find(c => c.id === category)?.label || '🏪 All'}
          <span style={{ fontSize: '12px', color: '#888', fontWeight: '600', marginLeft: '6px' }}>({filtered.length})</span>
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏳</div>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>No products</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {filtered.map(product => (
              <div key={product.id}
                style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', transition: 'all 0.2s' }}>
                <div style={{ height: '140px', overflow: 'hidden', background: '#f8f9fa', position: 'relative' }}>
                  <img src={getProductImage(product)} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = CATEGORY_DEFAULTS[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop'; }} />
                  {product.stock === 0 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ background: '#e94560', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontWeight: '800', fontSize: '10px' }}>OUT OF STOCK</span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#f59e0b', color: '#fff', padding: '3px 8px', borderRadius: '20px', fontSize: '9px', fontWeight: '800' }}>Only {product.stock}!</div>
                  )}
                </div>
                <div style={{ padding: '10px' }}>
                  <p style={{ fontSize: '9px', color: '#e94560', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.5px' }}>{product.category}</p>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px', lineHeight: '1.3', minHeight: '34px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#e94560' }}>KES {product.price}</span>
                    <span style={{ fontSize: '10px', color: '#aaa', fontWeight: '600' }}>{product.stock > 0 ? \`\${product.stock} left\` : 'Out'}</span>
                  </div>
                  <button
                    disabled={product.stock === 0 || addingId === product.id}
                    onClick={() => addToCart(product)}
                    style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', background: product.stock === 0 ? '#f0f0f0' : addingId === product.id ? '#ccc' : '#e94560', color: product.stock === 0 ? '#aaa' : '#fff' }}>
                    {addingId === product.id ? '⏳...' : product.stock === 0 ? '❌ Out' : '🛒 Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1a1a2e', padding: '28px 16px', marginTop: '32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', color: '#64748b', fontSize: '11px', fontWeight: '600' }}>
          <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#fff', fontWeight: '900' }}>🛍️ NOORY SHOP</p>
          <p style={{ margin: '0 0 8px' }}>📞 0716 613 176 • ✉️ shopnoory@gmail.com</p>
          <p style={{ margin: '0' }}>© 2025 Noory Shop • Made with ❤️ in Kenya 🇰🇪</p>
        </div>
      </div>

      <style>{\`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #e94560; border-radius: 3px; }
        @media (min-width: 768px) {
          .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
        }
      \`}</style>
    </div>
  );
}