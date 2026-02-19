import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://noory-backend.onrender.com';

// ... [Keep all the PRODUCT_IMAGES, CATEGORY_DEFAULTS, and CATEGORIES exactly as they are in your file]

const PRODUCT_IMAGES = {
  // [COPY ALL YOUR PRODUCT_IMAGES HERE - the entire object from your file]
};

const CATEGORY_DEFAULTS = {
  // [COPY ALL YOUR CATEGORY_DEFAULTS HERE]
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
  { id: 'vegetables', label: '🥦 Vegetables' },
  { id: 'fruits', label: '🍎 Fruits' },
  { id: 'meat', label: '🥩 Meat' },
  { id: 'poultry', label: '🍗 Poultry' },
  { id: 'fish', label: '🐟 Fish' },
  { id: 'dairy', label: '🥛 Dairy' },
  { id: 'beverages', label: '🥤 Drinks' },
  { id: 'snacks', label: '🍿 Snacks' },
  { id: 'bakery', label: '🍞 Bakery' },
  { id: 'flour', label: '🌾 Flour' },
  { id: 'grains', label: '🌾 Grains' },
  { id: 'spices', label: '🌶️ Spices' },
  { id: 'cooking_oil', label: '🫙 Oils' },
  { id: 'household', label: '🧹 Household' },
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
        showToast(`✅ ${product.name} added!`);
      }
    } catch (e) {
      showToast('❌ Failed to add');
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="shop-container">

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🛍️</span>
            <div className="logo-text">
              <h1>NOORY <span>SHOP</span></h1>
              <p>FRESH GROCERIES 🇰🇪</p>
            </div>
          </div>

          {/* Search - Full width on mobile */}
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Actions */}
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">Hi, {user?.name?.split(' ')[0]} 👋</span>
                {user?.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="btn btn-admin">⚙️ Admin</button>
                )}
                {user?.role === 'driver' && (
                  <button onClick={() => navigate('/driver-dashboard')} className="btn btn-driver">🏍️ Driver</button>
                )}
                <button onClick={() => navigate('/cart')} className="btn btn-cart">
                  🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
                <button onClick={logout} className="btn btn-outline">Out</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/working')} className="btn btn-outline">Login</button>
                <button onClick={() => navigate('/register')} className="btn btn-primary">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Fresh Groceries Delivered 🛵</h2>
          <p>500+ products • Fast delivery • M-Pesa</p>
          <div className="hero-badges">
            <span className="badge badge-red">📦 Same Day</span>
            <span className="badge badge-green">💚 M-Pesa</span>
            <span className="badge badge-white" onClick={() => navigate('/contact')}>💬 Contact</span>
            <span className="badge badge-blue" onClick={() => navigate('/driver-apply')}>🏍️ Be a Driver</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="categories">
        <div className="categories-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`category-btn ${category === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <main className="main-content">
        <div className="products-header">
          <h3>
            {CATEGORIES.find(c => c.id === category)?.label || '🏪 All'}
            <span className="count">({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-icon">⏳</div>
            <p>Loading fresh products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <p>No products found</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    onError={e => {
                      e.target.src = CATEGORY_DEFAULTS[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop';
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="stock-overlay">
                      <span className="stock-badge out">OUT OF STOCK</span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="stock-badge low">Only {product.stock} left!</div>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-price-row">
                    <span className="product-price">KES {product.price}</span>
                    <span className="product-stock">{product.stock > 0 ? `${product.stock} left` : 'Sold out'}</span>
                  </div>
                  <button
                    disabled={product.stock === 0 || addingId === product.id}
                    onClick={() => addToCart(product)}
                    className={`add-to-cart ${product.stock === 0 ? 'disabled' : ''} ${addingId === product.id ? 'loading' : ''}`}
                  >
                    {addingId === product.id ? '⏳ Adding...' : product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🛍️ NOORY SHOP</h3>
            <p>Kenya's freshest groceries delivered to your door.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <p onClick={() => navigate('/cart')}>🛒 Cart</p>
            <p onClick={() => navigate('/contact')}>💬 Contact</p>
            <p onClick={() => navigate('/driver-apply')}>🏍️ Be a Driver</p>
            <p onClick={() => navigate('/register')}>📝 Register</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 0716 613 176</p>
            <p>✉️ shopnoory@gmail.com</p>
            <p>📍 Nairobi, Kenya</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 Noory Shop • Made with ❤️ in Kenya 🇰🇪
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .shop-container {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: 'Segoe UI', -apple-system, sans-serif;
        }

        /* TOAST */
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          background: #1a1a2e;
          color: #fff;
          padding: 14px 20px;
          borderRadius: 12px;
          fontWeight: 700;
          fontSize: 15px;
          boxShadow: 0 8px 24px rgba(0,0,0,0.3);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(400px); }
          to { transform: translateX(0); }
        }

        /* HEADER */
        .header {
          background: #1a1a2e;
          padding: 12px 16px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .logo-icon {
          font-size: 24px;
        }

        .logo-text h1 {
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .logo-text h1 span {
          color: #e94560;
        }

        .logo-text p {
          font-size: 8px;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .search-wrapper {
          width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px;
          border-radius: 50px;
          border: 2px solid #0f3460;
          background: #16213e;
          color: #fff;
          fontSize: 14px;
          outline: none;
          font-family: inherit;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
        }

        .user-greeting {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          display: none;
        }

        .btn {
          border: none;
          padding: 8px 12px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 700;
          font-size: 11px;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .btn-admin { background: #e94560; color: #fff; }
        .btn-driver { background: #22c55e; color: #fff; }
        .btn-cart { background: #0f3460; color: #fff; position: relative; }
        .btn-outline { background: transparent; color: #64748b; border: 1px solid #0f3460; }
        .btn-primary { background: #e94560; color: #fff; }

        .cart-badge {
          background: #e94560;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          margin-left: 4px;
        }

        /* HERO */
        .hero {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 28px 16px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&fit=crop") center/cover;
          opacity: 0.08;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-content h2 {
          font-size: 24px;
          font-weight: 900;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }

        .hero-content p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0 0 14px;
        }

        .hero-badges {
          display: flex;
          gap: 6px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .badge-red { background: rgba(233,69,96,0.15); border: 1px solid rgba(233,69,96,0.4); color: #e94560; }
        .badge-green { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #22c55e; }
        .badge-white { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; }
        .badge-blue { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.4); color: #60a5fa; }

        /* CATEGORIES */
        .categories {
          background: #fff;
          border-bottom: 2px solid #f0f0f0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .categories::-webkit-scrollbar {
          display: none;
        }

        .categories-scroll {
          display: flex;
          gap: 6px;
          padding: 10px 16px;
          min-width: max-content;
        }

        .category-btn {
          padding: 8px 14px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          background: #f8f9fa;
          color: #555;
          font-weight: 700;
          font-size: 12px;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .category-btn.active {
          background: #e94560;
          color: #fff;
        }

        /* MAIN CONTENT */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        .products-header {
          margin-bottom: 16px;
        }

        .products-header h3 {
          font-size: 16px;
          font-weight: 900;
          color: #1a1a2e;
        }

        .count {
          font-size: 12px;
          color: #888;
          font-weight: 600;
          margin-left: 6px;
        }

        .loading, .empty {
          text-align: center;
          padding: 60px 20px;
          color: #888;
        }

        .loading-icon, .empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .loading p, .empty p {
          font-weight: 700;
          font-size: 16px;
        }

        /* PRODUCTS GRID */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }

        .product-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
          transition: all 0.2s;
        }

        .product-card:active {
          transform: scale(0.98);
        }

        .product-image {
          height: 140px;
          overflow: hidden;
          background: #f8f9fa;
          position: relative;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .stock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stock-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 10px;
        }

        .stock-badge.out {
          background: #e94560;
          color: #fff;
        }

        .stock-badge.low {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #f59e0b;
          color: #fff;
        }

        .product-info {
          padding: 10px;
        }

        .product-category {
          font-size: 9px;
          color: #e94560;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 4px;
          letter-spacing: 0.5px;
        }

        .product-name {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
          line-height: 1.3;
          min-height: 34px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .product-price {
          font-size: 16px;
          font-weight: 900;
          color: #e94560;
        }

        .product-stock {
          font-size: 10px;
          color: #aaa;
          font-weight: 600;
        }

        .add-to-cart {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          background: #e94560;
          color: #fff;
        }

        .add-to-cart.disabled {
          background: #f0f0f0;
          color: #aaa;
          cursor: not-allowed;
        }

        .add-to-cart.loading {
          background: #ccc;
          cursor: not-allowed;
        }

        .add-to-cart:active:not(.disabled):not(.loading) {
          transform: scale(0.95);
        }

        /* FOOTER */
        .footer {
          background: #1a1a2e;
          padding: 32px 16px;
          margin-top: 40px;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .footer-section h3 {
          color: #fff;
          font-weight: 900;
          font-size: 16px;
          margin: 0 0 8px;
        }

        .footer-section h4 {
          color: #fff;
          font-weight: 800;
          margin: 0 0 8px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer-section p {
          color: #64748b;
          font-size: 12px;
          margin: 0 0 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .footer-section p:hover {
          color: #e94560;
        }

        .footer-bottom {
          border-top: 1px solid #0f3460;
          padding-top: 16px;
          text-align: center;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
        }

        /* DESKTOP STYLES */
        @media (min-width: 768px) {
          .header-content {
            grid-template-columns: auto 1fr auto;
          }

          .user-greeting {
            display: block;
          }

          .logo-text h1 {
            font-size: 20px;
          }

          .logo-text p {
            font-size: 9px;
          }

          .search-input {
            max-width: 500px;
          }

          .btn {
            padding: 8px 14px;
            font-size: 12px;
          }

          .hero-content h2 {
            font-size: 32px;
          }

          .hero-content p {
            font-size: 15px;
          }

          .badge {
            font-size: 12px;
            padding: 6px 14px;
          }

          .category-btn {
            font-size: 13px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
          }

          .product-image {
            height: 160px;
          }

          .product-name {
            font-size: 14px;
          }

          .add-to-cart {
            font-size: 13px;
          }

          .footer-content {
            grid-template-columns: repeat(3, 1fr);
          }

          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 28px rgba(0,0,0,0.12);
          }
        }

        /* TABLET */
        @media (min-width: 480px) and (max-width: 767px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-content {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: #e94560;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}