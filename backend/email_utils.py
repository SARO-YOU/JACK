import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config

def send_email(to_email, subject, body, html=None):
    """Send email using Gmail SMTP"""
    try:
        # Skip if email credentials not configured
        if not Config.EMAIL_USER or not Config.EMAIL_PASSWORD:
            print(f"⚠️ Email credentials not configured - skipping email to {to_email}")
            return False
        
        # Set a timeout to prevent hanging
        import socket
        socket.setdefaulttimeout(10)  # 10 second timeout
        
        msg = MIMEMultipart('alternative')
        msg['From'] = Config.EMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = subject

        # Add plain text part
        msg.attach(MIMEText(body, 'plain'))

        # Add HTML part if provided
        if html:
            msg.attach(MIMEText(html, 'html'))

        # Connect to SMTP server with timeout
        server = smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT, timeout=10)
        server.starttls()
        server.login(Config.EMAIL_USER, Config.EMAIL_PASSWORD)

        # Send email
        server.send_message(msg)
        server.quit()

        print(f"✅ Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Error sending email to {to_email}: {str(e)}")
        return False


def send_welcome_email(user_email, user_name):
    """Send welcome email to new user"""
    subject = "Welcome to Noory Shop!"
    body = f"""
    Hello {user_name},

    Welcome to Noory Shop! Your account has been successfully created.

    You can now browse our products and place orders.

    Best regards,
    Noory Shop Team
    """

    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Welcome to Noory Shop!</h2>
            <p>Hello {user_name},</p>
            <p>Your account has been successfully created.</p>
            <p>You can now browse our products and place orders.</p>
            <br>
            <p>Best regards,<br>Noory Shop Team</p>
        </body>
    </html>
    """

    return send_email(user_email, subject, body, html)


def send_order_confirmation(user_email, user_name, order_id, total_price):
    """Send order confirmation email"""
    subject = f"Order Confirmation - #{order_id}"
    body = f"""
    Hello {user_name},

    Your order #{order_id} has been confirmed!

    Total Amount: KES {total_price}

    You will receive updates on your order status.

    Best regards,
    Noory Shop Team
    """
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Order Confirmation</h2>
            <p>Hello {user_name},</p>
            <p>Your order <strong>#{order_id}</strong> has been confirmed!</p>
            <p><strong>Total Amount:</strong> KES {total_price}</p>
            <p>You will receive updates on your order status.</p>
            <br>
            <p>Best regards,<br>Noory Shop Team</p>
        </body>
    </html>
    """

    return send_email(user_email, subject, body, html)


def send_driver_approved_email(driver_email, driver_name, driver_identity, secret_key):
    """Send driver approval email"""
    subject = "Driver Application Approved!"
    body = f"""
    Hello {driver_name},

    Congratulations! Your driver application has been approved.

    Your Login Credentials:
    Driver Identity: {driver_identity}
    Secret Key: {secret_key}
    
    Please keep these credentials safe.

    Best regards,
    Noory Shop Team
    """

    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Driver Application Approved!</h2>
            <p>Hello {driver_name},</p>
            <p>Congratulations! Your driver application has been approved.</p>
            <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0;">
                <h3>Your Login Credentials:</h3>
                <p><strong>Driver Identity:</strong> {driver_identity}</p>
                <p><strong>Secret Key:</strong> {secret_key}</p>
            </div>
            <p style="color: red;"><strong>Please keep these credentials safe.</strong></p>
            <br>
            <p>Best regards,<br>Noory Shop Team</p>
        </body>
    </html>
    """

    return send_email(driver_email, subject, body, html)


def send_password_reset_email(user_email, user_name, reset_token):
    """Send password reset email"""
    reset_link = f"https://shop.nooreyshop.abrdns.com/reset-password?token={reset_token}"

    subject = "Password Reset Request"
    body = f"""
    Hello {user_name},

    You requested a password reset for your Noory Shop account.

    Click the link below to reset your password:
    {reset_link}

    If you didn't request this, please ignore this email.

    Best regards,
    Noory Shop Team
    """

    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset Request</h2>
            <p>Hello {user_name},</p>
            <p>You requested a password reset for your Noory Shop account.</p>
            <p>
                <a href="{reset_link}"
                   style="background-color: #4CAF50; color: white; padding: 10px 20px;
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reset Password
                </a>
            </p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Best regards,<br>Noory Shop Team</p>
        </body>
    </html>
    """

    return send_email(user_email, subject, body, html)