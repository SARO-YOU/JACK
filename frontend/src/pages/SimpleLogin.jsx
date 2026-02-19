import { useState } from 'react';

const SimpleLogin = () => {
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      setResult('Sending request...');
      
      const response = await fetch('https://noory-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier: 'Admin', 
          password: 'ITSALOTOFWORKMAN' 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult('SUCCESS: ' + JSON.stringify(data, null, 2));
      } else {
        setResult('ERROR: ' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setResult('CATCH ERROR: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'monospace' }}>
      <h1>Simple Login Test</h1>
      <button 
        onClick={testLogin}
        style={{ 
          padding: '20px 40px', 
          fontSize: '18px', 
          background: 'blue', 
          color: 'white', 
          border: 'none', 
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        TEST LOGIN (Admin)
      </button>
      
      <pre style={{ 
        background: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}>
        {result || 'Click the button to test'}
      </pre>
    </div>
  );
};

export default SimpleLogin;