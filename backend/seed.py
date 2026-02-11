from app import app, db
from models import Product

# Kenyan products data
KENYAN_PRODUCTS = [
    # Vegetables
    {"name": "Sukuma Wiki (Kale)", "category": "vegetables", "price": 30, "stock": 100, 
     "description": "Fresh sukuma wiki from local farms", 
     "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500"},
    
    {"name": "Cabbage", "category": "vegetables", "price": 50, "stock": 80,
     "description": "Fresh cabbage",
     "image_url": "https://images.unsplash.com/photo-1594282854473-f5842904c7cd?w=500"},
    
    {"name": "Tomatoes (1kg)", "category": "vegetables", "price": 80, "stock": 150,
     "description": "Fresh tomatoes",
     "image_url": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500"},
    
    {"name": "Onions (1kg)", "category": "vegetables", "price": 60, "stock": 120,
     "description": "Fresh onions",
     "image_url": "https://images.unsplash.com/photo-1508747703725-719777637510?w=500"},
    
    {"name": "Carrots (1kg)", "category": "vegetables", "price": 70, "stock": 100,
     "description": "Fresh carrots",
     "image_url": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500"},
    
    {"name": "Potatoes (2kg)", "category": "vegetables", "price": 100, "stock": 200,
     "description": "Fresh potatoes",
     "image_url": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500"},
    
    {"name": "Spinach", "category": "vegetables", "price": 40, "stock": 90,
     "description": "Fresh spinach leaves",
     "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500"},
    
    # Snacks
    {"name": "Mabuyu (Baobab Seeds)", "category": "snacks", "price": 50, "stock": 60,
     "description": "Traditional Kenyan snack",
     "image_url": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500"},
    
    {"name": "Chevda Mix", "category": "snacks", "price": 80, "stock": 75,
     "description": "Spicy Indian-Kenyan snack mix",
     "image_url": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500"},
    
    {"name": "Samosa (Pack of 6)", "category": "snacks", "price": 120, "stock": 50,
     "description": "Fresh vegetable samosas",
     "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500"},
    
    {"name": "Mandazi (Pack of 10)", "category": "snacks", "price": 100, "stock": 80,
     "description": "Traditional Kenyan donuts",
     "image_url": "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500"},
    
    {"name": "Peanuts (500g)", "category": "snacks", "price": 150, "stock": 100,
     "description": "Roasted peanuts",
     "image_url": "https://images.unsplash.com/photo-1582045596857-36b159f835b8?w=500"},
    
    {"name": "Cassava Crisps", "category": "snacks", "price": 70, "stock": 90,
     "description": "Crispy cassava chips",
     "image_url": "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=500"},
    
    # Beverages
    {"name": "Tusker Lager (500ml)", "category": "beverages", "price": 180, "stock": 100,
     "description": "Kenya's premium beer",
     "image_url": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500"},
    
    {"name": "Stoney Tangawizi (300ml)", "category": "beverages", "price": 60, "stock": 150,
     "description": "Ginger flavored soda",
     "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"},
    
    {"name": "Ketepa Tea (100 bags)", "category": "beverages", "price": 280, "stock": 80,
     "description": "Premium Kenyan tea",
     "image_url": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500"},
    
    {"name": "Minute Maid Mango (1L)", "category": "beverages", "price": 120, "stock": 100,
     "description": "Mango juice drink",
     "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"},
    
    {"name": "Dasani Water (500ml)", "category": "beverages", "price": 40, "stock": 200,
     "description": "Purified drinking water",
     "image_url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500"},
    
    {"name": "Alvaro Coffee (250g)", "category": "beverages", "price": 350, "stock": 50,
     "description": "Premium Kenyan coffee",
     "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500"},
    
    # Household Items
    {"name": "Omo Washing Powder (1kg)", "category": "household", "price": 280, "stock": 60,
     "description": "Laundry detergent",
     "image_url": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500"},
    
    {"name": "Sunlight Soap (5 bars)", "category": "household", "price": 150, "stock": 100,
     "description": "Bar soap pack",
     "image_url": "https://images.unsplash.com/photo-1617897903246-719242758050?w=500"},
    
    {"name": "Tissue Paper (Pack of 10)", "category": "household", "price": 180, "stock": 80,
     "description": "Soft tissue rolls",
     "image_url": "https://images.unsplash.com/photo-1584556326561-c8746083993b?w=500"},
    
    {"name": "Colgate Toothpaste", "category": "household", "price": 120, "stock": 90,
     "description": "Dental care",
     "image_url": "https://images.unsplash.com/photo-1622909830692-cd2d4603c9e1?w=500"},
    
    # Flowers
    {"name": "Rose Bouquet", "category": "flowers", "price": 500, "stock": 30,
     "description": "Fresh Kenyan roses",
     "image_url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500"},
    
    {"name": "Sunflowers (5 stems)", "category": "flowers", "price": 350, "stock": 40,
     "description": "Bright sunflowers",
     "image_url": "https://images.unsplash.com/photo-1597848212624-e4f7de0a43e2?w=500"},
    
    {"name": "Mixed Bouquet", "category": "flowers", "price": 600, "stock": 25,
     "description": "Assorted fresh flowers",
     "image_url": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500"},
]


def seed_products():
    """Seed database with Kenyan products"""
    with app.app_context():
        # Clear existing products
        Product.query.delete()
        
        # Add new products
        for product_data in KENYAN_PRODUCTS:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print(f"✅ Successfully seeded {len(KENYAN_PRODUCTS)} products!")


if __name__ == '__main__':
    seed_products()
