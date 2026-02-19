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
  const [deliveryFee] = useState(200);
  const [mpesaWaiting, setMpesaWaiting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

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
    } catch (error) {
      alert('❌ Failed to update');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      fetchCart();
    } catch (error) {
      alert('❌ Failed to remove');
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryLocation.trim()) { alert('❌ Please enter delivery location'); return; }
    if (!paymentMethod) { alert('❌ Please select payment method'); return; }

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
            } catch (error) {
              setMpesaWaiting(false);
              alert('⚠️ Payment may still be processing. Check your orders.');
              navigate('/orders');
            }
          }, 15000);
        } else {
          alert('❌ M-Pesa failed: ' + mpesaResult.message);
        }
      } catch (error) {
        alert('❌ Payment failed. Try again.');
      } finally {
        setPlacingOrder(false);
      }
      return;
    }

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
    } catch (error) {
      alert('❌ Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0',
    borderRadius: '12px', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.2s', background: '#f8f9fa'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* HEADER */}
      <header style={{ background: '#1a1a2e', color: '#fff', padding: '16px 24px', boxShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#fff' }}>
              🛒 Shopping Cart
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0', fontWeight: '600' }}>
              Review your items and checkout
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'transparent', border: '2px solid #e94560', color: '#e94560', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e94560'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e94560'; }}
            >
              ← Continue Shopping
            </button>
            <button
              onClick={logout}
              style={{ background: '#e94560', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* M-Pesa Waiting Overlay */}
      {mpesaWaiting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', textAlign: 'center', maxWidth: '360px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px', animation: 'pulse 1s ease-in-out infinite' }}>📱</div>
            <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px' }}>Check Your Phone!</h3>
            <p style={{ color: '#555', fontSize: '15px', margin: '0 0 16px', lineHeight: '1.5' }}>
              An M-Pesa prompt has been sent to <strong>{phoneNumber}</strong>. Enter your PIN to complete payment.
            </p>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ color: '#888', fontSize: '13px', margin: '0 0 4px' }}>Time remaining</p>
              <p style={{ fontSize: '36px', fontWeight: '900', color: '#e94560', margin: 0 }}>{countdown}s</p>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Do not close this window</p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>⏳</div>
            <p style={{ fontSize: '20px', color: '#555', fontWeight: '700' }}>Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '70px', marginBottom: '20px' }}>🛒</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 12px' }}>Your cart is empty!</h2>
            <p style={{ color: '#888', fontSize: '16px', margin: '0 0 24px' }}>Add some fresh products to get started</p>
            <button
              onClick={() => navigate('/')}
              style={{ background: '#e94560', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
            >
              🛍️ Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

            {/* CART ITEMS */}
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px' }}>
                Your Items ({cartItems.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid #f0f0f0' }}>
                    {/* Image */}
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: '#f8f9fa' }}>
                      <img
                        src={item.product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop'}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop'}
                      />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '11px', color: '#e94560', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>{item.product.category}</p>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 6px' }}>{item.product.name}</h3>
                      <p style={{ fontSize: '18px', fontWeight: '900', color: '#e94560', margin: 0 }}>KES {item.product.price} each</p>
                    </div>
                    {/* Quantity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e2e8f0', background: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}
                      >−</button>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e94560', background: '#e94560', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}
                      >+</button>
                    </div>
                    {/* Subtotal */}
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 8px' }}>KES {item.product.price * item.quantity}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '13px', fontWeight: '700', padding: 0 }}
                      >🗑️ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHECKOUT PANEL */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: '20px', border: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 24px', paddingBottom: '16px', borderBottom: '2px solid #f0f0f0' }}>
                Order Summary
              </h2>

              {/* Delivery Location */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                  📍 Delivery Location *
                </label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  placeholder="e.g., Westlands, Nairobi"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                  💳 Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="">Select payment method</option>
                  <option value="M-Pesa">💚 M-Pesa (Recommended)</option>
                  <option value="Card">💳 Credit/Debit Card</option>
                  <option value="Cash">💵 Cash on Delivery</option>
                </select>
              </div>

              {/* M-Pesa Phone */}
              {paymentMethod === 'M-Pesa' && (
                <div style={{ marginBottom: '18px', background: '#f0fdf4', borderRadius: '12px', padding: '16px', border: '2px solid #22c55e' }}>
                  <label style={{ display: 'block', fontWeight: '700', color: '#166534', marginBottom: '8px', fontSize: '14px' }}>
                    📱 M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 0712 345 678"
                    style={{ ...inputStyle, borderColor: '#22c55e', background: '#fff' }}
                  />
                  <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: '600', margin: '8px 0 0' }}>
                    ✅ You'll receive a prompt on this number to enter your PIN
                  </p>
                </div>
              )}

              {/* Transaction ID for Card */}
              {paymentMethod === 'Card' && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                    🔢 Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#e94560'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              )}

              {/* Price Summary */}
              <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#555', fontSize: '15px', fontWeight: '600' }}>Subtotal ({cartItems.length} items)</span>
                  <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>KES {subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '14px', borderBottom: '2px dashed #e2e8f0' }}>
                  <span style={{ color: '#555', fontSize: '15px', fontWeight: '600' }}>Delivery Fee</span>
                  <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>KES {deliveryFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '900' }}>Total</span>
                  <span style={{ color: '#e94560', fontSize: '22px', fontWeight: '900' }}>KES {total}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || mpesaWaiting}
                style={{
                  width: '100%', padding: '16px', borderRadius: '50px',
                  background: placingOrder || mpesaWaiting ? '#ccc' : '#e94560',
                  color: '#fff', border: 'none', fontSize: '17px', fontWeight: '900',
                  cursor: placingOrder || mpesaWaiting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s', fontFamily: 'inherit',
                  boxShadow: '0 4px 15px rgba(233,69,96,0.4)'
                }}
                onMouseEnter={e => { if (!placingOrder && !mpesaWaiting) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {placingOrder ? '⏳ Processing...' :
                  mpesaWaiting ? `📱 Waiting for payment... ${countdown}s` :
                  paymentMethod === 'M-Pesa' ? '💚 Pay with M-Pesa' :
                  '🚀 Place Order'}
              </button>

              {paymentMethod === 'M-Pesa' && (
                <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', margin: '12px 0 0', fontWeight: '600' }}>
                  🔒 Secured by Safaricom M-Pesa
                </p>
              )}

              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', margin: '12px 0 0' }}>
                By placing order you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;