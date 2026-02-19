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
    setError('');
    if (!identifier.trim()) { setError('Please enter your email or name'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }
    setLoading(true);
    try {
      const data = await login(identifier.trim(), password);
      if (data.user?.role === 'admin') navigate('/admin');
      else if (data.user?.role === 'driver') navigate('/driver-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '14px 18px', fontSize: '15px',
    border: '2px solid #e2e8f0', borderRadius: '12px', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', background: '#f8f9fa',
    transition: 'all 0.2s', color: '#1a1a2e',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* LEFT PANEL - hidden on mobile */}
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '60px 40px', position: 'relative',
        overflow: 'hidden',
      }}
        className="login-left-panel"
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&fit=crop") center/cover',
          opacity: 0.15,
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '340px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🛍️</div>
          <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#fff', margin: '0 0 12px', letterSpacing: '-2px', lineHeight: 1 }}>
            NOORY<br /><span style={{ color: '#e94560' }}>SHOP</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '17px', margin: '0 0 40px', lineHeight: 1.6 }}>
            Kenya's freshest groceries<br />delivered to your door
          </p>
          {[
            { icon: '⚡', text: 'Same day delivery' },
            { icon: '🥬', text: '500+ fresh products' },
            { icon: '💚', text: 'M-Pesa accepted' },
            { icon: '🏍️', text: 'Fast reliable riders' },
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
            📞 0716 613 176 · shopnoory@gmail.com
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#fff', padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-1px' }}>
              Welcome back
            </h2>
            <p style={{ color: '#888', fontSize: '16px', margin: 0, fontWeight: '500' }}>
              Sign in to your Noory account
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fff5f5', border: '2px solid #fecaca',
              borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
              color: '#e94560', fontWeight: '700', fontSize: '14px',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                Email or Name
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => { setIdentifier(e.target.value); setError(''); }}
                placeholder="Enter your email or username"
                style={inp}
                autoComplete="username"
                onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  style={{ ...inp, paddingRight: '50px' }}
                  autoComplete="current-password"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', fontSize: '18px',
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '16px',
                background: loading ? '#ccc' : '#e94560',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
                marginBottom: '20px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(233,69,96,0.4)',
              }}
            >
              {loading ? '⏳ Signing in...' : 'Login Now'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#888', fontSize: '15px', margin: '0 0 24px', fontWeight: '500' }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: '#e94560', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Create one
            </span>
          </p>

          <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
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
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;