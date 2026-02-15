from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from datetime import datetime, timedelta
import secrets
import os

from config import Config
from models import (
    db, User, Driver, Product, CartItem, Order, OrderItem,
    CustomerFeedback, DriverFeedback, DriverApplication
)
from email_utils import (
    send_welcome_email, send_order_confirmation,
    send_driver_approved_email, send_password_reset_email
)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app, resources={r"/*": {"origins": "*"}})
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)




# ============================================
# AUTHENTICATION ROUTES
# ============================================

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new customer"""
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')
        
        # Validation
        if not all([name, email, password]):
            return jsonify({'error': 'Name, email and password are required'}), 400
        
        # Check if admin name
        if name in Config.ALLOWED_ADMIN_NAMES:
            return jsonify({'error': 'This name is reserved'}), 400
        
        # Check if email exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            name=name,
            email=email,
            phone=phone,
            role='customer'
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Send welcome email (non-blocking)
        try:
            send_welcome_email(email, name)
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Registration successful',
            'token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_details = traceback.format_exc()
        print(f"Registration Error: {error_details}")
        return jsonify({'error': str(e), 'details': error_details}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login for customers, drivers, and admins"""
    try:
        data = request.get_json()
        identifier = data.get('identifier')  # Can be email, name, or driver_identity
        password = data.get('password')
        
        if not all([identifier, password]):
            return jsonify({'error': 'Identifier and password are required'}), 400
        
        # Check if admin login
        if identifier in Config.ALLOWED_ADMIN_NAMES and password == Config.ADMIN_PASSWORD:
            # Create temporary admin user
            admin_user = {
                'id': 0,
                'name': identifier,
                'email': 'admin@noory.com',
                'role': 'admin'
            }
            access_token = create_access_token(
                identity="0",
                additional_claims={'role': 'admin', 'name': identifier}
            )
            return jsonify({
                'message': 'Admin login successful',
                'token': access_token,
                'user': admin_user
            }), 200
        
        # Check if driver login (format: Driver-1)
        if identifier.startswith('Driver-'):
            driver = Driver.query.filter_by(driver_identity=identifier).first()
            if driver and driver.secret_key == password and driver.approved:
                access_token = create_access_token(
                    identity=str(driver.user_id),
                    additional_claims={'role': 'driver', 'driver_id': driver.id}
                )
                return jsonify({
                    'message': 'Driver login successful',
                    'token': access_token,
                    'user': driver.user.to_dict(),
                    'driver': driver.to_dict()
                }), 200
            else:
                return jsonify({'error': 'Invalid driver credentials'}), 401
        
        # Regular user login (email)
        user = User.query.filter_by(email=identifier).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role}
        )
        
        response_data = {
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }
        
        # If user is a driver, include driver info
        if user.role == 'driver' and user.driver_profile:
            response_data['driver'] = user.driver_profile.to_dict()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        response_data = {'user': user.to_dict()}
        
        if user.role == 'driver' and user.driver_profile:
            response_data['driver'] = user.driver_profile.to_dict()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'email' in data:
            # Check if email already exists
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user.id:
                return jsonify({'error': 'Email already in use'}), 400
            user.email = data['email']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================
# PRODUCT ROUTES
# ============================================

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products or filter by category"""
    try:
        category = request.args.get('category')
        
        if category:
            products = Product.query.filter_by(category=category).all()
        else:
            products = Product.query.all()
        
        return jsonify({
            'products': [product.to_dict() for product in products]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/products', methods=['POST'])
@jwt_required()
def create_product():
    """Create new product (Admin only)"""
    try:
        data = request.get_json()
        
        product = Product(
            name=data['name'],
            category=data['category'],
            price=float(data['price']),
            image_url=data.get('image_url'),
            stock=int(data.get('stock', 0)),
            description=data.get('description')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update product (Admin only)"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            product.name = data['name']
        if 'category' in data:
            product.category = data['category']
        if 'price' in data:
            product.price = float(data['price'])
        if 'image_url' in data:
            product.image_url = data['image_url']
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'description' in data:
            product.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete product (Admin only)"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================
# CART ROUTES
# ============================================

@app.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    """Get user's cart"""
    try:
        user_id = get_jwt_identity()
        cart_items = CartItem.query.filter_by(user_id=int(user_id)).all()
        
        total = sum(item.product.price * item.quantity for item in cart_items)
        
        return jsonify({
            'cart_items': [item.to_dict() for item in cart_items],
            'total': total,
            'count': len(cart_items)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add item to cart"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if item already in cart
        cart_item = CartItem.query.filter_by(
            user_id=int(user_id),
            product_id=product_id
        ).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(
                user_id=int(user_id),
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Item added to cart',
            'cart_item': cart_item.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/cart/<int:cart_item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(cart_item_id):
    """Update cart item quantity"""
    try:
        user_id = get_jwt_identity()
        cart_item = CartItem.query.filter_by(id=cart_item_id, user_id=int(user_id)).first()
        
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        data = request.get_json()
        quantity = data.get('quantity')
        
        if quantity <= 0:
            db.session.delete(cart_item)
        else:
            cart_item.quantity = quantity
        
        db.session.commit()
        
        return jsonify({'message': 'Cart updated'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/cart/<int:cart_item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(cart_item_id):
    """Remove item from cart"""
    try:
        user_id = get_jwt_identity()
        cart_item = CartItem.query.filter_by(id=cart_item_id, user_id=int(user_id)).first()
        
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        db.session.delete(cart_item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed from cart'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear all items from cart"""
    try:
        user_id = get_jwt_identity()
        CartItem.query.filter_by(user_id=int(user_id)).delete()
        db.session.commit()
        
        return jsonify({'message': 'Cart cleared'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================
# ORDER ROUTES
# ============================================

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    """Get user's orders"""
    try:
        user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=int(user_id)).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get single order"""
    try:
        user_id = get_jwt_identity()
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Check if user owns this order
        if order.user_id != int(user_id):
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify({'order': order.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    """Create new order from cart"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get cart items
        cart_items = CartItem.query.filter_by(user_id=int(user_id)).all()
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Calculate totals
        total_products = sum(item.product.price * item.quantity for item in cart_items)
        delivery_fee = min(float(data.get('delivery_fee', 200)), Config.MAX_DELIVERY_FEE)
        total_price = total_products + delivery_fee
        
        # Create order
        order = Order(
            user_id=int(user_id),
            total_products_price=total_products,
            delivery_fee=delivery_fee,
            total_price=total_price,
            delivery_location=data.get('delivery_location'),
            payment_method=data.get('payment_method'),
            payment_status='completed',  # Assuming payment is verified
            transaction_id=data.get('transaction_id', f'TXN-{secrets.token_hex(8).upper()}')
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Create order items
        for cart_item in cart_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            db.session.add(order_item)
        
        # Clear cart
        CartItem.query.filter_by(user_id=int(user_id)).delete()
        
        db.session.commit()
        
        # Send confirmation email (non-blocking)
        try:
            user = User.query.get(int(user_id))
            send_order_confirmation(user.email, user.name, order.id, total_price)
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status (delivered)"""
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        data = request.get_json()
        status = data.get('status')
        
        if status == 'delivered':
            order.status = 'delivered'
            order.delivered_at = datetime.utcnow()
            
            # Update driver earnings if assigned
            if order.driver_id:
                driver = Driver.query.get(order.driver_id)
                if driver:
                    driver.total_earnings += order.delivery_fee
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================
# DRIVER ROUTES
# ============================================

@app.route('/api/driver/applications', methods=['POST'])
def submit_driver_application():
    """Submit driver application"""
    try:
        data = request.get_json()
        
        # Check if already applied
        existing = DriverApplication.query.filter_by(email=data['email']).first()
        if existing:
            return jsonify({'error': 'Application already submitted'}), 400
        
        application = DriverApplication(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            id_number=data['id_number'],
            vehicle_type=data['vehicle_type'],
            vehicle_registration=data.get('vehicle_registration'),
            about=data.get('about')
        )
        
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/driver/available-orders', methods=['GET'])
@jwt_required()
def get_available_orders():
    """Get available orders for drivers"""
    try:
        orders = Order.query.filter_by(status='pending').order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/driver/orders/<int:order_id>/accept', methods=['POST'])
@jwt_required()
def accept_order(order_id):
    """Driver accepts an order"""
    try:
        # Get driver info from JWT
        claims = get_jwt_identity()
        driver_id = request.get_json().get('driver_id')
        
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        if order.status != 'pending':
            return jsonify({'error': 'Order already assigned'}), 400
        
        # Assign order to driver
        order.driver_id = driver_id
        order.status = 'assigned'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order accepted',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/driver/orders', methods=['GET'])
@jwt_required()
def get_driver_orders():
    """Get driver's orders"""
    try:
        driver_id = request.args.get('driver_id')
        
        if not driver_id:
            return jsonify({'error': 'Driver ID required'}), 400
        
        orders = Order.query.filter_by(driver_id=driver_id).order_by(Order.created_at.desc()).all()
        
        active_orders = [o.to_dict() for o in orders if o.status != 'delivered']
        delivered_orders = [o.to_dict() for o in orders if o.status == 'delivered']
        
        driver = Driver.query.get(driver_id)
        
        return jsonify({
            'active_orders': active_orders,
            'delivered_orders': delivered_orders,
            'total_earnings': driver.total_earnings if driver else 0,
            'total_deliveries': len(delivered_orders)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/driver/feedback', methods=['POST'])
@jwt_required()
def submit_driver_feedback():
    """Driver submits feedback/complaint"""
    try:
        data = request.get_json()
        driver_id = data.get('driver_id')
        
        feedback = DriverFeedback(
            driver_id=driver_id,
            subject=data.get('subject'),
            message=data['message']
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback submitted',
            'feedback': feedback.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================
# CUSTOMER FEEDBACK ROUTES
# ============================================

@app.route('/api/feedback', methods=['POST'])
def submit_customer_feedback():
    """Submit customer feedback/complaint (can be anonymous)"""
    try:
        data = request.get_json()
        
        # Check if user is logged in
        user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            if user_id:
                user_id = int(user_id)
        except:
            pass
        
        feedback = CustomerFeedback(
            user_id=user_id,
            name=data.get('name'),
            email=data.get('email'),
            subject=data.get('subject'),
            message=data['message']
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback': feedback.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================
# ADMIN ROUTES
# ============================================

@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    """Get admin dashboard data"""
    try:
        # Get statistics
        total_orders = Order.query.count()
        total_customers = User.query.filter_by(role='customer').count()
        total_drivers = Driver.query.filter_by(approved=True).count()
        
        # Calculate revenue
        completed_orders = Order.query.filter_by(payment_status='completed').all()
        total_revenue = sum(order.total_price for order in completed_orders)
        total_profit = sum(order.total_price - order.delivery_fee for order in completed_orders)
        
        # Recent orders
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
        
        return jsonify({
            'stats': {
                'total_orders': total_orders,
                'total_customers': total_customers,
                'total_drivers': total_drivers,
                'total_revenue': total_revenue,
                'total_profit': total_profit
            },
            'recent_orders': [order.to_dict() for order in recent_orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/orders', methods=['GET'])
@jwt_required()
def admin_get_all_orders():
    """Get all orders (Admin)"""
    try:
        status = request.args.get('status')
        
        if status:
            orders = Order.query.filter_by(status=status).order_by(Order.created_at.desc()).all()
        else:
            orders = Order.query.order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/driver-applications', methods=['GET'])
@jwt_required()
def get_driver_applications():
    """Get all driver applications (Admin)"""
    try:
        status = request.args.get('status', 'pending')
        applications = DriverApplication.query.filter_by(status=status).order_by(DriverApplication.created_at.desc()).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/driver-applications/<int:app_id>/approve', methods=['POST'])
@jwt_required()
def approve_driver_application(app_id):
    """Approve driver application (Admin)"""
    try:
        application = DriverApplication.query.get(app_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        if application.status != 'pending':
            return jsonify({'error': 'Application already processed'}), 400
        
        # Create user account for driver
        user = User(
            name=application.name,
            email=application.email,
            phone=application.phone,
            role='driver'
        )
        # Set a temporary password (they'll use driver identity + secret key)
        user.set_password(secrets.token_urlsafe(16))
        
        db.session.add(user)
        db.session.flush()
        
        # Generate driver identity
        driver_count = Driver.query.count() + 1
        driver_identity = f"Driver-{driver_count}"
        secret_key = secrets.token_hex(4).upper()  # 8 character secret key
        
        # Create driver profile
        driver = Driver(
            user_id=user.id,
            driver_identity=driver_identity,
            vehicle_type=application.vehicle_type,
            vehicle_registration=application.vehicle_registration,
            secret_key=secret_key,
            approved=True
        )
        
        db.session.add(driver)
        
        # Update application status
        application.status = 'approved'
        
        db.session.commit()
        
        # Send approval email
        send_driver_approved_email(
            application.email,
            application.name,
            driver_identity,
            secret_key
        )
        
        return jsonify({
            'message': 'Driver approved successfully',
            'driver': driver.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/driver-applications/<int:app_id>/reject', methods=['POST'])
@jwt_required()
def reject_driver_application(app_id):
    """Reject driver application (Admin)"""
    try:
        application = DriverApplication.query.get(app_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        application.status = 'rejected'
        db.session.commit()
        
        return jsonify({'message': 'Application rejected'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/drivers', methods=['GET'])
@jwt_required()
def get_all_drivers():
    """Get all drivers (Admin)"""
    try:
        drivers = Driver.query.filter_by(approved=True).all()
        
        return jsonify({
            'drivers': [driver.to_dict() for driver in drivers]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/drivers/<int:driver_id>', methods=['DELETE'])
@jwt_required()
def delete_driver(driver_id):
    """Delete/Remove driver (Admin)"""
    try:
        driver = Driver.query.get(driver_id)
        
        if not driver:
            return jsonify({'error': 'Driver not found'}), 404
        
        # Delete user account too
        user = User.query.get(driver.user_id)
        
        db.session.delete(driver)
        if user:
            db.session.delete(user)
        
        db.session.commit()
        
        return jsonify({'message': 'Driver removed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/customer-feedback', methods=['GET'])
@jwt_required()
def get_customer_feedback():
    """Get all customer feedback (Admin)"""
    try:
        feedback = CustomerFeedback.query.order_by(CustomerFeedback.created_at.desc()).all()
        
        return jsonify({
            'feedback': [f.to_dict() for f in feedback]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/driver-feedback', methods=['GET'])
@jwt_required()
def get_driver_feedback():
    """Get all driver feedback (Admin)"""
    try:
        feedback = DriverFeedback.query.order_by(DriverFeedback.created_at.desc()).all()
        
        return jsonify({
            'feedback': [f.to_dict() for f in feedback]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/feedback/<int:feedback_id>', methods=['DELETE'])
@jwt_required()
def delete_feedback(feedback_id):
    """Delete feedback (Admin)"""
    try:
        # Try customer feedback first
        feedback = CustomerFeedback.query.get(feedback_id)
        if not feedback:
            feedback = DriverFeedback.query.get(feedback_id)
        
        if not feedback:
            return jsonify({'error': 'Feedback not found'}), 404
        
        db.session.delete(feedback)
        db.session.commit()
        
        return jsonify({'message': 'Feedback deleted'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================
# HEALTH CHECK
# ============================================

@app.route('/', methods=['GET'])
def home():
    """Home route"""
    return jsonify({
        'message': 'Noory Shop API',
        'version': '1.0.0',
        'status': 'running'
    }), 200


@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'healthy'}), 200


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500


# ============================================
# RUN APP
# ============================================
@app.route('/api/seed-now', methods=['GET'])
def seed_now():
    """Public seed endpoint - GET request"""
    try:
        # Import here to avoid circular import
        import sys
        import os
        
        # Add current directory to path
        sys.path.insert(0, os.path.dirname(__file__))
        
        # Clear existing
        Product.query.delete()
        db.session.commit()
        
        # Inline seed - just copy the products list from seed.py
        products = []
        
        # Vegetables (50)
        veggies = [
            ('Sukuma Wiki', 'vegetables', 30, 250),
            ('Spinach', 'vegetables', 40, 220),
            ('Cabbage', 'vegetables', 50, 200),
            ('Tomatoes 1kg', 'vegetables', 80, 300),
            ('Onions 1kg', 'vegetables', 60, 350),
            ('Carrots 1kg', 'vegetables', 70, 280),
            ('Potatoes 2kg', 'vegetables', 100, 320),
            ('Green Pepper', 'vegetables', 20, 250),
            ('Cucumber', 'vegetables', 25, 230),
            ('Lettuce', 'vegetables', 35, 200),
            ('Broccoli', 'vegetables', 90, 180),
        ]
        
        for name, cat, price, stock in veggies:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=f'Fresh {name}'))
        
        db.session.bulk_save_objects(products)
        db.session.commit()
        
        return jsonify({'success': True, 'count': len(products)}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)