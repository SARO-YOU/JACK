import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkingLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const doLogin = async () => {
    setMessage('Sending request...');
    
    try {
      const res = await fetch('https://noory-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('SUCCESS! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setMessage('ERROR: ' + (data.error || 'Login failed'));
      }
    } catch (error) {
      setMessage('ERROR: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>WORKING LOGIN</h1>
      
      <input
        type="text"
        placeholder="Email or Name"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '10px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '20px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
      />
      
      <button
        onClick={doLogin}
        style={{ width: '100%', padding: '15px', background: 'blue', color: 'white', border: 'none', fontSize: '18px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}
      >
        LOGIN
      </button>

      {message && (
        <div style={{ marginTop: '20px', padding: '15px', background: message.includes('SUCCESS') ? '#dfd' : '#fdd', borderRadius: '8px', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', background: '#ffe', border: '2px solid #cc9', borderRadius: '8px' }}>
        <strong>Test Admin Login:</strong><br/>
        Username: Admin<br/>
        Password: ITSALOTOFWORKMAN
      </div>

      <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer', width: '100%', borderRadius: '8px' }}>
        Back to Shop
      </button>
    </div>
  );
};

export default WorkingLogin;