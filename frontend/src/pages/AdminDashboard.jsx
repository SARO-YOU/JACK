import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://noory-backend.onrender.com';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ total_orders: 0, total_customers: 0, total_drivers: 0, total_revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [companyEarnings, setCompanyEarnings] = useState({});
  const [searchProduct, setSearchProduct] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Delivery fee
  const [deliveryFee, setDeliveryFee] = useState(200);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState('200');
  const [savingFee, setSavingFee] = useState(false);

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
      const [dashRes, prodRes, drvRes, appRes, fbRes, earnRes, feeRes] = await Promise.all([
        fetch(`${API}/api/admin/dashboard`, { headers }),
        fetch(`${API}/api/products`),
        fetch(`${API}/api/admin/drivers`, { headers }),
        fetch(`${API}/api/admin/driver-applications`, { headers }),
        fetch(`${API}/api/admin/feedback`, { headers }),
        fetch(`${API}/api/admin/company-earnings`, { headers }),
        fetch(`${API}/api/settings/delivery-fee`),
      ]);
      const [dash, prod, drv, app, fb, earn, fee] = await Promise.all([
        dashRes.json(), prodRes.json(), drvRes.json(), appRes.json(), fbRes.json(), earnRes.json(), feeRes.json()
      ]);
      if (dash.stats) setStats(dash.stats);
      if (dash.recent_orders) setRecentOrders(dash.recent_orders);
      setProducts(prod.products || []);
      setDrivers(drv.drivers || []);
      setApplications(app.applications || []);
      setFeedback(fb.feedback || []);
      setCompanyEarnings(earn || {});
      if (fee.delivery_fee) { setDeliveryFee(Number(fee.delivery_fee)); setDeliveryFeeInput(String(fee.delivery_fee)); }
    } catch (e) { console.error(e); }
  };

  // ── Save delivery fee ──────────────────────────────────────────────────────
  const saveDeliveryFee = async () => {
    const val = parseFloat(deliveryFeeInput);
    if (isNaN(val) || val < 0) { alert('❌ Enter a valid delivery fee'); return; }
    try {
      setSavingFee(true);
      const res = await fetch(`${API}/api/admin/settings/delivery-fee`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ delivery_fee: val }),
      });
      if (res.ok) { setDeliveryFee(val); alert('✅ Delivery fee updated! Customers will see the new fee.'); }
      else { const d = await res.json(); alert('❌ ' + (d.error || 'Failed to update')); }
    } catch { alert('❌ Network error'); } finally { setSavingFee(false); }
  };

  // ── Send receipt email ─────────────────────────────────────────────────────
  const sendReceipt = async (orderId) => {
    try {
      const res = await fetch(`${API}/api/admin/orders/${orderId}/send-receipt`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) alert('✅ Receipt sent to customer\'s email!');
      else alert('❌ Failed to send receipt');
    } catch { alert('❌ Network error'); }
  };

  // ── Products ───────────────────────────────────────────────────────────────
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
    } catch { alert('❌ Network error'); } finally { setSaving(false); }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { alert('✅ Deleted!'); fetchAll(); } else alert('❌ Failed');
    } catch { alert('❌ Network error'); }
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
    } catch { alert('❌ Network error'); } finally { setAdding(false); }
  };

  // ── Drivers ────────────────────────────────────────────────────────────────
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
    } catch { alert('❌ Network error'); } finally { setApproving(false); }
  };

  const rejectDriver = async (id) => {
    if (!window.confirm('Reject this application?')) return;
    try {
      await fetch(`${API}/api/admin/reject-driver/${id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      alert('Application rejected'); fetchAll();
    } catch { alert('❌ Error'); }
  };

  const removeDriver = async (id, name) => {
    if (!window.confirm(`Remove driver "${name}" completely from the system?`)) return;
    try {
      const res = await fetch(`${API}/api/admin/remove-driver/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { alert('✅ Driver removed'); fetchAll(); } else alert('❌ Failed');
    } catch { alert('❌ Error'); }
  };

  const cleanupUsers = async () => {
    if (!window.confirm('⚠️ DELETE ALL NON-ADMIN USERS?\n\nThis will delete all customers, drivers, orders and cart items.\nAdmins will NOT be deleted.')) return;
    const confirm2 = window.prompt('Type DELETE to confirm:');
    if (confirm2 !== 'DELETE') { alert('Cancelled'); return; }
    try {
      const res = await fetch(`${API}/api/admin/cleanup-users`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ SUCCESS!\nDeleted: ${data.deleted_users} users, ${data.deleted_orders} orders, ${data.deleted_cart_items} cart items`);
        window.location.reload();
      } else alert('❌ ERROR: ' + (data.error || 'Unknown error'));
    } catch (err) { alert('❌ ERROR: ' + err.message); }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) &&
    (filterCategory === 'all' || p.category === filterCategory)
  );
  const pendingApps = applications.filter(a => a.status === 'pending');

  // ── shared styles ──────────────────────────────────────────────────────────
  const inp = { width: '100%', padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#f8f9fa' };
  const lbl = { display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' };
  const btn = (color, text = '#fff') => ({ background: color, color: text, border: 'none', padding: '9px 18px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s' });
  const card = { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px', border: '1px solid #f0f0f0' };
  const modal = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px', backdropFilter: 'blur(4px)' };
  const modalBox = { background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' };

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'orders', icon: '🛒', label: 'Orders' },
    { id: 'applications', icon: '🏍️', label: 'Driver Apps', badge: pendingApps.length },
    { id: 'drivers', icon: '👥', label: 'Drivers' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'feedback', icon: '💬', label: 'Feedback' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" }}>

      <style>{`
        .admin-sidebar {
          width: 220px; background: #1a1a2e; min-height: 100vh;
          position: fixed; top: 0; left: 0; z-index: 50;
          display: flex; flex-direction: column;
          transition: transform 0.3s ease;
        }
        .admin-main { margin-left: 220px; flex: 1; }
        .sidebar-overlay { display: none; }
        .mobile-menu-btn { display: none; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin-bottom: 22px; }
        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 22px; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .drivers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
        .orders-table-wrap { overflow-x: auto; }
        .orders-table-wrap table { min-width: 700px; }

        @media (max-width: 900px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0 !important; }
          .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 49; }
          .mobile-menu-btn { display: flex !important; }
          .quick-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .drivers-grid { grid-template-columns: 1fr !important; }
          .topbar-title p { display: none; }
          .admin-content-pad { padding: 16px !important; }
        }
        @media (max-width: 380px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '20px 18px', borderBottom: '1px solid #0f3460' }}>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>🛍️ <span style={{ color: '#e94560' }}>NOORY</span></div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', fontWeight: '600', letterSpacing: '1px' }}>ADMIN PANEL</div>
        </div>
        <div style={{ flex: 1, paddingTop: '6px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <div key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', cursor: 'pointer', background: activeTab === item.id ? '#e94560' : 'transparent', color: activeTab === item.id ? '#fff' : '#94a3b8', fontWeight: activeTab === item.id ? '700' : '500', fontSize: '14px', borderLeft: activeTab === item.id ? '4px solid #ff6b6b' : '4px solid transparent', transition: 'all 0.2s', position: 'relative' }}
              onMouseEnter={e => { if (activeTab !== item.id) { e.currentTarget.style.background = '#0f3460'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (activeTab !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <span style={{ fontSize: '17px' }}>{item.icon}</span>
              {item.label}
              {item.badge > 0 && <span style={{ position: 'absolute', right: '10px', background: '#f59e0b', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900' }}>{item.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: '14px', borderTop: '1px solid #0f3460', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => navigate('/')} style={{ ...btn('transparent', '#94a3b8'), border: '1px solid #0f3460', width: '100%' }}>🏠 View Shop</button>
          <button onClick={logout} style={{ ...btn('#e94560'), width: '100%' }}>Logout</button>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className="admin-main">
        {/* TOPBAR */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}
              style={{ background: '#f8f9fa', border: 'none', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', fontSize: '20px', display: 'none', alignItems: 'center', justifyContent: 'center' }}>☰</button>
            <div className="topbar-title">
              <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>
                {navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p style={{ color: '#888', fontSize: '11px', margin: '2px 0 0', fontWeight: '600' }}>Noory Shop Admin</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {activeTab === 'products' && <button onClick={() => setAddModal(true)} style={btn('#e94560')}>+ Add Product</button>}
            <div style={{ background: '#f8f9fa', padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', color: '#555', whiteSpace: 'nowrap' }}>👨‍💼 Admin</div>
          </div>
        </div>

        <div className="admin-content-pad" style={{ padding: '24px 20px' }}>

          {/* ══ DASHBOARD ══════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-grid">
                {[
                  { label: 'Total Orders', value: stats.total_orders, icon: '🛒', color: '#3b82f6' },
                  { label: 'Customers', value: stats.total_customers, icon: '👥', color: '#22c55e' },
                  { label: 'Drivers', value: stats.total_drivers, icon: '🏍️', color: '#f59e0b' },
                  { label: 'Revenue', value: `KES ${(stats.total_revenue || 0).toLocaleString()}`, icon: '💰', color: '#e94560' },
                  { label: 'Products', value: products.length, icon: '📦', color: '#8b5cf6' },
                  { label: 'Pending Apps', value: pendingApps.length, icon: '📋', color: '#f97316' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: '26px', marginBottom: '6px' }}>{s.icon}</div>
                    <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 3px', textTransform: 'uppercase' }}>{s.label}</p>
                    <p style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="quick-grid">
                <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 14px' }}>⚡ Quick Actions</h3>
                  {[
                    { label: '➕ Add New Product', color: '#e94560', action: () => { setActiveTab('products'); setAddModal(true); } },
                    { label: '🏍️ Review Driver Apps', color: '#f59e0b', action: () => setActiveTab('applications') },
                    { label: '💰 View Earnings', color: '#22c55e', action: () => setActiveTab('earnings') },
                    { label: '⚙️ Settings (Delivery Fee)', color: '#3b82f6', action: () => setActiveTab('settings') },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action} style={{ ...btn(a.color), width: '100%', marginBottom: '8px', textAlign: 'left', padding: '11px 16px', borderRadius: '10px', display: 'block' }}>{a.label}</button>
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 14px' }}>📊 Company At A Glance</h3>
                  {[
                    { label: 'Total Revenue', value: `KES ${(companyEarnings.total_revenue || 0).toLocaleString()}`, color: '#22c55e' },
                    { label: 'From Deliveries', value: `KES ${(companyEarnings.company_from_delivery || 0).toLocaleString()}`, color: '#3b82f6' },
                    { label: 'Paid to Drivers', value: `KES ${(companyEarnings.driver_payouts || 0).toLocaleString()}`, color: '#f59e0b' },
                    { label: 'Delivery Fee', value: `KES ${deliveryFee}`, color: '#e94560' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
                      <span style={{ color: '#555', fontSize: '13px', fontWeight: '600' }}>{s.label}</span>
                      <span style={{ color: s.color, fontWeight: '900', fontSize: '14px' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '22px', border: '2px solid #fee2e2' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#ef4444', margin: '0 0 6px' }}>⚠️ Danger Zone</h3>
                <p style={{ color: '#888', fontSize: '12px', margin: '0 0 14px', fontWeight: '600' }}>These actions are irreversible.</p>
                <button onClick={cleanupUsers} style={{ ...btn('#ef4444'), padding: '11px 22px', fontSize: '13px', borderRadius: '10px' }}>🗑️ Delete All Non-Admin Users</button>
              </div>

              {/* Recent Orders */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 14px' }}>🕒 Recent Orders</h3>
                <div className="orders-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                        {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: '800', color: '#888', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.slice(0, 8).map(o => (
                        <tr key={o.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                          <td style={{ padding: '9px 10px', fontWeight: '800', color: '#e94560', whiteSpace: 'nowrap' }}>#{o.id}</td>
                          <td style={{ padding: '9px 10px', fontWeight: '600', whiteSpace: 'nowrap' }}>{o.user?.name || 'N/A'}</td>
                          <td style={{ padding: '9px 10px', fontWeight: '800', whiteSpace: 'nowrap' }}>KES {o.total_price}</td>
                          <td style={{ padding: '9px 10px' }}><span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>{o.payment_method}</span></td>
                          <td style={{ padding: '9px 10px' }}><span style={{ background: '#f0f9ff', color: '#0284c7', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>{o.payment_status}</span></td>
                          <td style={{ padding: '9px 10px', color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString('en-KE')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ PRODUCTS ════════════════════════════════════════════════════ */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="🔍 Search products..." value={searchProduct} onChange={e => setSearchProduct(e.target.value)}
                  style={{ ...inp, flex: 1, minWidth: '160px' }}
                  onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ background: '#fff', padding: '11px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontWeight: '700', color: '#555', fontSize: '13px', whiteSpace: 'nowrap' }}>{filteredProducts.length} products</div>
              </div>
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                  >
                    <div style={{ height: '140px', overflow: 'hidden', background: '#f8f9fa', position: 'relative' }}>
                      <img src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop'} alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop'} />
                      {product.stock === 0 && <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#e94560', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>OUT OF STOCK</div>}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <p style={{ fontSize: '10px', color: '#e94560', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 3px' }}>{product.category}</p>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 6px', lineHeight: '1.3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '32px' }}>{product.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '17px', fontWeight: '900', color: '#e94560' }}>KES {product.price}</span>
                        <span style={{ fontSize: '11px', color: '#888', fontWeight: '600' }}>Stock: {product.stock}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(product)} style={{ flex: 1, background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', fontFamily: 'inherit' }}>✏️ Edit</button>
                        <button onClick={() => deleteProduct(product.id, product.name)} style={{ background: '#fff5f5', color: '#e94560', border: '2px solid #e94560', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit', fontSize: '12px' }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ ORDERS ══════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 18px' }}>All Orders</h3>
              <div className="orders-table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      {['#', 'Customer', 'Location', 'Total', 'Del. Fee', 'Payment', 'Driver', 'Status', 'Date', 'Receipt'].map(h => (
                        <th key={h} style={{ padding: '11px 12px', textAlign: 'left', fontSize: '10px', fontWeight: '800', color: '#888', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '11px 12px', fontWeight: '800', color: '#e94560', whiteSpace: 'nowrap' }}>#{o.id}</td>
                        <td style={{ padding: '11px 12px', fontWeight: '700', whiteSpace: 'nowrap' }}>{o.user?.name || 'N/A'}</td>
                        <td style={{ padding: '11px 12px', color: '#555', fontSize: '12px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.delivery_location || 'N/A'}</td>
                        <td style={{ padding: '11px 12px', fontWeight: '900', whiteSpace: 'nowrap' }}>KES {o.total_price}</td>
                        <td style={{ padding: '11px 12px', fontWeight: '700', color: '#3b82f6', whiteSpace: 'nowrap' }}>KES {o.delivery_fee || 0}</td>
                        <td style={{ padding: '11px 12px' }}><span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>{o.payment_method}</span></td>
                        <td style={{ padding: '11px 12px', color: '#888', fontSize: '12px', whiteSpace: 'nowrap' }}>{o.driver?.user?.name || '—'}</td>
                        <td style={{ padding: '11px 12px' }}><span style={{ background: '#f0f9ff', color: '#0284c7', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>{o.driver_status || 'pending'}</span></td>
                        <td style={{ padding: '11px 12px', color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString('en-KE')}</td>
                        <td style={{ padding: '11px 12px' }}>
                          <button onClick={() => sendReceipt(o.id)} style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>📧 Send</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ DRIVER APPLICATIONS ═════════════════════════════════════════ */}
          {activeTab === 'applications' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
                {['pending', 'approved', 'rejected'].map(status => (
                  <div key={status} style={{ background: '#fff', borderRadius: '12px', padding: '9px 16px', fontWeight: '700', fontSize: '13px', color: status === 'pending' ? '#f59e0b' : status === 'approved' ? '#22c55e' : '#e94560', border: `2px solid ${status === 'pending' ? '#fcd34d' : status === 'approved' ? '#bbf7d0' : '#fecaca'}` }}>
                    {status === 'pending' ? '⏳' : status === 'approved' ? '✅' : '❌'} {applications.filter(a => a.status === status).length} {status}
                  </div>
                ))}
              </div>
              {applications.map(app => (
                <div key={app.id} style={{ ...card, borderLeft: `4px solid ${app.status === 'pending' ? '#f59e0b' : app.status === 'approved' ? '#22c55e' : '#e94560'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{app.full_name}</h3>
                        <span style={{ background: app.status === 'pending' ? '#fef3c7' : app.status === 'approved' ? '#dcfce7' : '#fff5f5', color: app.status === 'pending' ? '#92400e' : app.status === 'approved' ? '#16a34a' : '#e94560', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>{app.status?.toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '7px' }}>
                        {[
                          { label: '📱 Phone', value: app.phone },
                          { label: '💚 M-Pesa', value: app.mpesa_phone },
                          { label: '🪪 ID Number', value: app.id_number },
                          { label: '🏍️ Vehicle', value: app.vehicle_type },
                          { label: '🔢 Reg No.', value: app.registration_number },
                          { label: '📧 Email', value: app.email || 'N/A' },
                        ].map((f, i) => (
                          <div key={i} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '7px 10px' }}>
                            <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 2px' }}>{f.label}</p>
                            <p style={{ color: '#1a1a2e', fontWeight: '700', margin: 0, fontSize: '13px' }}>{f.value || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                        <button onClick={() => { setApproveApp(app); setApproveModal(true); }} style={{ ...btn('#22c55e'), padding: '11px 16px' }}>✅ Approve</button>
                        <button onClick={() => rejectDriver(app.id)} style={{ ...btn('#e94560'), padding: '11px 16px' }}>❌ Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ DRIVERS ═════════════════════════════════════════════════════ */}
          {activeTab === 'drivers' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 18px' }}>Active Drivers ({drivers.length})</h3>
              <div className="drivers-grid">
                {drivers.map(driver => (
                  <div key={driver.id} style={{ ...card, borderLeft: '4px solid #22c55e', marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 3px' }}>{driver.user?.name}</h3>
                        <p style={{ color: '#888', fontSize: '11px', margin: 0, fontWeight: '600' }}>{driver.driver_identity}</p>
                      </div>
                      <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>✅ ACTIVE</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '10px' }}>
                      {[
                        { label: '🏍️ Vehicle', value: driver.vehicle_type },
                        { label: '🔢 Reg', value: driver.registration_number },
                        { label: '📱 M-Pesa', value: driver.mpesa_phone },
                        { label: '📦 Deliveries', value: driver.total_deliveries || 0 },
                      ].map((f, i) => (
                        <div key={i} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '7px' }}>
                          <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 2px' }}>{f.label}</p>
                          <p style={{ color: '#1a1a2e', fontWeight: '700', margin: 0, fontSize: '12px' }}>{f.value || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px', marginBottom: '12px' }}>
                      <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '7px', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontSize: '9px', fontWeight: '700', margin: '0 0 2px' }}>TOTAL</p>
                        <p style={{ color: '#22c55e', fontWeight: '900', margin: 0, fontSize: '13px' }}>KES {driver.total_earnings || 0}</p>
                      </div>
                      <div style={{ background: '#f0f9ff', borderRadius: '8px', padding: '7px', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontSize: '9px', fontWeight: '700', margin: '0 0 2px' }}>AVAILABLE</p>
                        <p style={{ color: '#3b82f6', fontWeight: '900', margin: 0, fontSize: '13px' }}>KES {driver.pending_earnings || 0}</p>
                      </div>
                      <div style={{ background: '#fffbeb', borderRadius: '8px', padding: '7px', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontSize: '9px', fontWeight: '700', margin: '0 0 2px' }}>PAID</p>
                        <p style={{ color: '#f59e0b', fontWeight: '900', margin: 0, fontSize: '13px' }}>KES {driver.paid_earnings || 0}</p>
                      </div>
                    </div>
                    <button onClick={() => removeDriver(driver.id, driver.user?.name)} style={{ ...btn('#fff5f5', '#e94560'), border: '2px solid #e94560', width: '100%', padding: '9px' }}>🗑️ Remove Driver</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ EARNINGS ════════════════════════════════════════════════════ */}
          {activeTab === 'earnings' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '22px' }}>
                {[
                  { label: 'Total Revenue', value: `KES ${(companyEarnings.total_revenue || 0).toLocaleString()}`, icon: '💰', color: '#22c55e' },
                  { label: 'Total Del. Fees', value: `KES ${(companyEarnings.total_delivery_fees || 0).toLocaleString()}`, icon: '🚚', color: '#3b82f6' },
                  { label: 'Company (40%)', value: `KES ${(companyEarnings.company_from_delivery || 0).toLocaleString()}`, icon: '🏢', color: '#e94560' },
                  { label: 'Drivers (60%)', value: `KES ${(companyEarnings.driver_payouts || 0).toLocaleString()}`, icon: '🏍️', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `5px solid ${s.color}` }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                    <p style={{ color: '#888', fontSize: '10px', fontWeight: '700', margin: '0 0 5px', textTransform: 'uppercase' }}>{s.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 18px' }}>🏍️ Per Driver Earnings</h3>
                <div className="orders-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        {['Driver', 'Vehicle', 'Total Earned', 'Available', 'Paid Out', 'Deliveries'].map(h => (
                          <th key={h} style={{ padding: '11px 12px', textAlign: 'left', fontSize: '10px', fontWeight: '800', color: '#888', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map(d => (
                        <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '11px 12px', fontWeight: '800', color: '#1a1a2e', whiteSpace: 'nowrap' }}>{d.user?.name}</td>
                          <td style={{ padding: '11px 12px', color: '#555' }}>{d.vehicle_type}</td>
                          <td style={{ padding: '11px 12px', fontWeight: '900', color: '#22c55e', whiteSpace: 'nowrap' }}>KES {d.total_earnings || 0}</td>
                          <td style={{ padding: '11px 12px', fontWeight: '900', color: '#3b82f6', whiteSpace: 'nowrap' }}>KES {d.pending_earnings || 0}</td>
                          <td style={{ padding: '11px 12px', fontWeight: '900', color: '#f59e0b', whiteSpace: 'nowrap' }}>KES {d.paid_earnings || 0}</td>
                          <td style={{ padding: '11px 12px', fontWeight: '800' }}>{d.total_deliveries || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ FEEDBACK ════════════════════════════════════════════════════ */}
          {activeTab === 'feedback' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 18px' }}>Customer Feedback ({feedback.length})</h3>
              {feedback.map(f => (
                <div key={f.id} style={{ ...card, borderLeft: `4px solid ${f.feedback_type === 'complaint' ? '#e94560' : f.feedback_type === 'suggestion' ? '#3b82f6' : '#22c55e'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{f.name}</h3>
                        <span style={{ background: '#f0f9ff', color: '#0284c7', padding: '2px 9px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>{f.feedback_type?.toUpperCase() || 'GENERAL'}</span>
                      </div>
                      <p style={{ color: '#e94560', fontWeight: '700', fontSize: '13px', margin: '0 0 5px' }}>{f.subject}</p>
                      <p style={{ color: '#555', fontSize: '13px', margin: '0 0 7px', lineHeight: '1.5' }}>{f.message}</p>
                      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        {f.email && <span style={{ color: '#888', fontSize: '12px' }}>📧 {f.email}</span>}
                        {f.phone && <span style={{ color: '#888', fontSize: '12px' }}>📱 {f.phone}</span>}
                      </div>
                    </div>
                    <a href={`mailto:${f.email}?subject=Re: ${f.subject}`} style={{ ...btn('#1a1a2e'), textDecoration: 'none', fontSize: '12px', whiteSpace: 'nowrap' }}>📧 Reply</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ SETTINGS ════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>⚙️ Shop Settings</h3>

              {/* Delivery Fee Card */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', border: '2px solid #e0f2fe', maxWidth: '480px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', background: '#e0f2fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🚚</div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>Delivery Fee</h4>
                    <p style={{ color: '#888', fontSize: '12px', margin: 0, fontWeight: '600' }}>Current: KES {deliveryFee} — visible to all customers</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={lbl}>New Delivery Fee (KES)</label>
                    <input type="number" min="0" value={deliveryFeeInput} onChange={e => setDeliveryFeeInput(e.target.value)}
                      style={{ ...inp, fontSize: '16px', fontWeight: '700' }}
                      onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <button onClick={saveDeliveryFee} disabled={savingFee}
                    style={{ ...btn(savingFee ? '#ccc' : '#e94560'), padding: '12px 20px', fontSize: '14px', whiteSpace: 'nowrap', cursor: savingFee ? 'not-allowed' : 'pointer' }}>
                    {savingFee ? '⏳ Saving...' : '💾 Save'}
                  </button>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '11px', margin: '10px 0 0', fontWeight: '600' }}>
                  ℹ️ Changing this will immediately update the fee shown to all customers at checkout.
                </p>
              </div>

              {/* Email Receipt Info */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', border: '2px solid #dcfce7', maxWidth: '480px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📧</div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>Email Receipts</h4>
                    <p style={{ color: '#888', fontSize: '12px', margin: 0, fontWeight: '600' }}>Automatic order confirmations</p>
                  </div>
                </div>
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', margin: '0 0 12px' }}>
                  When a customer places an order, they automatically receive an email receipt with their order details, items, total and delivery info. The driver also receives a notification email with the delivery details.
                </p>
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', margin: '0 0 12px' }}>
                  You can also manually resend receipts from the <strong>Orders</strong> tab using the 📧 Send button next to any order.
                </p>
                <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '12px 14px' }}>
                  <p style={{ color: '#16a34a', fontSize: '12px', fontWeight: '700', margin: 0 }}>
                    ✅ To enable emails: configure <code>EMAIL_FROM</code>, <code>EMAIL_HOST</code>, <code>EMAIL_USER</code>, and <code>EMAIL_PASS</code> in your backend <code>.env</code> file. See backend email setup guide below.
                  </p>
                </div>
              </div>

              {/* Backend email setup guide */}
              <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '640px' }}>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '900', margin: '0 0 14px' }}>📋 Backend Email Setup (Free — Gmail)</h4>
                {[
                  { title: '1. Add to your backend .env file:', code: `EMAIL_FROM=nooryshop@gmail.com\nEMAIL_HOST=smtp.gmail.com\nEMAIL_PORT=587\nEMAIL_USER=nooryshop@gmail.com\nEMAIL_PASS=your_gmail_app_password` },
                  { title: '2. Install nodemailer in backend:', code: `npm install nodemailer` },
                  { title: '3. Create backend/utils/email.js:', code: `const nodemailer = require('nodemailer');\nconst transporter = nodemailer.createTransport({\n  host: process.env.EMAIL_HOST,\n  port: process.env.EMAIL_PORT,\n  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }\n});\nmodule.exports = transporter;` },
                  { title: '4. Add receipt sending to your order creation route (backend):', code: `// After order is created:\nconst transporter = require('./utils/email');\nawait transporter.sendMail({\n  from: \`"Noory Shop" <\${process.env.EMAIL_FROM}>\`,\n  to: customer.email,\n  subject: \`Order #\${order.id} Confirmed ✅\`,\n  html: buildReceiptHTML(order) // see below\n});` },
                ].map((s, i) => (
                  <div key={i} style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', margin: '0 0 6px' }}>{s.title}</p>
                    <pre style={{ background: '#0f3460', color: '#e2e8f0', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', overflowX: 'auto', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{s.code}</pre>
                  </div>
                ))}
                <p style={{ color: '#64748b', fontSize: '11px', margin: '10px 0 0', fontWeight: '600' }}>
                  💡 For Gmail App Password: Google Account → Security → 2-Step Verification → App passwords → generate one for "Mail"
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══ EDIT PRODUCT MODAL ═══════════════════════════════════════════════ */}
      {editModal && (
        <div style={modal} onClick={e => { if (e.target === e.currentTarget) setEditModal(false); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>✏️ Edit Product</h2>
              <button onClick={() => setEditModal(false)} style={{ background: '#f8f9fa', border: 'none', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '17px' }}>×</button>
            </div>
            {editForm.image_url && <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}><img src={editForm.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} /></div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Product Name *</label><input style={inp} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Price (KES) *</label><input style={inp} type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Stock *</label><input style={inp} type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Category</label><select style={{ ...inp, cursor: 'pointer' }} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}</select></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Image URL</label><input style={inp} value={editForm.image_url} onChange={e => setEditForm({ ...editForm, image_url: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Description</label><input style={inp} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button onClick={() => setEditModal(false)} style={{ flex: 1, background: '#f8f9fa', color: '#555', border: '2px solid #e2e8f0', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 2, background: saving ? '#ccc' : '#e94560', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>{saving ? '⏳ Saving...' : '✅ Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD PRODUCT MODAL ════════════════════════════════════════════════ */}
      {addModal && (
        <div style={modal} onClick={e => { if (e.target === e.currentTarget) setAddModal(false); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>➕ Add Product</h2>
              <button onClick={() => setAddModal(false)} style={{ background: '#f8f9fa', border: 'none', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '17px' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Product Name *</label><input style={inp} value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Fresh Tomatoes 1kg" onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Price (KES) *</label><input style={inp} type="number" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} placeholder="80" onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div><label style={lbl}>Stock *</label><input style={inp} type="number" value={addForm.stock} onChange={e => setAddForm({ ...addForm, stock: e.target.value })} placeholder="100" onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Category</label><select style={{ ...inp, cursor: 'pointer' }} value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}</select></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Image URL</label><input style={inp} value={addForm.image_url} onChange={e => setAddForm({ ...addForm, image_url: e.target.value })} placeholder="https://images.unsplash.com/..." onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Description</label><input style={inp} value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} onFocus={e => e.target.style.borderColor = '#e94560'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button onClick={() => setAddModal(false)} style={{ flex: 1, background: '#f8f9fa', color: '#555', border: '2px solid #e2e8f0', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={saveAdd} disabled={adding} style={{ flex: 2, background: adding ? '#ccc' : '#e94560', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', cursor: adding ? 'not-allowed' : 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>{adding ? '⏳ Adding...' : '✅ Add Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ APPROVE DRIVER MODAL ════════════════════════════════════════════ */}
      {approveModal && approveApp && (
        <div style={modal} onClick={e => { if (e.target === e.currentTarget) setApproveModal(false); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>✅ Approve Driver</h2>
              <button onClick={() => setApproveModal(false)} style={{ background: '#f8f9fa', border: 'none', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '17px' }}>×</button>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px', marginBottom: '18px' }}>
              <p style={{ fontWeight: '900', color: '#1a1a2e', margin: '0 0 3px', fontSize: '15px' }}>{approveApp.full_name}</p>
              <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>📱 {approveApp.phone} • 🏍️ {approveApp.vehicle_type}</p>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={lbl}>Set Driver Password *</label>
              <input style={inp} value={driverPassword} onChange={e => setDriverPassword(e.target.value)} placeholder="e.g. Driver-SecretPass123"
                onFocus={e => e.target.style.borderColor = '#22c55e'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              <p style={{ color: '#888', fontSize: '11px', margin: '5px 0 0', fontWeight: '600' }}>
                ⚠️ Must start with <code style={{ background: '#f0fdf4', padding: '1px 5px', borderRadius: '4px', color: '#16a34a' }}>Driver-</code>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setApproveModal(false)} style={{ flex: 1, background: '#f8f9fa', color: '#555', border: '2px solid #e2e8f0', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={approveDriver} disabled={approving} style={{ flex: 2, background: approving ? '#ccc' : '#22c55e', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', cursor: approving ? 'not-allowed' : 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>{approving ? '⏳ Approving...' : '✅ Approve & Create Login'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;