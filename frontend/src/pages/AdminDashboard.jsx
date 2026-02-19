import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://noory-backend.onrender.com';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total_orders: 0, total_customers: 0, total_drivers: 0, total_revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [companyEarnings, setCompanyEarnings] = useState({});
  const [searchProduct, setSearchProduct] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '', category: '', description: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  // Add product modal
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', price: '', stock: '', category: 'vegetables', description: '', image_url: '' });
  const [adding, setAdding] = useState(false);

  // Approve driver modal
  const [approveModal, setApproveModal] = useState(false);
  const [approveApp, setApproveApp] = useState(null);
  const [driverPassword, setDriverPassword] = useState('');
  const [approving, setApproving] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const categories = ['vegetables', 'fruits', 'meat', 'poultry', 'fish', 'dairy', 'beverages', 'snacks', 'bakery', 'flour', 'grains', 'spices', 'cooking_oil', 'household'];

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [dashRes, prodRes, drvRes, appRes, fbRes, earnRes] = await Promise.all([
        fetch(`${API}/api/admin/dashboard`, { headers }),
        fetch(`${API}/api/products`),
        fetch(`${API}/api/admin/drivers`, { headers }),
        fetch(`${API}/api/admin/driver-applications`, { headers }),
        fetch(`${API}/api/admin/feedback`, { headers }),
        fetch(`${API}/api/admin/company-earnings`, { headers }),
      ]);
      const [dash, prod, drv, app, fb, earn] = await Promise.all([
        dashRes.json(), prodRes.json(), drvRes.json(), appRes.json(), fbRes.json(), earnRes.json()
      ]);
      if (dash.stats) setStats(dash.stats);
      if (dash.recent_orders) setRecentOrders(dash.recent_orders);
      setProducts(prod.products || []);
      setDrivers(drv.drivers || []);
      setApplications(app.applications || []);
      setFeedback(fb.feedback || []);
      setCompanyEarnings(earn || {});
    } catch (e) { console.error(e); }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({ name: product.name || '', price: product.price || '', stock: product.stock || '', category: product.category || 'vegetables', description: product.description || '', image_url: product.image_url || '' });
    setEditModal(true);
  };

  const saveEdit = async () => {
    if (!editForm.name || !editForm.price || !editForm.stock) { alert('❌ Name, price and stock required!'); return; }
    try {
      setSaving(true);
      const res = await fetch(`${API}/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editForm.name, price: parseFloat(editForm.price), stock: parseInt(editForm.stock), category: editForm.category, description: editForm.description, image_url: editForm.image_url }),
      });
      if (res.ok) { alert('✅ Product updated!'); setEditModal(false); fetchAll(); }
      else { const d = await res.json(); alert('❌ ' + (d.error || 'Failed')); }
    } catch (e) { alert('❌ Network error'); } finally { setSaving(false); }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { alert('✅ Deleted!'); fetchAll(); } else alert('❌ Failed');
    } catch (e) { alert('❌ Network error'); }
  };

  const saveAdd = async () => {
    if (!addForm.name || !addForm.price || !addForm.stock) { alert('❌ Fill all required fields!'); return; }
    try {
      setAdding(true);
      const res = await fetch(`${API}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: addForm.name, price: parseFloat(addForm.price), stock: parseInt(addForm.stock), category: addForm.category, description: addForm.description, image_url: addForm.image_url }),
      });
      if (res.ok) { alert('✅ Product added!'); setAddModal(false); setAddForm({ name: '', price: '', stock: '', category: 'vegetables', description: '', image_url: '' }); fetchAll(); }
      else { const d = await res.json(); alert('❌ ' + (d.error || 'Failed')); }
    } catch (e) { alert('❌ Network error'); } finally { setAdding(false); }
  };

  const approveDriver = async () => {
    if (!driverPassword || driverPassword.length < 6) { alert('❌ Password must be at least 6 characters'); return; }
    if (!driverPassword.startsWith('Driver-')) { alert('❌ Password must start with "Driver-"'); return; }
    try {
      setApproving(true);
      const res = await fetch(`${API}/api/admin/approve-driver/${approveApp.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: driverPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Driver approved!\n\nDriver ID: ${data.driver_identity}\nPassword: ${driverPassword}\n\nShare these credentials with the driver.`);
        setApproveModal(false); setDriverPassword(''); fetchAll();
      } else alert('❌ ' + (data.error || 'Failed'));
    } catch (e) { alert('❌ Network error'); } finally { setApproving(false); }
  };

  const rejectDriver = async (id) => {
    if (!window.confirm('Reject this application?')) return;
    try {
      await fetch(`${API}/api/admin/reject-driver/${id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      alert('Application rejected'); fetchAll();
    } catch (e) { alert('❌ Error'); }
  };

  const removeDriver = async (id, name) => {
    if (!window.confirm(`Remove driver "${name}" completely from the system?`)) return;
    try {
      const res = await fetch(`${API}/api/admin/remove-driver/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { alert('✅ Driver removed'); fetchAll(); } else alert('❌ Failed');
    } catch (e) { alert('❌ Error'); }
  };

  const filteredProducts = products.filter(p => {
    const ms = p.name.toLowerCase().includes(searchProduct.toLowerCase());
    const mc = filterCategory === 'all' || p.category === filterCategory;
    return ms && mc;
  });

  const pendingApps = applications.filter(a => a.status === 'pending');

  // Shared styles
  const inp = { width: '100%', padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#f8f9fa' };
  const lbl = { display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' };
  const btn = (color, text = '#fff') => ({ background: color, color: text, border: 'none', padding: '9px 18px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s' });
  const card = { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px', border: '1px solid #f0f0f0' };
  const modal = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', backdropFilter: 'blur(4px)' };
  const modalBox = { background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' };

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'orders', icon: '🛒', label: 'Orders' },
    { id: 'applications', icon: '🏍️', label: 'Driver Apps', badge: pendingApps.length },
    { id: 'drivers', icon: '👥', label: 'Drivers' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'feedback', icon: '💬', label: 'Feedback' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif", display: 'flex' }}>

      {/* SIDEBAR */}
      <div style={{ width: '220px', background: '#1a1a2e', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #0f3460' }}>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>🛍️ <span style={{ color: '#e94560' }}>NOORY</span></div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: '600', letterSpacing: '1px' }}>ADMIN PANEL</div>
        </div>
        <div style={{ flex: 1, paddingTop: '8px' }}>
          {navItems.map(item => (
            <div key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 20px', cursor: 'pointer', background: activeTab === item.id ? '#e94560' : 'transparent', color: activeTab === item.id ? '#fff' : '#94a3b8', fontWeight: activeTab === item.id ? '700' : '500', fontSize: '14px', borderLeft: activeTab === item.id ? '4px solid #ff6b6b' : '4px solid transparent', transition: 'all 0.2s', position: 'relative' }}
              onMouseEnter={e => { if (activeTab !== item.id) { e.currentTarget.style.background = '#0f3460'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (activeTab !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
              {item.badge > 0 && <span style={{ position: 'absolute', right: '12px', background: '#f59e0b', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>{item.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #0f3460', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => navigate('/')} style={{ ...btn('transparent', '#94a3b8'), border: '1px solid #0f3460', width: '100%' }}>🏠 View Shop</button>
          <button onClick={logout} style={{ ...btn('#e94560'), width: '100%' }}>Logout</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: '220px', flex: 1 }}>
        {/* TOPBAR */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>
              {navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <p style={{ color: '#888', fontSize: '12px', margin: '2px 0 0', fontWeight: '600' }}>Noory Shop Admin</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {activeTab === 'products' && <button onClick={() => setAddModal(true)} style={btn('#e94560')}>+ Add Product</button>}
            <div style={{ background: '#f8f9fa', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', color: '#555' }}>👨‍💼 Admin</div>
          </div>
        </div>

        <div style={{ padding: '28px' }}>

          {/* ======= DASHBOARD ======= */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Orders', value: stats.total_orders, icon: '🛒', color: '#3b82f6' },
                  { label: 'Customers', value: stats.total_customers, icon: '👥', color: '#22c55e' },
                  { label: 'Active Drivers', value: stats.total_drivers, icon: '🏍️', color: '#f59e0b' },
                  { label: 'Revenue', value: `KES ${(stats.total_revenue || 0).toLocaleString()}`, icon: '💰', color: '#e94560' },
                  { label: 'Products', value: products.length, icon: '📦', color: '#8b5cf6' },
                  { label: 'Pending Apps', value: pendingApps.length, icon: '📋', color: '#f97316' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                    <p style={{ color: '#888', fontSize: '11px', fontWeight: '700', margin: '0 0 4px', textTransform: 'uppercase' }}>{s.label}</p>
                    <p style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 16px' }}>⚡ Quick Actions</h3>
                  {[
                    { label: '➕ Add New Product', color: '#e94560', action: () => { setActiveTab('products'); setAddModal(true); } },
                    { label: '🏍️ Review Driver Apps', color: '#f59e0b', action: () => setActiveTab('applications') },
                    { label: '💰 View Earnings', color: '#22c55e', action: () => setActiveTab('earnings') },
                    { label: '💬 View Feedback', color: '#3b82f6', action: () => setActiveTab('feedback') },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action} style={{ ...btn(a.color), width: '100%', marginBottom: '8px', textAlign: 'left', padding: '12px 16px', borderRadius: '10px', display: 'block' }}>{a.label}</button>
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 16px' }}>📊 Company At A Glance</h3>
                  {[
                    { label: 'Total Revenue', value: `KES ${(companyEarnings.total_revenue || 0).toLocaleString()}`, color: '#22c55e' },
                    { label: 'From Deliveries', value: `KES ${(companyEarnings.company_from_delivery || 0).toLocaleString()}`, color: '#3b82f6' },
                    { label: 'Paid to Drivers', value: `KES ${(companyEarnings.driver_payouts || 0).toLocaleString()}`, color: '#f59e0b' },
                    { label: 'Total Deliveries', value: companyEarnings.total_orders || 0, color: '#e94560' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
                      <span style={{ color: '#555', fontSize: '13px', fontWeight: '600' }}>{s.label}</span>
                      <span style={{ color: s.color, fontWeight: '900', fontSize: '15px' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
{/* Danger Zone */}
<div style={{ ...styles.statsGrid, marginTop: '30px', borderTop: '3px solid #ef4444', paddingTop: '20px' }}>
  <h2 style={{ ...styles.sectionTitle, color: '#ef4444' }}>⚠️ Danger Zone</h2>
  <button
    onClick={async () => {
      if (!window.confirm('⚠️ DELETE ALL NON-ADMIN USERS?\n\nThis will delete:\n- All customer accounts\n- All driver accounts\n- All their orders\n- All their cart items\n\nAdmins will NOT be deleted.\n\nType DELETE in the next prompt to confirm.')) {
        return;
      }
      
      const confirm2 = window.prompt('Type DELETE to confirm:');
      if (confirm2 !== 'DELETE') {
        alert('Cancelled');
        return;
      }
      
      try {
        const res = await fetch('https://noory-backend.onrender.com/api/admin/cleanup-users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await res.json();
        
        if (data.success) {
          alert(`✅ SUCCESS!\n\nDeleted:\n- ${data.deleted_users} users\n- ${data.deleted_orders} orders\n- ${data.deleted_cart_items} cart items`);
          window.location.reload();
        } else {
          alert('❌ ERROR: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('❌ ERROR: ' + err.message);
      }
    }}
    style={{
      ...styles.actionButton,
      background: '#ef4444',
      fontSize: '14px',
      padding: '12px 20px'
    }}
  >
    🗑️ Delete All Non-Admin Users
  </button>
</div>
              {/* Recent Orders */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 16px' }}>🕒 Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
                    <p style={{ fontWeight: '700' }}>No orders yet</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                        {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.slice(0, 8).map(o => (
                        <tr key={o.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                          <td style={{ padding: '10px 12px', fontWeight: '800', color: '#e94560' }}>#{o.id}</td>
                          <td style={{ padding: '10px 12px', fontWeight: '600' }}>{o.user?.name || 'N/A'}</td>
                          <td style={{ padding: '10px 12px', fontWeight: '800' }}>KES {o.total_price}</td>
                          <td style={{ padding: '10px 12px' }}><span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{o.payment_method}</span></td>
                          <td style={{ padding: '10px 12px' }}><span style={{ background: '#f0f9ff', color: '#0284c7', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{o.payment_status}</span></td>
                          <td style={{ padding: '10px 12px', color: '#888', fontSize: '12px' }}>{new Date(o.created_at).toLocaleDateString('en-KE')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ======= PRODUCTS ======= */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="🔍 Search products..." value={searchProduct} onChange={e => setSearchProduct(e.target.value)}
                  style={{ ...inp, flex: 1, minWidth: '200px' }}
                  onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ background: '#fff', padding: '11px 16px', borderRadius: '10px', border: '2px solid #e2e8f0', fontWeight: '700', color: '#555', fontSize: '14px' }}>{filteredProducts.length} products</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                  >
                    <div style={{ height: '150px', overflow: 'hidden', background: '#f8f9fa', position: 'relative' }}>
                      <img src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop'} alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop'} />
                      {product.stock === 0 && <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#e94560', color: '#fff', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>OUT OF STOCK</div>}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <p style={{ fontSize: '10px', color: '#e94560', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 4px' }}>{product.category}</p>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 6px', lineHeight: '1.3', minHeight: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#e94560' }}>KES {product.price}</span>
                        <span style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>Stock: {product.stock}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(product)} style={{ flex: 1, background: '#1a1a2e', color: '#fff', border: 'none', padding: '9px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit' }}>✏️ Edit</button>
                        <button onClick={() => deleteProduct(product.id, product.name)} style={{ background: '#fff5f5', color: '#e94560', border: '2px solid #e94560', padding: '9px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======= ORDERS ======= */}
          {activeTab === 'orders' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>All Orders</h3>
              {recentOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                  <div style={{ fontSize: '50px', marginBottom: '12px' }}>📭</div>
                  <p style={{ fontWeight: '700', fontSize: '18px' }}>No orders yet</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        {['#', 'Customer', 'Location', 'Total', 'Delivery Fee', 'Payment', 'Driver', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(o => (
                        <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 14px', fontWeight: '800', color: '#e94560' }}>#{o.id}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '700' }}>{o.user?.name || 'N/A'}</td>
                          <td style={{ padding: '12px 14px', color: '#555', fontSize: '13px' }}>{o.delivery_location || 'N/A'}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '900' }}>KES {o.total_price}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '700', color: '#3b82f6' }}>KES {o.delivery_fee || 0}</td>
                          <td style={{ padding: '12px 14px' }}><span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{o.payment_method}</span></td>
                          <td style={{ padding: '12px 14px', color: '#888', fontSize: '13px' }}>{o.driver?.user?.name || '—'}</td>
                          <td style={{ padding: '12px 14px' }}><span style={{ background: '#f0f9ff', color: '#0284c7', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{o.driver_status || 'pending'}</span></td>
                          <td style={{ padding: '12px 14px', color: '#888', fontSize: '12px' }}>{new Date(o.created_at).toLocaleDateString('en-KE')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ======= DRIVER APPLICATIONS ======= */}
          {activeTab === 'applications' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                {['pending', 'approved', 'rejected'].map(status => (
                  <div key={status} style={{ background: '#fff', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', fontSize: '14px', color: status === 'pending' ? '#f59e0b' : status === 'approved' ? '#22c55e' : '#e94560', border: `2px solid ${status === 'pending' ? '#fcd34d' : status === 'approved' ? '#bbf7d0' : '#fecaca'}` }}>
                    {status === 'pending' ? '⏳' : status === 'approved' ? '✅' : '❌'} {applications.filter(a => a.status === status).length} {status}
                  </div>
                ))}
              </div>

              {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px' }}>
                  <div style={{ fontSize: '50px', marginBottom: '12px' }}>📋</div>
                  <p style={{ fontWeight: '700', color: '#555', fontSize: '18px' }}>No applications yet</p>
                </div>
              ) : applications.map(app => (
                <div key={app.id} style={{ ...card, borderLeft: `4px solid ${app.status === 'pending' ? '#f59e0b' : app.status === 'approved' ? '#22c55e' : '#e94560'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{app.full_name}</h3>
                        <span style={{ background: app.status === 'pending' ? '#fef3c7' : app.status === 'approved' ? '#dcfce7' : '#fff5f5', color: app.status === 'pending' ? '#92400e' : app.status === 'approved' ? '#16a34a' : '#e94560', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                          {app.status?.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        {[
                          { label: '📱 Phone', value: app.phone },
                          { label: '💚 M-Pesa', value: app.mpesa_phone },
                          { label: '🪪 ID Number', value: app.id_number },
                          { label: '🏍️ Vehicle', value: app.vehicle_type },
                          { label: '🔢 Reg No.', value: app.registration_number },
                          { label: '📧 Email', value: app.email || 'N/A' },
                        ].map((f, i) => (
                          <div key={i} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '8px 12px' }}>
                            <p style={{ color: '#888', fontSize: '11px', fontWeight: '700', margin: '0 0 2px' }}>{f.label}</p>
                            <p style={{ color: '#1a1a2e', fontWeight: '700', margin: 0, fontSize: '14px' }}>{f.value || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                      {app.why_suited && (
                        <div style={{ marginTop: '10px', background: '#f8f9fa', borderRadius: '8px', padding: '10px 12px' }}>
                          <p style={{ color: '#888', fontSize: '11px', fontWeight: '700', margin: '0 0 4px' }}>WHY SUITED</p>
                          <p style={{ color: '#555', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{app.why_suited}</p>
                        </div>
                      )}
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: '8px 0 0' }}>Applied: {new Date(app.created_at).toLocaleString('en-KE')}</p>
                    </div>
                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                        <button onClick={() => { setApproveApp(app); setApproveModal(true); }} style={{ ...btn('#22c55e'), padding: '12px 20px', fontSize: '14px' }}>✅ Approve</button>
                        <button onClick={() => rejectDriver(app.id)} style={{ ...btn('#e94560'), padding: '12px 20px', fontSize: '14px' }}>❌ Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======= DRIVERS ======= */}
          {activeTab === 'drivers' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>Active Drivers ({drivers.length})</h3>
              {drivers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px' }}>
                  <div style={{ fontSize: '50px', marginBottom: '12px' }}>🏍️</div>
                  <p style={{ fontWeight: '700', color: '#555', fontSize: '18px' }}>No active drivers yet</p>
                  <p style={{ color: '#888' }}>Approve driver applications to see them here</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {drivers.map(driver => (
                    <div key={driver.id} style={{ ...card, borderLeft: '4px solid #22c55e' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 4px' }}>{driver.user?.name}</h3>
                          <p style={{ color: '#888', fontSize: '12px', margin: 0, fontWeight: '600' }}>{driver.driver_identity}</p>
                        </div>
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>✅ ACTIVE</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                        {[
                          { label: '🏍️ Vehicle', value: driver.vehicle_type },
                          { label: '🔢 Reg', value: driver.registration_number },
                          { label: '📱 M-Pesa', value: driver.mpesa_phone },
                          { label: '📦 Deliveries', value: driver.total_deliveries || 0 },
                        ].map((f, i) => (
                          <div key={i} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '8px' }}>
                            <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 2px' }}>{f.label}</p>
                            <p style={{ color: '#1a1a2e', fontWeight: '700', margin: 0, fontSize: '13px' }}>{f.value || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                          <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 2px' }}>TOTAL EARNED</p>
                          <p style={{ color: '#22c55e', fontWeight: '900', margin: 0, fontSize: '14px' }}>KES {driver.total_earnings || 0}</p>
                        </div>
                        <div style={{ background: '#f0f9ff', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                          <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 2px' }}>AVAILABLE</p>
                          <p style={{ color: '#3b82f6', fontWeight: '900', margin: 0, fontSize: '14px' }}>KES {driver.pending_earnings || 0}</p>
                        </div>
                        <div style={{ background: '#fffbeb', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                          <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 2px' }}>PAID OUT</p>
                          <p style={{ color: '#f59e0b', fontWeight: '900', margin: 0, fontSize: '14px' }}>KES {driver.paid_earnings || 0}</p>
                        </div>
                      </div>
                      <button onClick={() => removeDriver(driver.id, driver.user?.name)} style={{ ...btn('#fff5f5', '#e94560'), border: '2px solid #e94560', width: '100%', padding: '10px' }}>
                        🗑️ Remove Driver
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======= EARNINGS ======= */}
          {activeTab === 'earnings' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Revenue', value: `KES ${(companyEarnings.total_revenue || 0).toLocaleString()}`, icon: '💰', color: '#22c55e' },
                  { label: 'Total Delivery Fees', value: `KES ${(companyEarnings.total_delivery_fees || 0).toLocaleString()}`, icon: '🚚', color: '#3b82f6' },
                  { label: 'Company Keeps (40%)', value: `KES ${(companyEarnings.company_from_delivery || 0).toLocaleString()}`, icon: '🏢', color: '#e94560' },
                  { label: 'Paid to Drivers (60%)', value: `KES ${(companyEarnings.driver_payouts || 0).toLocaleString()}`, icon: '🏍️', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `5px solid ${s.color}` }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{s.icon}</div>
                    <p style={{ color: '#888', fontSize: '11px', fontWeight: '700', margin: '0 0 6px', textTransform: 'uppercase' }}>{s.label}</p>
                    <p style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Per Driver Earnings */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>🏍️ Per Driver Earnings</h3>
                {drivers.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No drivers yet</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        {['Driver', 'Vehicle', 'Total Earned', 'Available', 'Paid Out', 'Deliveries'].map(h => (
                          <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map(d => (
                        <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px 14px', fontWeight: '800', color: '#1a1a2e' }}>{d.user?.name}</td>
                          <td style={{ padding: '12px 14px', color: '#555' }}>{d.vehicle_type}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '900', color: '#22c55e' }}>KES {d.total_earnings || 0}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '900', color: '#3b82f6' }}>KES {d.pending_earnings || 0}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '900', color: '#f59e0b' }}>KES {d.paid_earnings || 0}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '800' }}>{d.total_deliveries || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ======= FEEDBACK ======= */}
          {activeTab === 'feedback' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>Customer Feedback & Messages ({feedback.length})</h3>
              {feedback.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px' }}>
                  <div style={{ fontSize: '50px', marginBottom: '12px' }}>💬</div>
                  <p style={{ fontWeight: '700', color: '#555', fontSize: '18px' }}>No messages yet</p>
                </div>
              ) : feedback.map(f => (
                <div key={f.id} style={{ ...card, borderLeft: `4px solid ${f.feedback_type === 'complaint' ? '#e94560' : f.feedback_type === 'suggestion' ? '#3b82f6' : '#22c55e'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{f.name}</h3>
                        <span style={{ background: f.feedback_type === 'complaint' ? '#fff5f5' : f.feedback_type === 'suggestion' ? '#f0f9ff' : '#f0fdf4', color: f.feedback_type === 'complaint' ? '#e94560' : f.feedback_type === 'suggestion' ? '#3b82f6' : '#22c55e', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                          {f.feedback_type?.toUpperCase() || 'GENERAL'}
                        </span>
                      </div>
                      <p style={{ color: '#e94560', fontWeight: '700', fontSize: '14px', margin: '0 0 6px' }}>{f.subject}</p>
                      <p style={{ color: '#555', fontSize: '14px', margin: '0 0 8px', lineHeight: '1.5' }}>{f.message}</p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {f.email && <span style={{ color: '#888', fontSize: '13px' }}>📧 {f.email}</span>}
                        {f.phone && <span style={{ color: '#888', fontSize: '13px' }}>📱 {f.phone}</span>}
                        <span style={{ color: '#888', fontSize: '13px' }}>🕒 {new Date(f.created_at).toLocaleString('en-KE')}</span>
                      </div>
                    </div>
                    <a href={`mailto:${f.email}?subject=Re: ${f.subject}`} style={{ ...btn('#1a1a2e'), textDecoration: 'none', fontSize: '13px' }}>📧 Reply</a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ======= EDIT PRODUCT MODAL ======= */}
      {editModal && (
        <div style={modal} onClick={e => { if (e.target === e.currentTarget) setEditModal(false); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>✏️ Edit Product</h2>
              <button onClick={() => setEditModal(false)} style={{ background: '#f8f9fa', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            {editForm.image_url && <div style={{ width: '100%', height: '150px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}><img src={editForm.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} /></div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Product Name *</label><input style={inp} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Price (KES) *</label><input style={inp} type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Stock *</label><input style={inp} type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Category</label><select style={{ ...inp, cursor: 'pointer' }} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}</select></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Image URL</label><input style={inp} value={editForm.image_url} onChange={e => setEditForm({ ...editForm, image_url: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Description</label><input style={inp} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setEditModal(false)} style={{ flex: 1, background: '#f8f9fa', color: '#555', border: '2px solid #e2e8f0', padding: '13px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 2, background: saving ? '#ccc' : '#e94560', color: '#fff', border: 'none', padding: '13px', borderRadius: '12px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>{saving ? '⏳ Saving...' : '✅ Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= ADD PRODUCT MODAL ======= */}
      {addModal && (
        <div style={modal} onClick={e => { if (e.target === e.currentTarget) setAddModal(false); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>➕ Add Product</h2>
              <button onClick={() => setAddModal(false)} style={{ background: '#f8f9fa', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Product Name *</label><input style={inp} value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Fresh Tomatoes 1kg" onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Price (KES) *</label><input style={inp} type="number" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} placeholder="80" onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Stock *</label><input style={inp} type="number" value={addForm.stock} onChange={e => setAddForm({ ...addForm, stock: e.target.value })} placeholder="100" onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Category</label><select style={{ ...inp, cursor: 'pointer' }} value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}</select></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Image URL</label><input style={inp} value={addForm.image_url} onChange={e => setAddForm({ ...addForm, image_url: e.target.value })} placeholder="https://images.unsplash.com/..." onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Description</label><input style={inp} value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setAddModal(false)} style={{ flex: 1, background: '#f8f9fa', color: '#555', border: '2px solid #e2e8f0', padding: '13px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={saveAdd} disabled={adding} style={{ flex: 2, background: adding ? '#ccc' : '#e94560', color: '#fff', border: 'none', padding: '13px', borderRadius: '12px', cursor: adding ? 'not-allowed' : 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>{adding ? '⏳ Adding...' : '✅ Add Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= APPROVE DRIVER MODAL ======= */}
      {approveModal && approveApp && (
        <div style={modal} onClick={e => { if (e.target === e.currentTarget) setApproveModal(false); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>✅ Approve Driver</h2>
              <button onClick={() => setApproveModal(false)} style={{ background: '#f8f9fa', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ fontWeight: '900', color: '#1a1a2e', margin: '0 0 4px', fontSize: '16px' }}>{approveApp.full_name}</p>
              <p style={{ color: '#555', margin: 0, fontSize: '14px' }}>📱 {approveApp.phone} • 🏍️ {approveApp.vehicle_type} • {approveApp.registration_number}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Set Driver Password *</label>
              <input style={inp} value={driverPassword} onChange={e => setDriverPassword(e.target.value)}
                placeholder='e.g. Driver-SecretPass123'
                onFocus={e => e.target.style.borderColor = '#22c55e'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              <p style={{ color: '#888', fontSize: '12px', margin: '6px 0 0', fontWeight: '600' }}>
                ⚠️ Password MUST start with <code style={{ background: '#f0fdf4', padding: '2px 6px', borderRadius: '4px', color: '#16a34a' }}>Driver-</code> e.g. <strong>Driver-John2024</strong>
              </p>
            </div>
            <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
              <p style={{ color: '#92400e', fontSize: '13px', fontWeight: '700', margin: 0 }}>
                📋 After approval, share with driver:<br />
                • Their full name (as Driver ID)<br />
                • The password you set above<br />
                • They login at /login with these credentials
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setApproveModal(false)} style={{ flex: 1, background: '#f8f9fa', color: '#555', border: '2px solid #e2e8f0', padding: '13px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={approveDriver} disabled={approving} style={{ flex: 2, background: approving ? '#ccc' : '#22c55e', color: '#fff', border: 'none', padding: '13px', borderRadius: '12px', cursor: approving ? 'not-allowed' : 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>{approving ? '⏳ Approving...' : '✅ Approve & Create Login'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;