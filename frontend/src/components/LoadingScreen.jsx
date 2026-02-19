import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) { setError('Please fill in all fields'); return; }
    try {
      setLoading(true);
      setError('');
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '14px 18px', fontSize: '15px',
    border: '2px solid #e2e8f0', borderRadius: '12px',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    background: '#f8f9fa', transition: 'all 0.2s', color: '#1a1a2e',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* LEFT PANEL - Branding */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background image overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&fit=crop") center/cover',
          opacity: 0.1,
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🛍️</div>
          <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#fff', margin: '0 0 12px', letterSpacing: '-2px', lineHeight: 1 }}>
            NOORY<br /><span style={{ color: '#e94560' }}>SHOP</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '18px', margin: '0 0 48px', lineHeight: 1.6 }}>
            Kenya's freshest groceries<br />delivered to your door 🇰🇪
          </p>

          {/* Feature points */}
          {[
            { icon: '⚡', text: 'Same day delivery' },
            { icon: '🥬', text: '500+ fresh products' },
            { icon: '💚', text: 'M-Pesa accepted' },
            { icon: '🏍️', text: 'Fast & reliable riders' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.07)', borderRadius: '12px',
              padding: '12px 20px', marginBottom: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ fontSize: '22px' }}>{f.icon}</span>
              <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '15px' }}>{f.text}</span>
            </div>
          ))}

          <div style={{ marginTop: '32px', color: '#64748b', fontSize: '13px' }}>
            📞 0716 613 176 &nbsp;•&nbsp; ✉️ shopnoory@gmail.com
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fff', padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-1px' }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#888', fontSize: '16px', margin: 0, fontWeight: '500' }}>
              Sign in to your Noory account
            </p>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '2px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#e94560', fontWeight: '700', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                Email or Name
              </label>
              <input
                type="text" value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter your email or username"
                style={inp}
                onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ ...inp, paddingRight: '50px' }}
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px', background: loading ? '#ccc' : '#e94560',
              color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px',
              fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s', marginBottom: '16px',
              boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? '⏳ Signing in...' : '🔑 Login Now'}
            </button>
          </form>

          {/* Driver login notice */}
          <div style={{ background: '#f0f9ff', border: '2px solid #bae6fd', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#0284c7', fontWeight: '600' }}>
              🏍️ <strong>Driver?</strong> Login with your Driver name and password starting with <code style={{ background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>Driver-</code>
            </p>
          </div>

          <p style={{ textAlign: 'center', color: '#888', fontSize: '15px', margin: 0, fontWeight: '500' }}>
            Don't have an account?{' '}
            <span onClick={() => navigate('/register')} style={{ color: '#e94560', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}>
              Create one! 🎉
            </span>
          </p>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
          div[style*="background: linear-gradient"] { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;