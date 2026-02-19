import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Please enter your full name'); return; }
    if (!form.email.trim()) { setError('Please enter your email'); return; }
    if (!form.password) { setError('Please enter a password'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match!'); return; }

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.phone.trim());
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '13px 16px', fontSize: '15px',
    border: '2px solid #e2e8f0', borderRadius: '12px', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', background: '#f8f9fa',
    transition: 'all 0.2s', color: '#1a1a2e',
  };
  const lbl = { display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* LEFT PANEL - hidden on mobile */}
      <div
        className="register-left-panel"
        style={{
          flex: '0 0 45%',
          background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url("https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&fit=crop") center/cover',
          opacity: 0.12,
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '340px' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#fff', margin: '0 0 12px', letterSpacing: '-2px', lineHeight: 1 }}>
            JOIN<br /><span style={{ color: '#e94560' }}>NOORY</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '17px', margin: '0 0 40px', lineHeight: 1.6 }}>
            Create your account and start<br />shopping fresh today! 🛒
          </p>
          {[
            { icon: '🎁', text: 'Fresh groceries daily' },
            { icon: '🔔', text: 'Real-time order tracking' },
            { icon: '💰', text: 'Best prices guaranteed' },
            { icon: '💚', text: 'M-Pesa payments' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.07)', borderRadius: '12px',
              padding: '12px 20px', marginBottom: '10px',
              border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left',
            }}>
              <span style={{ fontSize: '22px' }}>{f.icon}</span>
              <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '15px' }}>{f.text}</span>
            </div>
          ))}
          <div style={{ marginTop: '28px', color: '#64748b', fontSize: '13px' }}>
            📞 0716 613 176 &nbsp;•&nbsp; ✉️ shopnoory@gmail.com
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#fff',
        padding: '40px 24px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px', paddingTop: '20px' }}>

          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-1px' }}>
              Create your account ✨
            </h2>
            <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>Fill in your details to get started</p>
          </div>

          {error && (
            <div style={{
              background: '#fff5f5', border: '2px solid #fecaca',
              borderRadius: '12px', padding: '12px 16px', marginBottom: '16px',
              color: '#e94560', fontWeight: '700', fontSize: '14px',
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '14px' }}>

              <div>
                <label style={lbl}>Full Name *</label>
                <input
                  type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name" style={inp}
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                />
              </div>

              <div>
                <label style={lbl}>Email Address *</label>
                <input
                  type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com" style={inp}
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                />
              </div>

              <div>
                <label style={lbl}>Phone Number (M-Pesa)</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="0716 613 176" style={inp}
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                />
              </div>

              <div>
                <label style={lbl}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 6 characters"
                    style={{ ...inp, paddingRight: '48px' }}
                    onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label style={lbl}>Confirm Password *</label>
                <input
                  type="password" value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Re-enter password" style={inp}
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: loading ? '#ccc' : '#e94560',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', marginTop: '20px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(233,69,96,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? '⏳ Creating account...' : '🎉 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '20px', fontWeight: '500' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#e94560', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Login! 🔑
            </span>
          </p>

          <div style={{ marginTop: '16px', background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#16a34a', fontWeight: '700' }}>
              🏍️ Want to deliver for Noory?{' '}
              <span
                onClick={() => navigate('/driver-apply')}
                style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: '800' }}
              >
                Apply as a Driver →
              </span>
            </p>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .register-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Register;