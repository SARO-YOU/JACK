import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://noory-backend.onrender.com';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, paid: 0 });
  const [payoutAmount, setPayoutAmount] = useState('');
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch available orders (not yet accepted by a driver)
      const [ordersRes, myOrdersRes, earningsRes] = await Promise.all([
        fetch(`${API}/api/driver/available-orders`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/driver/my-orders`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/driver/earnings`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [ordersData, myOrdersData, earningsData] = await Promise.all([
        ordersRes.json(), myOrdersRes.json(), earningsRes.json()
      ]);
      setAvailableOrders(ordersData.orders || []);
      setMyOrders(myOrdersData.orders || []);
      setEarnings(earningsData || { total: 0, pending: 0, paid: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const res = await fetch(`${API}/api/driver/accept-order/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Order accepted! Go deliver it!');
        fetchData();
      } else {
        alert('❌ ' + (data.error || 'Could not accept order - another driver may have taken it'));
      }
    } catch (e) {
      alert('❌ Network error');
    }
  };

  const completeOrder = async (orderId) => {
    try {
      const res = await fetch(`${API}/api/driver/complete-order/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('✅ Order marked as delivered!');
        fetchData();
      }
    } catch (e) {
      alert('❌ Network error');
    }
  };

  const requestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) { alert('Enter a valid amount'); return; }
    if (amount > earnings.pending) { alert(`❌ You only have KES ${earnings.pending} available`); return; }
    try {
      setRequestingPayout(true);
      const res = await fetch(`${API}/api/driver/request-payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Payout request sent! Admin will process it.');
        setPayoutAmount('');
        fetchData();
      } else {
        alert('❌ ' + (data.error || 'Request failed'));
      }
    } catch (e) {
      alert('❌ Network error');
    } finally {
      setRequestingPayout(false);
    }
  };

  const s = {
    page: { minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" },
    header: { background: '#1a1a2e', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tab: (active) => ({
      padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', border: 'none',
      background: active ? '#e94560' : 'transparent', color: active ? '#fff' : '#94a3b8',
      transition: 'all 0.2s', fontFamily: 'inherit',
    }),
    card: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px', border: '1px solid #f0f0f0' },
    btn: (color) => ({ background: color, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit' }),
  };

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0 }}>🏍️ Driver Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '2px 0 0' }}>Welcome, {user?.name || 'Driver'}!</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/')} style={s.btn('#0f3460')}>🏠 Shop</button>
          <button onClick={logout} style={s.btn('#e94560')}>Logout</button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', padding: '24px 24px 0' }}>
        {[
          { label: 'Total Earned', value: `KES ${earnings.total || 0}`, icon: '💰', color: '#22c55e' },
          { label: 'Available to Request', value: `KES ${earnings.pending || 0}`, icon: '💳', color: '#3b82f6' },
          { label: 'Already Paid Out', value: `KES ${earnings.paid || 0}`, icon: '✅', color: '#f59e0b' },
          { label: 'Deliveries Done', value: myOrders.filter(o => o.driver_status === 'delivered').length, icon: '📦', color: '#e94560' },
        ].map((s2, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${s2.color}` }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s2.icon}</div>
            <p style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 4px' }}>{s2.label}</p>
            <p style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>{s2.value}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ padding: '20px 24px 0', display: 'flex', gap: '8px', borderBottom: '2px solid #f0f0f0', marginTop: '20px', background: '#fff', paddingBottom: '0' }}>
        {[
          { id: 'orders', label: '🆕 Available Orders', count: availableOrders.length },
          { id: 'my-orders', label: '📦 My Deliveries', count: myOrders.length },
          { id: 'earnings', label: '💰 Earnings & Payout' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            ...s.tab(activeTab === t.id),
            borderRadius: '0', borderBottom: activeTab === t.id ? '3px solid #e94560' : '3px solid transparent',
            paddingBottom: '14px',
          }}>
            {t.label} {t.count > 0 && <span style={{ background: '#e94560', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', marginLeft: '6px' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px' }}>
        {/* AVAILABLE ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>🆕 Orders Waiting for Pickup</h2>
              <button onClick={fetchData} style={s.btn('#1a1a2e')}>🔄 Refresh</button>
            </div>
            {availableOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '12px' }}>📭</div>
                <p style={{ fontWeight: '700', color: '#555', fontSize: '18px' }}>No orders available right now</p>
                <p style={{ color: '#888' }}>Check back in a moment - new orders appear here automatically</p>
              </div>
            ) : availableOrders.map(order => (
              <div key={order.id} style={{ ...s.card, borderLeft: '4px solid #22c55e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ color: '#e94560', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', margin: '0 0 4px' }}>Order #{order.id}</p>
                    <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 6px' }}>📍 {order.delivery_location || 'Location N/A'}</h3>
                    <p style={{ color: '#555', margin: '0 0 4px', fontWeight: '600' }}>💳 {order.payment_method} • KES {order.total_price}</p>
                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                      🕒 {new Date(order.created_at).toLocaleString('en-KE')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '12px 16px', marginBottom: '10px' }}>
                      <p style={{ color: '#888', fontSize: '11px', margin: '0 0 2px', fontWeight: '700' }}>YOUR EARNINGS</p>
                      <p style={{ color: '#22c55e', fontSize: '22px', fontWeight: '900', margin: 0 }}>
                        KES {Math.round((order.delivery_fee || 150) * 0.6)}
                      </p>
                    </div>
                    <button onClick={() => acceptOrder(order.id)} style={{ ...s.btn('#22c55e'), fontSize: '15px', padding: '12px 24px' }}>
                      ✅ Accept Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MY ORDERS */}
        {activeTab === 'my-orders' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>📦 My Deliveries</h2>
            {myOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '12px' }}>🏍️</div>
                <p style={{ fontWeight: '700', color: '#555', fontSize: '18px' }}>No deliveries yet</p>
                <p style={{ color: '#888' }}>Accept orders from the Available Orders tab</p>
              </div>
            ) : myOrders.map(order => (
              <div key={order.id} style={{ ...s.card, borderLeft: `4px solid ${order.driver_status === 'delivered' ? '#22c55e' : '#f59e0b'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ color: '#e94560', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', margin: '0 0 4px' }}>Order #{order.id}</p>
                    <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 4px' }}>📍 {order.delivery_location}</h3>
                    <p style={{ color: '#555', margin: '0 0 4px', fontWeight: '600' }}>KES {order.total_price} • {order.payment_method}</p>
                    <span style={{
                      background: order.driver_status === 'delivered' ? '#dcfce7' : '#fef3c7',
                      color: order.driver_status === 'delivered' ? '#16a34a' : '#92400e',
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'
                    }}>
                      {order.driver_status === 'delivered' ? '✅ Delivered' : '🔄 In Progress'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#22c55e', fontSize: '20px', fontWeight: '900', margin: '0 0 8px' }}>
                      +KES {Math.round((order.delivery_fee || 150) * 0.6)}
                    </p>
                    {order.driver_status !== 'delivered' && (
                      <button onClick={() => completeOrder(order.id)} style={s.btn('#22c55e')}>
                        ✅ Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EARNINGS */}
        {activeTab === 'earnings' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>💰 Earnings & Payout Request</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 16px' }}>📊 Earnings Breakdown</h3>
                {[
                  { label: 'Total Earned (All time)', value: earnings.total || 0, color: '#22c55e' },
                  { label: 'Available Balance', value: earnings.pending || 0, color: '#3b82f6' },
                  { label: 'Total Paid Out', value: earnings.paid || 0, color: '#f59e0b' },
                ].map((e2, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#555', fontWeight: '600', fontSize: '14px' }}>{e2.label}</span>
                    <span style={{ color: e2.color, fontWeight: '900', fontSize: '16px' }}>KES {e2.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 16px' }}>💸 Request Payout</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 16px' }}>
                  Available: <strong style={{ color: '#3b82f6' }}>KES {earnings.pending || 0}</strong>
                </p>
                <input
                  type="number" value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  placeholder={`Max KES ${earnings.pending || 0}`}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button onClick={requestPayout} disabled={requestingPayout || !payoutAmount || parseFloat(payoutAmount) > (earnings.pending || 0)}
                  style={{ ...s.btn(requestingPayout ? '#ccc' : '#e94560'), width: '100%', padding: '13px', fontSize: '15px', cursor: requestingPayout ? 'not-allowed' : 'pointer' }}>
                  {requestingPayout ? '⏳ Requesting...' : '💸 Request M-Pesa Payout'}
                </button>
                {parseFloat(payoutAmount) > (earnings.pending || 0) && payoutAmount && (
                  <p style={{ color: '#e94560', fontSize: '12px', margin: '8px 0 0', fontWeight: '700' }}>
                    ❌ Amount exceeds available balance
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;