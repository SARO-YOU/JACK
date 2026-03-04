"""
email_utils.py  —  Noory Shop
Instead of sending via SMTP (blocked by Render free tier),
this module queues emails into the `email_queue` database table.
The Railway email_worker.py picks them up and sends within 30 seconds.
"""

import os
from datetime import datetime
from models import db

# ── Kept for backwards compat — still used by email_worker directly ───────────
EMAIL_USER = os.environ.get('EMAIL_USER', 'shopnoorey@gmail.com')
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'shopnoorey@gmail.com')
YEAR       = datetime.utcnow().year


def _queue(to_email, subject, body_text, body_html=None):
    """Insert an email into email_queue — Railway worker will send it."""
    if not to_email:
        print("⚠️  No email address — skipping queue")
        return False
    try:
        db.session.execute(
            db.text("""
                INSERT INTO email_queue (to_email, subject, body_text, body_html, status)
                VALUES (:to_email, :subject, :body_text, :body_html, 'pending')
            """),
            {'to_email': to_email, 'subject': subject,
             'body_text': body_text, 'body_html': body_html}
        )
        db.session.commit()
        print(f"📬 Queued email to {to_email}: {subject}")
        return True
    except Exception as e:
        print(f"❌ Failed to queue email to {to_email}: {e}")
        db.session.rollback()
        return False


# ═══════════════════════════════════════════════════════════════════════════════
# WELCOME EMAIL
# ═══════════════════════════════════════════════════════════════════════════════

def send_welcome_email(user_email, user_name):
    subject   = "Welcome to Noory Shop!"
    body_text = f"Hello {user_name},\n\nWelcome to Noory Shop! Your account has been created.\n\nBest,\nNoory Shop Team"
    body_html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:28px 32px;text-align:center;">
          <div style="font-size:26px;font-weight:900;color:#fff;">NOORY SHOP</div>
          <div style="color:#94a3b8;font-size:12px;margin-top:6px;">Fresh groceries delivered</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 12px;">Welcome, {user_name}!</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">Your account has been successfully created. Browse our fresh products and place orders delivered right to your door.</p>
          <div style="background:#f0fdf4;border-radius:12px;padding:16px;border-left:4px solid #22c55e;margin-bottom:20px;">
            <p style="color:#16a34a;font-size:14px;font-weight:700;margin:0;">Account created successfully ✓</p>
          </div>
          <p style="color:#888;font-size:13px;margin:0;">Happy shopping!<br><strong>The Noory Shop Team</strong></p>
        </td></tr>
        <tr><td style="background:#f8f9fa;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">© {YEAR} Noory Shop</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""
    return _queue(user_email, subject, body_text, body_html)


# ═══════════════════════════════════════════════════════════════════════════════
# ORDER CONFIRMATION
# ═══════════════════════════════════════════════════════════════════════════════

def send_order_confirmation(user_email, user_name, order_id, total_price,
                            order_items=None, delivery_fee=0,
                            delivery_location='', payment_method='',
                            created_at=None):
    subject   = f"Order #{order_id} Confirmed - Noory Shop"
    body_text = f"Hi {user_name},\n\nYour order #{order_id} is confirmed!\nTotal: KES {total_price}\n\nThank you,\nNoory Shop"

    items_html = ''
    if order_items:
        for item in order_items:
            items_html += f"""
            <tr>
              <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">{item.get('name','')}</td>
              <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:center;">x{item.get('qty',1)}</td>
              <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:right;font-weight:700;">KES {item.get('total', item.get('price',0))}</td>
            </tr>"""
    else:
        items_html = """<tr><td colspan="3" style="padding:14px;font-size:14px;color:#888;text-align:center;">See your account for item details</td></tr>"""

    subtotal = float(total_price) - float(delivery_fee)
    date_str = created_at.strftime('%d %b %Y, %I:%M %p') if (created_at and hasattr(created_at, 'strftime')) else datetime.utcnow().strftime('%d %b %Y, %I:%M %p')

    body_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:28px 32px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">NOORY SHOP</div>
          <div style="color:#94a3b8;font-size:12px;margin-top:6px;font-weight:600;letter-spacing:1px;">ORDER CONFIRMED</div>
        </td></tr>
        <tr><td style="background:#e94560;padding:14px 32px;text-align:center;">
          <span style="color:#fff;font-size:15px;font-weight:900;letter-spacing:1px;">ORDER #{order_id}</span>
          <span style="color:rgba(255,255,255,0.75);font-size:13px;margin-left:12px;">{date_str}</span>
        </td></tr>
        <tr><td style="padding:28px 32px 0;">
          <p style="font-size:16px;color:#1a1a2e;font-weight:700;margin:0 0 6px;">Hi {user_name},</p>
          <p style="font-size:14px;color:#666;line-height:1.6;margin:0;">Thank you for your order! Your items are being prepared for delivery.</p>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <div style="background:#f8f9fa;border-radius:14px;overflow:hidden;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <thead>
                <tr style="background:#1a1a2e;">
                  <th style="padding:12px 14px;text-align:left;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Item</th>
                  <th style="padding:12px 14px;text-align:center;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Qty</th>
                  <th style="padding:12px 14px;text-align:right;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Total</th>
                </tr>
              </thead>
              <tbody>
                {items_html}
                <tr>
                  <td colspan="2" style="padding:10px 14px;font-size:13px;color:#888;font-weight:600;">Subtotal</td>
                  <td style="padding:10px 14px;text-align:right;font-size:13px;color:#333;font-weight:700;">KES {subtotal:.0f}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:10px 14px;font-size:13px;color:#888;font-weight:600;">Delivery Fee</td>
                  <td style="padding:10px 14px;text-align:right;font-size:13px;color:#333;font-weight:700;">KES {delivery_fee}</td>
                </tr>
                <tr style="background:#fff5f5;">
                  <td colspan="2" style="padding:14px;font-size:16px;color:#1a1a2e;font-weight:900;">TOTAL</td>
                  <td style="padding:14px;text-align:right;font-size:20px;color:#e94560;font-weight:900;">KES {total_price}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <div style="background:#f0f9ff;border-radius:14px;padding:18px;border-left:4px solid #3b82f6;">
            <p style="font-size:12px;font-weight:900;color:#1a1a2e;margin:0 0 10px;text-transform:uppercase;">Delivery Details</p>
            <p style="font-size:14px;color:#555;margin:0 0 5px;"><strong>Location:</strong> {delivery_location or 'N/A'}</p>
            <p style="font-size:14px;color:#555;margin:0 0 5px;"><strong>Payment:</strong> {payment_method or 'N/A'}</p>
            <p style="font-size:14px;color:#22c55e;font-weight:700;margin:0;"><strong>Status:</strong> Confirmed — driver being assigned</p>
          </div>
        </td></tr>
        <tr><td style="background:#f8f9fa;padding:18px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="font-size:13px;color:#888;margin:0 0 5px;">Questions? Email us: shopnoorey@gmail.com</p>
          <p style="font-size:12px;color:#94a3b8;margin:0;">© {YEAR} Noory Shop</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""

    return _queue(user_email, subject, body_text, body_html)


# ═══════════════════════════════════════════════════════════════════════════════
# DRIVER APPROVED
# ═══════════════════════════════════════════════════════════════════════════════

def send_driver_approved_email(driver_email, driver_name, driver_identity, secret_key):
    subject   = "Driver Application Approved - Noory Shop"
    body_text = f"Hello {driver_name},\n\nYour application is approved!\nDriver ID: {driver_identity}\nPassword: {secret_key}\n\nNoory Shop Team"
    body_html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:24px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:#fff;">Driver Approved! 🎉</div>
          <div style="color:#94a3b8;font-size:12px;margin-top:4px;">Noory Shop — Driver Portal</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="font-size:16px;color:#1a1a2e;font-weight:700;margin:0 0 10px;">Congratulations {driver_name}!</p>
          <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 20px;">Your driver application has been approved. Here are your login credentials — keep them safe!</p>
          <div style="background:#f0fdf4;border-radius:12px;padding:18px;border:2px solid #22c55e;margin-bottom:20px;">
            <p style="font-size:12px;font-weight:900;color:#166534;text-transform:uppercase;margin:0 0 10px;">Your Login Details</p>
            <p style="font-size:15px;color:#1a1a2e;margin:0 0 8px;"><strong>Driver ID:</strong> {driver_identity}</p>
            <p style="font-size:15px;color:#1a1a2e;margin:0;"><strong>Password:</strong> {secret_key}</p>
          </div>
          <p style="font-size:13px;color:#888;margin:0;">Log in to your driver dashboard to start accepting deliveries.</p>
        </td></tr>
        <tr><td style="background:#f8f9fa;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">© {YEAR} Noory Shop</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""
    return _queue(driver_email, subject, body_text, body_html)


# ═══════════════════════════════════════════════════════════════════════════════
# PASSWORD RESET
# ═══════════════════════════════════════════════════════════════════════════════

def send_password_reset_email(user_email, user_name, reset_token):
    reset_link = f"https://shop.nooreyshop.abrdns.com/reset-password?token={reset_token}"
    subject    = "Password Reset Request - Noory Shop"
    body_text  = f"Hello {user_name},\n\nReset your password:\n{reset_link}\n\nIgnore if you didn't request this."
    body_html  = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:24px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:#fff;">Password Reset</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="font-size:15px;color:#1a1a2e;font-weight:700;margin:0 0 10px;">Hello {user_name},</p>
          <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 20px;">Click the button below to reset your Noory Shop password.</p>
          <div style="text-align:center;margin-bottom:20px;">
            <a href="{reset_link}" style="background:#e94560;color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">Reset Password</a>
          </div>
          <p style="font-size:13px;color:#888;margin:0;">If you didn't request this, ignore this email.</p>
        </td></tr>
        <tr><td style="background:#f8f9fa;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">© {YEAR} Noory Shop</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""
    return _queue(user_email, subject, body_text, body_html)


# ═══════════════════════════════════════════════════════════════════════════════
# DRIVER NEW ORDER NOTIFICATION
# ═══════════════════════════════════════════════════════════════════════════════

def send_driver_new_order_email(driver_email, driver_name, order_id,
                                customer_name, delivery_location,
                                total_price, delivery_fee):
    driver_cut = round((delivery_fee or 0) * 0.6)
    subject    = f"New Delivery Order #{order_id} - Noory Shop"
    body_text  = f"Hi {driver_name},\nNew order #{order_id} for {customer_name} to {delivery_location}.\nYour cut: KES {driver_cut}"
    body_html  = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:24px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:#fff;">New Delivery Assignment 🛵</div>
          <div style="color:#94a3b8;font-size:12px;margin-top:4px;">Noory Shop — Driver Portal</div>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <p style="font-size:15px;color:#1a1a2e;font-weight:700;margin:0 0 8px;">Hi {driver_name},</p>
          <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 18px;">A new delivery order is waiting for you!</p>
          <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:14px;">
            <p style="font-size:14px;color:#333;margin:0 0 6px;"><strong>Order #:</strong> {order_id}</p>
            <p style="font-size:14px;color:#333;margin:0 0 6px;"><strong>Customer:</strong> {customer_name}</p>
            <p style="font-size:14px;color:#333;margin:0 0 6px;"><strong>Deliver to:</strong> {delivery_location}</p>
            <p style="font-size:14px;color:#333;margin:0 0 6px;"><strong>Order Total:</strong> KES {total_price}</p>
            <p style="font-size:15px;color:#22c55e;font-weight:900;margin:0;"><strong>Your Earnings:</strong> KES {driver_cut}</p>
          </div>
        </td></tr>
        <tr><td style="background:#f8f9fa;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">© {YEAR} Noory Shop</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""
    return _queue(driver_email, subject, body_text, body_html)