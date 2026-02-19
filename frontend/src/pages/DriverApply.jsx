import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverApply = () => {
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '',
    vehicle_type: '', registration_number: '',
    id_number: '', why_suited: '',
    mpesa_phone: '',
  });
  const [idImage, setIdImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.vehicle_type || !form.registration_number || !form.id_number) {
      setError('Please fill all required fields'); return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await fetch('https://noory-backend.onrender.com/api/driver/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Application failed');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '13px 16px', fontSize: '15px',
    border: '2px solid #e2e8f0', borderRadius: '12px',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    background: '#f8f9fa', transition: 'all 0.2s', color: '#1a1a2e',
  };
  const lbl = { display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' };

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '60px 48px', textAlign: 'center', maxWidth: '480px', width: '90%' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 12px' }}>Application Submitted!</h2>
        <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.6, margin: '0 0 24px' }}>
          Thank you <strong>{form.full_name}</strong>! We've received your driver application. The admin will review it and contact you on <strong>{form.phone}</strong> within 24-48 hours.
        </p>
        <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '2px solid #bbf7d0' }}>
          <p style={{ color: '#16a34a', fontWeight: '700', margin: 0, fontSize: '14px' }}>
            📱 Once approved, you'll receive your Driver ID and password via SMS
          </p>
        </div>
        <button onClick={() => navigate('/')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit' }}>
          🏠 Back to Shop
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.4fr', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* LEFT */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop") center/cover', opacity: 0.1 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏍️</div>
          <h1 style={{ fontSize: '44px', fontWeight: '900', color: '#fff', margin: '0 0 12px', letterSpacing: '-2px' }}>
            DRIVE FOR<br /><span style={{ color: '#e94560' }}>NOORY</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 40px', lineHeight: 1.6 }}>
            Join our delivery team and<br />earn great income! 🇰🇪
          </p>

          {/* Earnings breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
            <p style={{ color: '#e94560', fontWeight: '800', fontSize: '14px', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>💰 Driver Earnings Per Delivery</p>
            {[
              { dist: '0–5 km', fee: 'KES 100', driver: 'KES 60' },
              { dist: '5–10 km', fee: 'KES 150', driver: 'KES 90' },
              { dist: '10–20 km', fee: 'KES 250', driver: 'KES 150' },
              { dist: '20–30 km', fee: 'KES 350', driver: 'KES 210' },
              { dist: '30–50 km', fee: 'KES 600', driver: 'KES 360' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>{r.dist}</span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>{r.driver}</span>
              </div>
            ))}
            <p style={{ color: '#64748b', fontSize: '11px', margin: '10px 0 0' }}>* Company keeps the rest to keep operations running</p>
          </div>

          {[
            '✅ Flexible working hours',
            '✅ Weekly M-Pesa payouts',
            '✅ Request earnings anytime',
            '✅ Bonus for more deliveries',
          ].map((t, i) => (
            <div key={i} style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600', padding: '6px 0', textAlign: 'left' }}>{t}</div>
          ))}
        </div>
      </div>

      {/* RIGHT - Form */}
      <div style={{ background: '#fff', padding: '40px', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px', paddingTop: '20px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-1px' }}>
              Driver Application 🏍️
            </h2>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Fill in all details accurately</p>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '2px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#e94560', fontWeight: '700', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Full Name (As on ID) *</label>
                <input style={inp} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Your full legal name"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>

              <div>
                <label style={lbl}>Phone Number *</label>
                <input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0716 613 176"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>

              <div>
                <label style={lbl}>M-Pesa Number (for pay) *</label>
                <input style={inp} value={form.mpesa_phone} onChange={e => setForm({ ...form, mpesa_phone: e.target.value })} placeholder="0716 613 176"
                  onFocus={e => { e.target.style.borderColor = '#22c55e'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Email Address</label>
                <input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>

              <div>
                <label style={lbl}>National ID Number *</label>
                <input style={inp} value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} placeholder="12345678"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>

              <div>
                <label style={lbl}>Type of Vehicle *</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.vehicle_type} onChange={e => setForm({ ...form, vehicle_type: e.target.value })}>
                  <option value="">Select vehicle</option>
                  <option value="Motorcycle">🏍️ Motorcycle</option>
                  <option value="Bicycle">🚲 Bicycle</option>
                  <option value="Tuk-Tuk">🛺 Tuk-Tuk</option>
                  <option value="Car">🚗 Car</option>
                  <option value="Van">🚐 Van</option>
                </select>
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Vehicle Registration Number *</label>
                <input style={inp} value={form.registration_number} onChange={e => setForm({ ...form, registration_number: e.target.value })} placeholder="e.g., KCA 123A"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>

              {/* ID Photo Upload */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>ID Card Photo (Front) *</label>
                <div style={{
                  border: '2px dashed #e94560', borderRadius: '12px', padding: '24px',
                  textAlign: 'center', background: '#fff5f5', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onClick={() => document.getElementById('id-upload').click()}
                >
                  {idImage ? (
                    <div>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                      <p style={{ color: '#16a34a', fontWeight: '700', margin: 0 }}>{idImage.name}</p>
                      <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0' }}>Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                      <p style={{ color: '#e94560', fontWeight: '700', margin: '0 0 4px' }}>Click to upload ID photo</p>
                      <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>JPG, PNG or PDF (max 5MB)</p>
                    </div>
                  )}
                </div>
                <input id="id-upload" type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                  onChange={e => setIdImage(e.target.files[0])} />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Why are you suited for this role? *</label>
                <textarea style={{ ...inp, minHeight: '100px', resize: 'vertical' }}
                  value={form.why_suited} onChange={e => setForm({ ...form, why_suited: e.target.value })}
                  placeholder="Tell us about your experience, your area of operation, and why you'd be a great Noory driver..."
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                />
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '12px', padding: '14px', margin: '20px 0' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#92400e', fontWeight: '600' }}>
                ⚠️ By submitting, you confirm all information is accurate. False information will disqualify your application.
              </p>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', background: loading ? '#ccc' : '#e94560',
              color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px',
              fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
            }}>
              {loading ? '⏳ Submitting...' : '🏍️ Submit Application'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>
            Already a driver?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#e94560', fontWeight: '800', cursor: 'pointer' }}>Login here →</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverApply;