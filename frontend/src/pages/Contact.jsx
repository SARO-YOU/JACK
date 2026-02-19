import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', type: 'general' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const types = [
    { value: 'general', label: '💬 General Inquiry', color: '#3b82f6' },
    { value: 'complaint', label: '❗ Complaint', color: '#e94560' },
    { value: 'suggestion', label: '💡 Suggestion', color: '#f59e0b' },
    { value: 'driver_inquiry', label: '🏍️ Driver Application', color: '#22c55e' },
    { value: 'compliment', label: '⭐ Compliment', color: '#8b5cf6' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message || !form.subject) { setError('Please fill all required fields'); return; }
    try {
      setLoading(true); setError('');
      const res = await fetch('https://noory-backend.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.error || 'Failed to send message');
    } catch (e) {
      setError('Network error. Try again.');
    } finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '13px 16px', fontSize: '15px', border: '2px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: '#f8f9fa', transition: 'all 0.2s' };

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '60px 48px', textAlign: 'center', maxWidth: '460px', width: '90%' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 12px' }}>Message Sent!</h2>
        <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px' }}>
          Thank you <strong>{form.name}</strong>! We received your {form.type.replace('_', ' ')} and will respond soon.
        </p>
        <p style={{ color: '#888', fontSize: '13px', margin: '0 0 24px' }}>📧 shopnoory@gmail.com • 📞 0716 613 176</p>
        <button onClick={() => navigate('/')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit' }}>
          🏠 Back to Shop
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.3fr', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* LEFT */}
      <div style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop") center/cover', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>💬</div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#fff', margin: '0 0 12px', letterSpacing: '-1.5px' }}>
            GET IN<br /><span style={{ color: '#e94560' }}>TOUCH</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 40px', lineHeight: 1.6 }}>
            We love hearing from you!<br />Tell us anything 🇰🇪
          </p>

          {[
            { icon: '📧', label: 'Email Us', value: 'shopnoory@gmail.com', link: 'mailto:shopnoory@gmail.com' },
            { icon: '📞', label: 'Call Us', value: '0716 613 176', link: 'tel:+254716613176' },
            { icon: '⏰', label: 'Hours', value: 'Mon–Sat 8am–8pm' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px 18px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{c.icon}</span>
              <div>
                <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', margin: '0 0 2px', textTransform: 'uppercase' }}>{c.label}</p>
                {c.link ? (
                  <a href={c.link} style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>{c.value}</a>
                ) : (
                  <p style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '15px', margin: 0 }}>{c.value}</p>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: '24px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>What can you send us?</p>
            {['❗ Complaints', '💡 Suggestions', '⭐ Compliments', '🏍️ Driver Inquiries', '💬 Anything!'].map((t, i) => (
              <div key={i} style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', padding: '4px 0' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ background: '#fff', padding: '40px', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-1px' }}>Send us a message</h2>
            <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>We'll get back to you within 24 hours</p>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '2px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#e94560', fontWeight: '700', fontSize: '14px' }}>❌ {error}</div>
          )}

          {/* Type selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '13px' }}>Message Type *</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {types.map(t => (
                <button key={t.value} type="button" onClick={() => setForm({ ...form, type: t.value })}
                  style={{ padding: '8px 14px', borderRadius: '50px', border: `2px solid ${form.type === t.value ? t.color : '#e2e8f0'}`, background: form.type === t.value ? t.color : '#fff', color: form.type === t.value ? '#fff' : '#555', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' }}>Full Name *</label>
                <input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' }}>Email</label>
                <input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' }}>Phone</label>
                <input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0716 613 176"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' }}>Subject *</label>
                <input style={inp} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?"
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px' }}>Message *</label>
                <textarea style={{ ...inp, minHeight: '130px', resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your message here..."
                  onFocus={e => { e.target.style.borderColor = '#e94560'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8f9fa'; }} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? '#ccc' : '#e94560', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: '16px', boxShadow: '0 4px 15px rgba(233,69,96,0.4)' }}>
              {loading ? '⏳ Sending...' : '📨 Send Message'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>← Back to Shop</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;