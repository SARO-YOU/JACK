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
# SEED ENDPOINT - 500+ PRODUCTS
# ============================================

@app.route('/api/seed-now', methods=['GET'])
def seed_now():
    """Seed database with 500+ products"""
    try:
        existing = Product.query.count()
        if existing > 400:
            return jsonify({'message': f'Already have {existing} products'}), 200
        
        try:
            Product.query.delete()
            db.session.commit()
        except:
            db.session.rollback()
        
        products = []
        
        # VEGETABLES (50)
        veggies = [
            ('Sukuma Wiki Fresh', 30, 250), ('Spinach Organic', 40, 220),
            ('Cabbage Whole', 50, 200), ('Tomatoes 1kg', 80, 300),
            ('Red Onions 1kg', 60, 350), ('Carrots 1kg', 70, 280),
            ('Potatoes 2kg', 100, 320), ('Green Pepper', 20, 250),
            ('Cucumber', 25, 230), ('Lettuce', 35, 200),
            ('Broccoli', 90, 180), ('Cauliflower', 85, 190),
            ('Dhania Bundle', 20, 280), ('Spring Onions', 25, 260),
            ('Garlic 250g', 150, 220), ('Ginger 250g', 120, 240),
            ('Beetroot', 60, 200), ('Sweet Potato 1kg', 80, 250),
            ('Pumpkin', 100, 180), ('Eggplant', 45, 210),
            ('Red Pepper', 30, 200), ('Yellow Pepper', 30, 190),
            ('Zucchini', 50, 170), ('Mushrooms 250g', 180, 150),
            ('Baby Corn', 120, 180), ('Green Beans 500g', 90, 200),
            ('Garden Peas 500g', 100, 180), ('Leeks', 60, 160),
            ('Celery', 70, 150), ('Arrowroots 1kg', 110, 200),
            ('Cherry Tomatoes', 100, 180), ('Kale', 35, 240),
            ('Swiss Chard', 40, 200), ('Pak Choi', 45, 180),
            ('Butternut', 80, 160), ('Radish', 30, 190),
            ('Turnips', 50, 170), ('Chili Peppers', 40, 220),
            ('Parsley', 25, 200), ('Mint', 25, 200),
            ('Coriander', 20, 210), ('Basil', 30, 180),
            ('Rosemary', 35, 170), ('Thyme', 30, 180),
            ('Oregano', 35, 170), ('Bell Pepper Mix', 100, 160),
            ('Okra', 40, 190), ('Asparagus', 150, 120),
            ('Artichoke', 180, 100), ('Fennel', 90, 140),
        ]
        for name, price, stock in veggies:
            products.append(Product(name=name, category='vegetables', price=price, stock=stock, description=f'Fresh {name}'))
        
        # FRUITS (50)
        fruits = [
            ('Bananas Dozen', 120, 300), ('Red Apples 1kg', 250, 250),
            ('Oranges 1kg', 150, 280), ('Mangoes', 50, 350),
            ('Watermelon', 200, 220), ('Pineapple', 100, 240),
            ('Papaya', 80, 210), ('Avocado', 30, 300),
            ('Passion Fruit 6pc', 60, 260), ('Grapes 500g', 180, 200),
            ('Strawberries 250g', 200, 180), ('Lemons 4pc', 40, 280),
            ('Tangerines 1kg', 130, 230), ('Plums 500g', 150, 200),
            ('Pears 1kg', 220, 190), ('Guava', 25, 250),
            ('Coconut', 80, 210), ('Tree Tomato', 100, 200),
            ('Sugarcane', 40, 240), ('Custard Apple', 50, 180),
            ('Green Apples 1kg', 260, 220), ('Dragon Fruit', 120, 140),
            ('Kiwi 4pc', 200, 160), ('Pomegranate', 150, 150),
            ('Blueberries 125g', 280, 120), ('Blackberries 125g', 250, 110),
            ('Cherries 250g', 350, 100), ('Dates 250g', 180, 180),
            ('Figs Pack', 200, 130), ('Star Fruit', 80, 140),
            ('Lychee 250g', 180, 120), ('Rambutan 250g', 200, 100),
            ('Persimmon', 70, 130), ('Mulberries 150g', 180, 90),
            ('Gooseberries 200g', 150, 100), ('Cantaloupe', 150, 160),
            ('Honeydew', 160, 150), ('Grapefruit', 60, 180),
            ('Limes 6pc', 50, 220), ('Nectarines 500g', 180, 140),
            ('Apricots 500g', 190, 130), ('Peaches 500g', 200, 140),
            ('Prunes 250g', 160, 150), ('Raisins 250g', 140, 180),
            ('Cranberries 200g', 200, 120), ('Raspberries 125g', 260, 100),
            ('Boysenberries', 220, 90), ('Elderberries', 180, 100),
            ('Currants 200g', 170, 110), ('Quince', 90, 130),
        ]
        for name, price, stock in fruits:
            products.append(Product(name=name, category='fruits', price=price, stock=stock, description=f'Fresh {name}'))
        
        # MEAT (40)
        meat = [
            ('Beef Steak 500g', 400, 180), ('Beef Stew 1kg', 600, 200),
            ('Minced Beef 500g', 300, 220), ('Beef Bones 1kg', 200, 210),
            ('Goat Meat 1kg', 800, 160), ('Mutton 1kg', 750, 150),
            ('Pork Chops 500g', 350, 170), ('Sausages 500g', 280, 240),
            ('Bacon 250g', 300, 200), ('Beef Liver 500g', 250, 180),
            ('Tripe 500g', 180, 190), ('Beef Ribs 1kg', 550, 170),
            ('Smokies 500g', 250, 250), ('Corned Beef 340g', 280, 220),
            ('Salami 200g', 320, 180), ('Burger Patties 4pc', 350, 170),
            ('Lamb Chops 500g', 650, 130), ('T-Bone 500g', 500, 140),
            ('Beef Fillet 500g', 600, 130), ('Pork Belly 500g', 380, 150),
            ('Brisket 1kg', 650, 140), ('Lamb Leg 1kg', 900, 100),
            ('Beef Tongue 500g', 350, 120), ('Oxtail 1kg', 700, 110),
            ('Pork Ribs 1kg', 550, 140), ('Ham Sliced 200g', 300, 180),
            ('Pastrami 200g', 350, 150), ('Chorizo 250g', 320, 140),
            ('Pepperoni 150g', 280, 160), ('Meatballs 500g', 320, 170),
            ('Beef Mince Premium', 350, 200), ('Lamb Mince 500g', 400, 140),
            ('Pork Mince 500g', 320, 160), ('Veal Chops 500g', 550, 100),
            ('Venison 500g', 800, 80), ('Rabbit Meat 500g', 600, 70),
            ('Beef Suet 500g', 150, 160), ('Pork Fat 500g', 120, 170),
            ('Beef Shanks 1kg', 450, 150), ('Short Ribs 1kg', 500, 140),
        ]
        for name, price, stock in meat:
            products.append(Product(name=name, category='meat', price=price, stock=stock, description=f'{name}'))
        
        # POULTRY (30)
        poultry = [
            ('Whole Chicken 1.5kg', 650, 220), ('Chicken Breasts 500g', 350, 250),
            ('Chicken Thighs 1kg', 450, 240), ('Chicken Wings 1kg', 400, 230),
            ('Drumsticks 1kg', 420, 235), ('Gizzards 500g', 200, 200),
            ('Farm Eggs 30', 450, 300), ('Whole Turkey', 1800, 80),
            ('Duck Whole', 1200, 60), ('Quail Eggs 12pc', 180, 170),
            ('Chicken Mince 500g', 280, 200), ('Chicken Livers 500g', 180, 180),
            ('Chicken Sausages', 300, 210), ('Smoked Chicken', 900, 110),
            ('Turkey Sausages', 380, 150), ('Chicken Nuggets', 320, 190),
            ('Chicken Strips', 330, 180), ('Turkey Mince 500g', 350, 140),
            ('Duck Breast 500g', 700, 90), ('Turkey Breast 500g', 450, 120),
            ('Chicken Stock 1L', 150, 160), ('Cornish Hen', 600, 80),
            ('Free Range Eggs 12', 280, 200), ('Duck Eggs 6pc', 200, 130),
            ('Turkey Wings 1kg', 500, 110), ('Chicken Feet 500g', 120, 180),
            ('Chicken Necks 500g', 100, 190), ('Chicken Hearts 500g', 180, 150),
            ('Turkey Legs 1kg', 550, 100), ('Quail Meat 500g', 400, 90),
        ]
        for name, price, stock in poultry:
            products.append(Product(name=name, category='poultry', price=price, stock=stock, description=f'{name}'))
        
        # FISH (30)
        fish = [
            ('Tilapia 1kg', 600, 200), ('Nile Perch 1kg', 700, 180),
            ('Salmon 500g', 900, 150), ('Tuna Canned 200g', 180, 280),
            ('Sardines Canned', 120, 300), ('Prawns 500g', 800, 160),
            ('Octopus 500g', 650, 140), ('Squid 500g', 600, 150),
            ('Mackerel Canned', 140, 250), ('Omena 500g', 150, 230),
            ('Catfish 1kg', 550, 150), ('Crab 500g', 700, 120),
            ('Lobster 500g', 1200, 80), ('Mussels 500g', 400, 130),
            ('Fish Fingers', 280, 190), ('Smoked Fish 500g', 450, 140),
            ('Cod Fillet 500g', 750, 110), ('Haddock 500g', 680, 100),
            ('Sea Bass 1kg', 850, 90), ('Oysters 6pc', 500, 80),
            ('Clams 500g', 450, 100), ('Anchovies Canned', 160, 180),
            ('Herring Pickled', 200, 140), ('Trout 500g', 650, 100),
            ('Swordfish 500g', 950, 70), ('Tuna Steak 500g', 880, 90),
            ('Barramundi 1kg', 750, 100), ('Kingfish 1kg', 800, 90),
            ('Snapper 1kg', 720, 110), ('Grouper 1kg', 780, 100),
        ]
        for name, price, stock in fish:
            products.append(Product(name=name, category='fish', price=price, stock=stock, description=f'{name}'))
        
        # DAIRY (35)
        dairy = [
            ('Fresh Milk 1L', 120, 350), ('Mala 500ml', 60, 300),
            ('Yogurt 500ml', 100, 280), ('Cheddar 200g', 250, 220),
            ('Butter 500g', 350, 240), ('Margarine 500g', 180, 300),
            ('Cream 250ml', 150, 200), ('Buttermilk 500ml', 80, 210),
            ('Ghee 500ml', 400, 180), ('Milk Powder 1kg', 550, 250),
            ('Ice Cream 1L', 280, 200), ('Cottage Cheese 250g', 200, 170),
            ('Sour Cream 200ml', 120, 180), ('Condensed Milk', 180, 250),
            ('Evaporated Milk', 120, 270), ('Greek Yogurt 500ml', 150, 170),
            ('Chocolate Milk', 90, 220), ('Mozzarella 200g', 280, 160),
            ('Parmesan 100g', 350, 130), ('Whipping Cream', 180, 150),
            ('Cream Cheese 200g', 220, 160), ('Feta 200g', 240, 140),
            ('Blue Cheese 150g', 300, 100), ('Gouda 200g', 270, 130),
            ('Brie 150g', 320, 90), ('String Cheese', 180, 170),
            ('Cheese Slices 200g', 200, 200), ('Kefir 500ml', 110, 150),
            ('Almond Milk 1L', 180, 140), ('Oat Milk 1L', 170, 130),
            ('Soy Milk 1L', 160, 150), ('Coconut Milk 400ml', 140, 160),
            ('Paneer 200g', 200, 140), ('Halloumi 200g', 280, 120),
            ('Ricotta 250g', 220, 130),
        ]
        for name, price, stock in dairy:
            products.append(Product(name=name, category='dairy', price=price, stock=stock, description=f'{name}'))
        
        # BEVERAGES (50)
        beverages = [
            ('Coca Cola 500ml', 60, 450), ('Fanta 500ml', 60, 430),
            ('Sprite 500ml', 60, 420), ('Water 500ml', 30, 600),
            ('Fruit Juice 1L', 120, 300), ('Mango Juice 500ml', 70, 330),
            ('Coffee 100g', 180, 250), ('Tea 250g', 120, 300),
            ('Hot Chocolate 250g', 200, 220), ('Energy Drink 250ml', 150, 250),
            ('Water 1.5L', 50, 550), ('Apple Juice 1L', 150, 270),
            ('Orange Juice 1L', 140, 280), ('Pineapple Juice 1L', 130, 260),
            ('Ginger Tea 20bags', 180, 230), ('Green Tea 20bags', 200, 220),
            ('Lemonade 500ml', 80, 290), ('Milkshake 500ml', 120, 230),
            ('Coconut Water', 100, 250), ('Passion Juice 500ml', 90, 260),
            ('Pepsi 500ml', 60, 400), ('Mountain Dew 500ml', 60, 370),
            ('Mirinda 500ml', 60, 360), ('Stoney 500ml', 60, 390),
            ('Alvaro 500ml', 80, 300), ('Soda Water 500ml', 50, 350),
            ('Iced Coffee 500ml', 120, 220), ('Strawberry Juice 1L', 150, 200),
            ('Guava Juice 500ml', 90, 240), ('Herbal Tea 20bags', 180, 180),
            ('Black Tea 20bags', 150, 260), ('Chamomile Tea', 200, 170),
            ('Peppermint Tea', 190, 180), ('Lemon Tea 20bags', 170, 190),
            ('Iced Tea 500ml', 70, 280), ('Cranberry Juice 1L', 160, 180),
            ('Grape Juice 1L', 140, 200), ('Tomato Juice 1L', 130, 170),
            ('Carrot Juice 500ml', 100, 190), ('Beetroot Juice', 110, 170),
            ('Espresso 250g', 350, 140), ('Cappuccino Mix', 280, 160),
            ('Latte Mix 250g', 300, 150), ('Mocha Mix 250g', 320, 140),
            ('Drinking Chocolate', 220, 190), ('Milo 400g', 280, 200),
            ('Ovaltine 400g', 270, 190), ('Nesquik 400g', 260, 180),
            ('Tang 500g', 180, 220), ('Kool-Aid Mix', 120, 210),
        ]
        for name, price, stock in beverages:
            products.append(Product(name=name, category='beverages', price=price, stock=stock, description=f'{name}'))
        
        # SNACKS (50)
        snacks = [
            ('Crisps 150g', 100, 350), ('Biscuits 300g', 120, 330),
            ('Peanuts 250g', 80, 300), ('Popcorn 100g', 50, 310),
            ('Chocolate Bar', 80, 350), ('Sweets 200g', 60, 330),
            ('Chewing Gum', 40, 370), ('Cake Slice', 100, 220),
            ('Cookies 200g', 140, 270), ('Crackers 200g', 90, 290),
            ('Pretzels 150g', 110, 240), ('Mixed Nuts 250g', 200, 230),
            ('Granola Bars 6pc', 180, 260), ('Fruit Roll', 70, 280),
            ('Corn Chips 150g', 120, 290), ('Rice Cakes', 100, 240),
            ('Trail Mix 200g', 180, 220), ('Beef Jerky 50g', 150, 200),
            ('Cheese Puffs 100g', 90, 300), ('Samosas 4pc', 80, 240),
            ('Cashews 200g', 280, 190), ('Macadamia 150g', 350, 150),
            ('Plantain Chips', 90, 250), ('Beef Samosas 4pc', 100, 230),
            ('Chapati Crisps', 70, 270), ('Honey Peanuts 250g', 100, 240),
            ('Cheese Balls 150g', 100, 280), ('Coconut Biscuits', 100, 260),
            ('Dark Chocolate', 120, 220), ('White Chocolate', 120, 210),
            ('Wafer Biscuits', 110, 250), ('Marshmallows 200g', 90, 230),
            ('Muffins 4pc', 150, 180), ('Brownies 4pc', 160, 170),
            ('Donuts 6pc', 180, 200), ('Cupcakes 4pc', 200, 160),
            ('Protein Bars 6pc', 250, 140), ('Dried Mango 150g', 130, 180),
            ('Dried Pineapple', 140, 170), ('Energy Balls 6pc', 180, 150),
            ('Tortilla Chips', 110, 270), ('Salsa Dip 200ml', 120, 180),
            ('Guacamole 200g', 150, 160), ('Hummus 200g', 140, 180),
            ('Pita Chips 150g', 100, 200), ('Veggie Chips 150g', 130, 190),
            ('Seaweed Snack', 80, 210), ('Rice Crackers', 90, 220),
            ('Wasabi Peas 150g', 120, 170), ('Banana Chips 150g', 80, 240),
        ]
        for name, price, stock in snacks:
            products.append(Product(name=name, category='snacks', price=price, stock=stock, description=f'{name}'))
        
        # BAKERY (25)
        bakery = [
            ('White Bread 400g', 50, 350), ('Brown Bread 400g', 60, 330),
            ('Chapati 5pc', 100, 300), ('Mandazi 6pc', 60, 310),
            ('Doughnuts 6pc', 120, 240), ('Croissants 4pc', 150, 220),
            ('Buns 6pc', 80, 290), ('Pizza Base', 100, 230),
            ('Pita Bread 6pc', 90, 240), ('French Loaf', 70, 270),
            ('Bagels 4pc', 120, 190), ('English Muffins', 100, 200),
            ('Cinnamon Rolls 4pc', 150, 170), ('Garlic Bread', 80, 220),
            ('Brioche 4pc', 140, 180), ('Sourdough Loaf', 120, 160),
            ('Rye Bread', 90, 170), ('Multigrain Bread', 80, 200),
            ('Dinner Rolls 8pc', 100, 210), ('Pretzel Buns 4pc', 130, 150),
            ('Naan Bread 4pc', 100, 180), ('Focaccia', 110, 170),
            ('Ciabatta', 100, 180), ('Baguette', 80, 190),
            ('Challah Bread', 140, 140),
        ]
        for name, price, stock in bakery:
            products.append(Product(name=name, category='bakery', price=price, stock=stock, description=f'{name}'))
        
        # FLOUR & GRAINS (35)
        grains_flour = [
            ('Maize Flour 2kg', 180, 400), ('Wheat Flour 2kg', 200, 370),
            ('Pishori Rice 2kg', 250, 350), ('Spaghetti 500g', 120, 330),
            ('Oats 500g', 150, 290), ('Atta Flour 2kg', 220, 300),
            ('Self-Raising 1kg', 140, 310), ('Noodles', 40, 500),
            ('Corn Flour 1kg', 120, 330), ('Millet Flour 1kg', 150, 240),
            ('Sorghum Flour 1kg', 140, 230), ('Rice Flour 500g', 100, 270),
            ('Barley 500g', 130, 220), ('Couscous 500g', 180, 200),
            ('Quinoa 500g', 350, 180), ('Basmati Rice 2kg', 350, 240),
            ('Brown Rice 2kg', 280, 220), ('Macaroni 500g', 130, 300),
            ('Penne 500g', 140, 290), ('Vermicelli 500g', 110, 270),
            ('Fusilli 500g', 135, 260), ('Lasagna Sheets', 160, 200),
            ('Egg Noodles 500g', 150, 240), ('Wild Rice 500g', 320, 150),
            ('Jasmine Rice 2kg', 300, 210), ('Arborio Rice 1kg', 280, 170),
            ('Buckwheat 500g', 200, 180), ('Cornmeal 1kg', 140, 250),
            ('Semolina 1kg', 160, 230), ('Bread Flour 1kg', 150, 260),
            ('Cake Flour 1kg', 160, 240), ('Pastry Flour 1kg', 170, 220),
            ('Rye Flour 1kg', 180, 200), ('Almond Flour 500g', 350, 140),
            ('Coconut Flour 500g', 300, 150),
        ]
        for name, price, stock in grains_flour:
            cat = 'flour' if 'Flour' in name else 'grains'
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=f'{name}'))
        
        # SPICES (35)
        spices_list = [
            ('Salt 500g', 40, 500), ('Black Pepper 50g', 80, 300),
            ('Curry Powder 50g', 100, 290), ('Turmeric 50g', 90, 280),
            ('Cumin 50g', 110, 270), ('Cinnamon 50g', 100, 260),
            ('Paprika 50g', 120, 250), ('Chili Powder 50g', 80, 290),
            ('Mixed Herbs 30g', 100, 230), ('Cardamom 30g', 150, 220),
            ('Cloves 30g', 120, 230), ('Nutmeg 30g', 130, 210),
            ('Bay Leaves 20g', 80, 240), ('Thyme 20g', 90, 220),
            ('Oregano 20g', 90, 220), ('Garam Masala 50g', 120, 200),
            ('Chili Flakes 50g', 100, 230), ('Garlic Powder 50g', 100, 240),
            ('Onion Powder 50g', 100, 240), ('Mixed Spice 50g', 110, 220),
            ('Coriander 50g', 90, 230), ('Fennel 50g', 100, 210),
            ('Star Anise 30g', 140, 180), ('Rosemary 20g', 100, 200),
            ('Basil 20g', 90, 210), ('Sage 20g', 100, 190),
            ('Dill 20g', 90, 200), ('Parsley Dried 20g', 80, 210),
            ('Celery Salt 100g', 100, 200), ('Mustard Seeds 50g', 90, 210),
            ('Ginger Powder 50g', 100, 220), ('Cayenne Pepper 50g', 110, 200),
            ('White Pepper 50g', 90, 210), ('Saffron 1g', 500, 100),
            ('Vanilla Extract 50ml', 280, 150),
        ]
        for name, price, stock in spices_list:
            products.append(Product(name=name, category='spices', price=price, stock=stock, description=f'{name}'))
        
        # COOKING OIL (20)
        oils = [
            ('Vegetable Oil 2L', 450, 350), ('Olive Oil 500ml', 650, 220),
            ('Sunflower Oil 1L', 280, 300), ('Coconut Oil 500ml', 400, 230),
            ('Palm Oil 1L', 300, 240), ('Sesame Oil 250ml', 350, 190),
            ('Canola Oil 1L', 320, 270), ('Avocado Oil 250ml', 550, 180),
            ('Vegetable Oil 1L', 240, 330), ('Groundnut Oil 1L', 300, 230),
            ('Corn Oil 1L', 280, 240), ('Blended Oil 2L', 400, 290),
            ('Grapeseed Oil 500ml', 380, 160), ('Walnut Oil 250ml', 420, 140),
            ('Flaxseed Oil 250ml', 400, 150), ('Peanut Oil 1L', 310, 220),
            ('Rice Bran Oil 1L', 330, 200), ('Soybean Oil 1L', 270, 240),
            ('Mustard Oil 500ml', 280, 190), ('Safflower Oil 500ml', 350, 170),
        ]
        for name, price, stock in oils:
            products.append(Product(name=name, category='cooking_oil', price=price, stock=stock, description=f'{name}'))
        
        # HOUSEHOLD (30)
        household_items = [
            ('Toilet Paper 4', 150, 350), ('Soap Bars 3pc', 120, 400),
            ('Detergent 1kg', 180, 330), ('Dish Soap 500ml', 100, 350),
            ('Bleach 1L', 120, 300), ('Air Freshener', 200, 240),
            ('Matches Box', 20, 600), ('Candles 5pc', 100, 330),
            ('Garbage Bags 20pc', 120, 300), ('Sponges 3pc', 80, 350),
            ('Broom', 200, 240), ('Mop', 250, 220),
            ('Hangers 10pc', 150, 270), ('Floor Wipes 50pc', 180, 230),
            ('Laundry Basket', 300, 180), ('Bucket 20L', 250, 220),
            ('Disinfectant 1L', 180, 260), ('Hand Soap 500ml', 120, 310),
            ('Glass Cleaner', 140, 240), ('Floor Cleaner 1L', 160, 250),
            ('Toilet Cleaner', 150, 260), ('Fabric Softener 1L', 180, 230),
            ('Dish Cloths 3pc', 90, 280), ('Trash Can', 350, 160),
            ('Dust Pan & Brush', 180, 200), ('Mop Bucket', 280, 180),
            ('Rubber Gloves', 100, 250), ('Scrub Brush', 120, 230),
            ('Duster', 90, 260), ('Vacuum Bags 5pc', 200, 180),
        ]
        for name, price, stock in household_items:
            products.append(Product(name=name, category='household', price=price, stock=stock, description=f'{name}'))
        
        db.session.bulk_save_objects(products)
        db.session.commit()
        
        return jsonify({'success': True, 'total': len(products)}), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500


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
        
        if not all([name, email, password]):
            return jsonify({'error': 'Name, email and password are required'}), 400
        
        if name in Config.ALLOWED_ADMIN_NAMES:
            return jsonify({'error': 'This name is reserved'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        user = User(name=name, email=email, phone=phone, role='customer')
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        try:
            send_welcome_email(email, name)
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Registration successful',
            'token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login for customers, drivers, and admins"""
    try:
        data = request.get_json()
        identifier = data.get('identifier')
        password = data.get('password')
        
        if not all([identifier, password]):
            return jsonify({'error': 'Identifier and password are required'}), 400
        
        if identifier in Config.ALLOWED_ADMIN_NAMES and password == Config.ADMIN_PASSWORD:
            admin_user = {'id': 0, 'name': identifier, 'email': 'admin@noory.com', 'role': 'admin'}
            access_token = create_access_token(identity="0", additional_claims={'role': 'admin', 'name': identifier})
            return jsonify({'message': 'Admin login successful', 'token': access_token, 'user': admin_user}), 200
        
        if identifier.startswith('Driver-'):
            driver = Driver.query.filter_by(driver_identity=identifier).first()
            if driver and driver.secret_key == password and driver.approved:
                access_token = create_access_token(identity=str(driver.user_id), additional_claims={'role': 'driver', 'driver_id': driver.id})
                return jsonify({'message': 'Driver login successful', 'token': access_token, 'user': driver.user.to_dict(), 'driver': driver.to_dict()}), 200
            else:
                return jsonify({'error': 'Invalid driver credentials'}), 401
        
        user = User.query.filter_by(email=identifier).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
        
        response_data = {'message': 'Login successful', 'token': access_token, 'user': user.to_dict()}
        
        if user.role == 'driver' and user.driver_profile:
            response_data['driver'] = user.driver_profile.to_dict()
        
        return jsonify(response_data), 200
        
    except Exception as e:
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
        
        return jsonify({'products': [product.to_dict() for product in products]}), 200
        
    except Exception as e:
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
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        cart_item = CartItem.query.filter_by(user_id=int(user_id), product_id=product_id).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(user_id=int(user_id), product_id=product_id, quantity=quantity)
            db.session.add(cart_item)
        
        db.session.commit()
        
        return jsonify({'message': 'Item added to cart', 'cart_item': cart_item.to_dict()}), 200
        
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
        
        return jsonify({'orders': [order.to_dict() for order in orders]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    """Create new order from cart"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        cart_items = CartItem.query.filter_by(user_id=int(user_id)).all()
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        total_products = sum(item.product.price * item.quantity for item in cart_items)
        delivery_fee = min(float(data.get('delivery_fee', 200)), Config.MAX_DELIVERY_FEE)
        total_price = total_products + delivery_fee
        
        order = Order(
            user_id=int(user_id),
            total_products_price=total_products,
            delivery_fee=delivery_fee,
            total_price=total_price,
            delivery_location=data.get('delivery_location'),
            payment_method=data.get('payment_method'),
            payment_status='completed',
            transaction_id=data.get('transaction_id', f'TXN-{secrets.token_hex(8).upper()}')
        )
        
        db.session.add(order)
        db.session.flush()
        
        for cart_item in cart_items:
            order_item = OrderItem(order_id=order.id, product_id=cart_item.product_id, quantity=cart_item.quantity, price=cart_item.product.price)
            db.session.add(order_item)
        
        CartItem.query.filter_by(user_id=int(user_id)).delete()
        
        db.session.commit()
        
        try:
            user = User.query.get(int(user_id))
            send_order_confirmation(user.email, user.name, order.id, total_price)
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
        
        return jsonify({'message': 'Order created successfully', 'order': order.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ADD THESE ROUTES TO app.py - paste them right after the GET /api/products route

@app.route('/api/products', methods=['POST'])
@jwt_required()
def create_product():
    """Admin: Create new product"""
    try:
        data = request.get_json()
        product = Product(
            name=data.get('name'),
            category=data.get('category'),
            price=float(data.get('price', 0)),
            stock=int(data.get('stock', 0)),
            description=data.get('description', ''),
            image_url=data.get('image_url', '')
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({'message': 'Product created', 'product': product.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Admin: Update product"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        data = request.get_json()
        if data.get('name'):
            product.name = data['name']
        if data.get('price') is not None:
            product.price = float(data['price'])
        if data.get('stock') is not None:
            product.stock = int(data['stock'])
        if data.get('category'):
            product.category = data['category']
        if data.get('description') is not None:
            product.description = data['description']
        if data.get('image_url') is not None:
            product.image_url = data['image_url']

        db.session.commit()
        return jsonify({'message': 'Product updated', 'product': product.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Admin: Delete product"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted'}), 200
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
        total_orders = Order.query.count()
        total_customers = User.query.filter_by(role='customer').count()
        total_drivers = Driver.query.filter_by(approved=True).count()
        
        completed_orders = Order.query.filter_by(payment_status='completed').all()
        total_revenue = sum(order.total_price for order in completed_orders)
        
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
        
        return jsonify({
            'stats': {
                'total_orders': total_orders,
                'total_customers': total_customers,
                'total_drivers': total_drivers,
                'total_revenue': total_revenue,
            },
            'recent_orders': [order.to_dict() for order in recent_orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# M-PESA ROUTES
# ============================================

from mpesa import mpesa

@app.route('/api/mpesa/stk-push', methods=['POST'])
@jwt_required()
def mpesa_stk_push():
    """Initiate M-Pesa STK Push"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        phone_number = data.get('phone_number')
        amount = data.get('amount')
        order_id = data.get('order_id', 'ORDER')
        
        if not all([phone_number, amount]):
            return jsonify({'error': 'Phone number and amount required'}), 400
        
        result = mpesa.stk_push(
            phone_number=phone_number,
            amount=amount,
            account_reference=f'NOORY-{order_id}',
            transaction_desc='Noory Shop Payment'
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'message': 'Please check your phone for M-Pesa prompt',
                'checkout_request_id': result.get('checkout_request_id'),
                'merchant_request_id': result.get('merchant_request_id')
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('message', 'Payment failed')
            }), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """M-Pesa callback endpoint"""
    try:
        data = request.get_json()
        print("M-Pesa Callback:", data)
        
        result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
        
        if result_code == 0:
            callback_metadata = data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {}).get('Item', [])
            
            payment_details = {}
            for item in callback_metadata:
                payment_details[item.get('Name')] = item.get('Value')
            
            print("Payment Successful:", payment_details)
        else:
            print("Payment Failed")
        
        return jsonify({'ResultCode': 0, 'ResultDesc': 'Accepted'}), 200
        
    except Exception as e:
        print(f"Callback error: {e}")
        return jsonify({'ResultCode': 1, 'ResultDesc': 'Failed'}), 500


@app.route('/api/mpesa/query/<checkout_request_id>', methods=['GET'])
@jwt_required()
def query_mpesa_status(checkout_request_id):
    """Query M-Pesa transaction status"""
    try:
        result = mpesa.query_stk_status(checkout_request_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# HEALTH CHECK
# ============================================

@app.route('/', methods=['GET'])
def home():
    """Home route"""
    return jsonify({'message': 'Noory Shop API', 'version': '1.0.0', 'status': 'running'}), 200


@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'healthy'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)