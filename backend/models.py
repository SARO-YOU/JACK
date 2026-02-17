from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), default='customer')  # customer, driver, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy=True)
    driver_profile = db.relationship('Driver', backref='user', uselist=False, lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Driver(db.Model):
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    driver_identity = db.Column(db.String(100), unique=True)  # e.g. "Driver-John-1"
    secret_key = db.Column(db.String(200))  # Their password starting with "Driver-"
    vehicle_type = db.Column(db.String(50))
    registration_number = db.Column(db.String(50))
    mpesa_phone = db.Column(db.String(20))
    approved = db.Column(db.Boolean, default=False)
    total_earnings = db.Column(db.Float, default=0.0)
    pending_earnings = db.Column(db.Float, default=0.0)
    paid_earnings = db.Column(db.Float, default=0.0)
    total_deliveries = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    orders = db.relationship('Order', backref='driver', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
            'driver_identity': self.driver_identity,
            'vehicle_type': self.vehicle_type,
            'registration_number': self.registration_number,
            'mpesa_phone': self.mpesa_phone,
            'approved': self.approved,
            'total_earnings': self.total_earnings or 0,
            'pending_earnings': self.pending_earnings or 0,
            'paid_earnings': self.paid_earnings or 0,
            'total_deliveries': self.total_deliveries or 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class DriverApplication(db.Model):
    __tablename__ = 'driver_applications'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    mpesa_phone = db.Column(db.String(20))
    id_number = db.Column(db.String(20))
    vehicle_type = db.Column(db.String(50))
    registration_number = db.Column(db.String(50))
    why_suited = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone': self.phone,
            'email': self.email,
            'mpesa_phone': self.mpesa_phone,
            'id_number': self.id_number,
            'vehicle_type': self.vehicle_type,
            'registration_number': self.registration_number,
            'why_suited': self.why_suited,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class CustomerFeedback(db.Model):
    __tablename__ = 'customer_feedback'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    feedback_type = db.Column(db.String(50), default='general')  # general, complaint, suggestion, compliment, driver_inquiry
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'feedback_type': self.feedback_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class DriverFeedback(db.Model):
    __tablename__ = 'driver_feedback'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'))
    rating = db.Column(db.Integer)  # 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'driver_id': self.driver_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'stock': self.stock,
            'description': self.description,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship('Product', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'product': self.product.to_dict() if self.product else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)
    total_products_price = db.Column(db.Float, default=0)
    delivery_fee = db.Column(db.Float, default=200)
    total_price = db.Column(db.Float, nullable=False)
    delivery_location = db.Column(db.String(300))
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(50), default='pending')
    transaction_id = db.Column(db.String(100))
    order_status = db.Column(db.String(50), default='pending')
    driver_status = db.Column(db.String(50), default='pending')  # pending, accepted, delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
            'driver_id': self.driver_id,
            'driver': self.driver.to_dict() if self.driver else None,
            'total_products_price': self.total_products_price,
            'delivery_fee': self.delivery_fee,
            'total_price': self.total_price,
            'delivery_location': self.delivery_location,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'transaction_id': self.transaction_id,
            'order_status': self.order_status,
            'driver_status': self.driver_status,
            'items': [item.to_dict() for item in self.items] if self.items else [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    product = db.relationship('Product', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price': self.price,
            'product': self.product.to_dict() if self.product else None,
        }