from app import app, db
from models import User, CartItem, Order, OrderItem, DriverApplication, CustomerFeedback

with app.app_context():
    print("🗑️  Starting cleanup...")
    
    # Get all non-admin users
    customers = User.query.filter(User.role != 'admin').all()
    
    print(f"\n📊 Found {len(customers)} non-admin users to delete:")
    for user in customers:
        print(f"  - {user.name} ({user.email}) - Role: {user.role}")
    
    # Count their data
    cart_items = CartItem.query.filter(CartItem.user_id.in_([u.id for u in customers])).count()
    orders = Order.query.filter(Order.user_id.in_([u.id for u in customers])).count()
    
    print(f"\n📦 Associated data:")
    print(f"  - {cart_items} cart items")
    print(f"  - {orders} orders")
    
    # Ask for confirmation
    confirm = input("\n⚠️  DELETE ALL THIS DATA? Type 'DELETE' to confirm: ")
    
    if confirm != 'DELETE':
        print("❌ Cancelled. No data deleted.")
        exit()
    
    # Delete cart items
    CartItem.query.filter(CartItem.user_id.in_([u.id for u in customers])).delete(synchronize_session=False)
    print("✅ Deleted cart items")
    
    # Delete order items first (foreign key constraint)
    order_ids = [o.id for o in Order.query.filter(Order.user_id.in_([u.id for u in customers])).all()]
    if order_ids:
        OrderItem.query.filter(OrderItem.order_id.in_(order_ids)).delete(synchronize_session=False)
        print("✅ Deleted order items")
    
    # Delete orders
    Order.query.filter(Order.user_id.in_([u.id for u in customers])).delete(synchronize_session=False)
    print("✅ Deleted orders")
    
    # Delete users
    for user in customers:
        db.session.delete(user)
    
    db.session.commit()
    print(f"\n✅ DELETED {len(customers)} users and all their data!")
    
    # Show remaining admins
    admins = User.query.filter_by(role='admin').all()
    print(f"\n👥 Remaining admins ({len(admins)}):")
    for admin in admins:
        print(f"  - {admin.name} ({admin.email})")
    
    print("\n🎉 Cleanup complete!")