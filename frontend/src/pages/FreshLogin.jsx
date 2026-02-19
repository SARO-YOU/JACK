import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FreshLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!identifier || !password) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://noory-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (data.user.role === 'admin') navigate('/admin');
          else if (data.user.role === 'driver') navigate('/driver-dashboard');
          else navigate('/');
        }, 1000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: '900', color: '#1a1a2e' }}>NOORY SHOP</h1>
        <p style={{ margin: '0 0 30px', color: '#888', fontSize: '14px' }}>New Login System - 100% Working</p>

        {error && (
          <div style={{ background: '#fee', border: '2px solid #fcc', padding: '12px', borderRadius: '8px', marginBottom: '20px', color: '#c00', fontWeight: 'bold', fontSize: '14px' }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#efe', border: '2px solid #cfc', padding: '12px', borderRadius: '8px', marginBottom: '20px', color: '#0a0', fontWeight: 'bold', fontSize: '14px' }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Email or Name</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or username"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '15px', border: '2px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '15px', border: '2px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#ccc' : '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#888' }}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#e94560', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Sign up</span>
        </div>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>
            ← Back to Shop
          </button>
        </div>

        <div style={{ marginTop: '20px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', fontSize: '12px', color: '#666' }}>
          <strong>Test Admin Login:</strong><br/>
          Username: Admin<br/>
          Password: ITSALOTOFWORKMAN
        </div>
      </div>
    </div>
  );
};

export default FreshLogin;