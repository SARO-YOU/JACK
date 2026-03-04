import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(200);
  const [mpesaWaiting, setMpesaWaiting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchCart();
    fetchDeliveryFee();
  }, []);

  // ── fetch live delivery fee from admin settings ──────────────────────────
  const fetchDeliveryFee = async () => {
    try {
      const res = await fetch('https://noory-backend.onrender.com/api/settings/delivery-fee');
      if (res.ok) {
        const data = await res.json();
        if (data.delivery_fee) setDeliveryFee(Number(data.delivery_fee));
      }
    } catch (_) {}
  };

  // ── cart data ─────────────────────────────────────────────────────────────
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCartItems(response.data.cart_items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateItem(itemId, { quantity: newQuantity });
      fetchCart();
    } catch {
      alert('❌ Failed to update');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      fetchCart();
    } catch {
      alert('❌ Failed to remove');
    }
  };

  // ── place order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!deliveryLocation.trim()) { alert('❌ Please enter delivery location'); return; }
    if (!paymentMethod) { alert('❌ Please select payment method'); return; }

    // ── M-Pesa STK push ───────────────────────────────────────────────────
    if (paymentMethod === 'M-Pesa') {
      if (!phoneNumber.trim()) { alert('❌ Please enter M-Pesa phone number'); return; }
      try {
        setPlacingOrder(true);
        const mpesaResponse = await fetch('https://noory-backend.onrender.com/api/mpesa/stk-push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ phone_number: phoneNumber, amount: total, order_id: `ORD-${Date.now()}` }),
        });
        const mpesaResult = await mpesaResponse.json();
        if (mpesaResult.success) {
          setMpesaWaiting(true);
          setCountdown(15);
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) { clearInterval(countdownInterval); return 0; }
              return prev - 1;
            });
          }, 1000);
          setTimeout(async () => {
            try {
              const orderResponse = await orderAPI.create({
                delivery_location: deliveryLocation,
                payment_method: paymentMethod,
                transaction_id: mpesaResult.checkout_request_id,
                delivery_fee: deliveryFee,
              });
              if (orderResponse.data) {
                setMpesaWaiting(false);
                alert('✅ Payment successful! Order placed!');
                navigate('/orders');
              }
            } catch {
              setMpesaWaiting(false);
              alert('⚠️ Payment may still be processing. Check your orders.');
              navigate('/orders');
            }
          }, 15000);
        } else {
          alert('❌ M-Pesa failed: ' + mpesaResult.message);
        }
      } catch {
        alert('❌ Payment failed. Try again.');
      } finally {
        setPlacingOrder(false);
      }
      return;
    }

    // ── Cash / Card ───────────────────────────────────────────────────────
    if (paymentMethod !== 'Cash' && !transactionId.trim()) {
      alert('❌ Please enter transaction ID');
      return;
    }

    try {
      setPlacingOrder(true);
      const response = await orderAPI.create({
        delivery_location: deliveryLocation,
        payment_method: paymentMethod,
        transaction_id: transactionId || `CASH-${Date.now()}`,
        delivery_fee: deliveryFee,
      });
      if (response.data) {
        alert('✅ Order placed successfully!');
        navigate('/orders');
      }
    } catch {
      alert('❌ Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  // ── styles ────────────────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0',
    borderRadius: '12px', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.2s', background: '#f8f9fa',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── RESPONSIVE STYLES ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }

        .cart-header-actions { display:flex; gap:12px; }
        .cart-grid { display:grid; grid-template-columns:1fr 380px; gap:24px; align-items:start; }
        .cart-item { display:flex; gap:16px; align-items:center; flex-wrap:nowrap; }
        .cart-item-img { width:80px; height:80px; flex-shrink:0; }
        .cart-item-subtotal { min-width:100px; text-align:right; }
        .qty-controls { display:flex; align-items:center; gap:10px; flex-shrink:0; }

        @media (max-width:900px) {
          .cart-grid { grid-template-columns:1fr !important; }
        }
        @media (max-width:600px) {
          .cart-header-actions { flex-wrap:wrap; gap:8px; }
          .cart-header-actions button { font-size:12px !important; padding:8px 14px !important; }
          .cart-item { flex-wrap:wrap; }
          .cart-item-img { width:64px !important; height:64px !important; }
          .cart-item-subtotal { min-width:auto; flex:1; display:flex; justify-content:space-between; align-items:center; }
          .qty-controls { width:100%; justify-content:center; }
          .cart-main-title { font-size:20px !important; }
          .header-subtitle { display:none; }
          .checkout-panel { position:static !important; }
        }
        @media (max-width:400px) {
          .cart-item-info h3 { font-size:14px !important; }
        }
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header style={{ background: '#1a1a2e', color: '#fff', padding: '16px 20px', boxShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <h1 className="cart-main-title" style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: '#fff' }}>🛒 Shopping Cart</h1>
            <p className="header-subtitle" style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0', fontWeight: '600' }}>Review your items and checkout</p>
          </div>
          <div className="cart-header-actions">
            <button
              onClick={() => navigate('/')}
              style={{ background: 'transparent', border: '2px solid #e94560', color: '#e94560', padding: '10px 18px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}
            >← Continue Shopping</button>
            <button
              onClick={logout}
              style={{ background: '#e94560', border: 'none', color: '#fff', padding: '10px 18px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}
            >Logout</button>
          </div>
        </div>
      </header>

      {/* ── M-Pesa Overlay ────────────────────────────────────────────────── */}
      {mpesaWaiting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '36px 28px', textAlign: 'center', maxWidth: '340px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '56px', marginBottom: '14px', animation: 'pulse 1s ease-in-out infinite' }}>📱</div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px' }}>Check Your Phone!</h3>
            <p style={{ color: '#555', fontSize: '14px', margin: '0 0 16px', lineHeight: '1.5' }}>
              M-Pesa prompt sent to <strong>{phoneNumber}</strong>. Enter your PIN to complete.
            </p>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>Time remaining</p>
              <p style={{ fontSize: '36px', fontWeight: '900', color: '#e94560', margin: 0 }}>{countdown}s</p>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Do not close this window</p>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>⏳</div>
            <p style={{ fontSize: '18px', color: '#555', fontWeight: '700' }}>Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '64px', marginBottom: '18px' }}>🛒</div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 10px' }}>Your cart is empty!</h2>
            <p style={{ color: '#888', fontSize: '15px', margin: '0 0 22px' }}>Add some fresh products to get started</p>
            <button
              onClick={() => navigate('/')}
              style={{ background: '#e94560', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
            >🛍️ Start Shopping</button>
          </div>
        ) : (
          <div className="cart-grid">

            {/* ── CART ITEMS ─────────────────────────────────────────────── */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 18px' }}>
                Your Items ({cartItems.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item" style={{ background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
                    {/* Image */}
                    <div className="cart-item-img" style={{ borderRadius: '12px', overflow: 'hidden', background: '#f8f9fa', flexShrink: 0 }}>
                      <img
                        src={item.product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop'}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop'}
                      />
                    </div>
                    {/* Info */}
                    <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '10px', color: '#e94560', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px' }}>{item.product.category}</p>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</h3>
                      <p style={{ fontSize: '16px', fontWeight: '900', color: '#e94560', margin: 0 }}>KES {item.product.price}</p>
                    </div>
                    {/* Qty */}
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #e2e8f0', background: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>−</button>
                      <span style={{ fontSize: '17px', fontWeight: '900', color: '#1a1a2e', minWidth: '28px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #e94560', background: '#e94560', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>+</button>
                    </div>
                    {/* Subtotal */}
                    <div className="cart-item-subtotal">
                      <p style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 6px' }}>KES {item.product.price * item.quantity}</p>
                      <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '12px', fontWeight: '700', padding: 0, whiteSpace: 'nowrap' }}>🗑️ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CHECKOUT PANEL ─────────────────────────────────────────── */}
            <div className="checkout-panel" style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: '16px', border: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px', paddingBottom: '14px', borderBottom: '2px solid #f0f0f0' }}>Order Summary</h2>

              {/* Delivery Location */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '7px', fontSize: '13px' }}>📍 Delivery Location *</label>
                <input type="text" value={deliveryLocation} onChange={e => setDeliveryLocation(e.target.value)} placeholder="e.g., Westlands, Nairobi"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '7px', fontSize: '13px' }}>💳 Payment Method *</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                  <option value="">Select payment method</option>
                  <option value="M-Pesa">💚 M-Pesa (Recommended)</option>
                  <option value="Card">💳 Credit/Debit Card</option>
                  <option value="Cash">💵 Cash on Delivery</option>
                </select>
              </div>

              {paymentMethod === 'M-Pesa' && (
                <div style={{ marginBottom: '16px', background: '#f0fdf4', borderRadius: '12px', padding: '14px', border: '2px solid #22c55e' }}>
                  <label style={{ display: 'block', fontWeight: '700', color: '#166534', marginBottom: '7px', fontSize: '13px' }}>📱 M-Pesa Phone Number *</label>
                  <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g., 0712 345 678"
                    style={{ ...inputStyle, borderColor: '#22c55e', background: '#fff' }} />
                  <p style={{ color: '#16a34a', fontSize: '12px', fontWeight: '600', margin: '7px 0 0' }}>✅ You'll receive a prompt to enter your PIN</p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '7px', fontSize: '13px' }}>🔢 Transaction ID *</label>
                  <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="Enter your transaction ID"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#e94560'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              )}

              {/* Price Summary */}
              <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Subtotal ({cartItems.length} items)</span>
                  <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>KES {subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '2px dashed #e2e8f0' }}>
                  <span style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Delivery Fee</span>
                  <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>KES {deliveryFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#1a1a2e', fontSize: '17px', fontWeight: '900' }}>Total</span>
                  <span style={{ color: '#e94560', fontSize: '20px', fontWeight: '900' }}>KES {total}</span>
                </div>
              </div>

              {/* Place Order */}
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || mpesaWaiting}
                style={{
                  width: '100%', padding: '15px', borderRadius: '50px',
                  background: placingOrder || mpesaWaiting ? '#ccc' : '#e94560',
                  color: '#fff', border: 'none', fontSize: '16px', fontWeight: '900',
                  cursor: placingOrder || mpesaWaiting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s', fontFamily: 'inherit',
                  boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
                }}
              >
                {placingOrder ? '⏳ Processing...' :
                  mpesaWaiting ? `📱 Waiting... ${countdown}s` :
                  paymentMethod === 'M-Pesa' ? '💚 Pay with M-Pesa' :
                  '🚀 Place Order'}
              </button>

              {paymentMethod === 'M-Pesa' && (
                <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', margin: '10px 0 0', fontWeight: '600' }}>🔒 Secured by Safaricom M-Pesa</p>
              )}
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', margin: '10px 0 0' }}>By placing order you agree to our Terms & Conditions</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;