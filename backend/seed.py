from app import app, db
from models import Product

def seed_products():
    with app.app_context():
        # Clear existing products
        Product.query.delete()
        
        products = []
        
        # Vegetables (40 items)
        vegetables = [
            ('Sukuma Wiki Fresh Bundle', 'vegetables', 30, 250, 'Fresh kale from local farms'),
            ('Spinach Organic 500g', 'vegetables', 40, 220, 'Organic baby spinach'),
            ('Cabbage Whole Head', 'vegetables', 50, 200, 'Fresh green cabbage'),
            ('Tomatoes Ripe 1kg', 'vegetables', 80, 300, 'Juicy red tomatoes'),
            ('Red Onions 1kg', 'vegetables', 60, 350, 'Fresh red onions'),
            ('Carrots Sweet 1kg', 'vegetables', 70, 280, 'Crunchy sweet carrots'),
            ('Irish Potatoes 2kg', 'vegetables', 100, 320, 'Fresh potatoes'),
            ('Green Bell Pepper', 'vegetables', 20, 250, 'Fresh green peppers'),
            ('Cucumber Fresh', 'vegetables', 25, 230, 'Crispy cucumbers'),
            ('Lettuce Head', 'vegetables', 35, 200, 'Fresh lettuce'),
            ('Broccoli 500g', 'vegetables', 90, 180, 'Fresh broccoli florets'),
            ('Cauliflower Head', 'vegetables', 85, 190, 'White cauliflower'),
            ('Dhania Fresh Bundle', 'vegetables', 20, 280, 'Coriander leaves'),
            ('Spring Onions Bundle', 'vegetables', 25, 260, 'Fresh green onions'),
            ('Garlic Bulbs 250g', 'vegetables', 150, 220, 'Fresh garlic'),
            ('Ginger Root 250g', 'vegetables', 120, 240, 'Fresh ginger'),
            ('Beetroot 500g', 'vegetables', 60, 200, 'Red beetroots'),
            ('Sweet Potato 1kg', 'vegetables', 80, 250, 'Orange sweet potatoes'),
            ('Pumpkin Whole', 'vegetables', 100, 180, 'Fresh pumpkin'),
            ('Eggplant 500g', 'vegetables', 45, 210, 'Fresh eggplant'),
            ('Red Bell Pepper', 'vegetables', 30, 200, 'Sweet red peppers'),
            ('Yellow Bell Pepper', 'vegetables', 30, 190, 'Yellow peppers'),
            ('Zucchini 500g', 'vegetables', 50, 170, 'Fresh zucchini'),
            ('Mushrooms 250g', 'vegetables', 180, 150, 'Button mushrooms'),
            ('Baby Corn Pack', 'vegetables', 120, 180, 'Fresh baby corn'),
            ('Green Beans 500g', 'vegetables', 90, 200, 'French beans'),
            ('Garden Peas 500g', 'vegetables', 100, 180, 'Fresh peas'),
            ('Leeks Fresh', 'vegetables', 60, 160, 'Fresh leeks'),
            ('Celery Fresh', 'vegetables', 70, 150, 'Fresh celery'),
            ('Arrowroots 1kg', 'vegetables', 110, 200, 'Fresh arrowroots'),
            ('Cherry Tomatoes 250g', 'vegetables', 100, 180, 'Sweet cherry tomatoes'),
            ('Kale Leaves Bundle', 'vegetables', 35, 240, 'Curly kale'),
            ('Swiss Chard Bundle', 'vegetables', 40, 200, 'Rainbow chard'),
            ('Pak Choi Bundle', 'vegetables', 45, 180, 'Chinese cabbage'),
            ('Butternut Squash', 'vegetables', 80, 160, 'Fresh squash'),
            ('Radish Bundle', 'vegetables', 30, 190, 'Fresh radishes'),
            ('Turnips 500g', 'vegetables', 50, 170, 'Fresh turnips'),
            ('Chili Peppers 100g', 'vegetables', 40, 220, 'Hot chilies'),
            ('Parsley Fresh Bundle', 'vegetables', 25, 200, 'Fresh parsley'),
            ('Mint Fresh Bundle', 'vegetables', 25, 200, 'Fresh mint leaves'),
        ]
        
        for name, cat, price, stock, desc in vegetables:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Fruits (40 items)
        fruits = [
            ('Bananas Sweet Dozen', 'fruits', 120, 300, 'Ripe sweet bananas'),
            ('Red Apples 1kg', 'fruits', 250, 250, 'Crispy red apples'),
            ('Oranges Juicy 1kg', 'fruits', 150, 280, 'Fresh oranges'),
            ('Kenya Mangoes', 'fruits', 50, 350, 'Sweet mangoes'),
            ('Watermelon Large', 'fruits', 200, 220, 'Fresh watermelon'),
            ('Pineapple Sweet', 'fruits', 100, 240, 'Ripe pineapple'),
            ('Papaya Ripe', 'fruits', 80, 210, 'Fresh papaya'),
            ('Avocado Hass', 'fruits', 30, 300, 'Creamy avocados'),
            ('Passion Fruit 6pcs', 'fruits', 60, 260, 'Sweet passion fruits'),
            ('Grapes Seedless 500g', 'fruits', 180, 200, 'Green grapes'),
            ('Strawberries 250g', 'fruits', 200, 180, 'Fresh strawberries'),
            ('Lemons Fresh 4pcs', 'fruits', 40, 280, 'Juicy lemons'),
            ('Tangerines 1kg', 'fruits', 130, 230, 'Sweet tangerines'),
            ('Plums 500g', 'fruits', 150, 200, 'Juicy plums'),
            ('Pears Sweet 1kg', 'fruits', 220, 190, 'Soft pears'),
            ('Guava Fresh', 'fruits', 25, 250, 'Ripe guavas'),
            ('Coconut Fresh', 'fruits', 80, 210, 'Fresh coconut'),
            ('Tree Tomato', 'fruits', 100, 200, 'Tamarillo'),
            ('Sugar Cane Piece', 'fruits', 40, 240, 'Sweet sugarcane'),
            ('Custard Apple', 'fruits', 50, 180, 'Ripe custard apple'),
            ('Green Apples 1kg', 'fruits', 260, 220, 'Tart apples'),
            ('Dragon Fruit', 'fruits', 120, 140, 'Exotic dragon fruit'),
            ('Kiwi Fruit 4pcs', 'fruits', 200, 160, 'Fresh kiwi'),
            ('Pomegranate', 'fruits', 150, 150, 'Juicy pomegranate'),
            ('Blueberries 125g', 'fruits', 280, 120, 'Fresh blueberries'),
            ('Blackberries 125g', 'fruits', 250, 110, 'Fresh blackberries'),
            ('Cherries 250g', 'fruits', 350, 100, 'Sweet cherries'),
            ('Dates 250g', 'fruits', 180, 180, 'Medjool dates'),
            ('Figs Fresh Pack', 'fruits', 200, 130, 'Fresh figs'),
            ('Star Fruit', 'fruits', 80, 140, 'Carambola'),
            ('Lychee 250g', 'fruits', 180, 120, 'Sweet lychees'),
            ('Rambutan 250g', 'fruits', 200, 100, 'Fresh rambutan'),
            ('Persimmon', 'fruits', 70, 130, 'Sweet persimmon'),
            ('Mulberries 150g', 'fruits', 180, 90, 'Fresh mulberries'),
            ('Gooseberries 200g', 'fruits', 150, 100, 'Tart gooseberries'),
            ('Cantaloupe Melon', 'fruits', 150, 160, 'Sweet melon'),
            ('Honeydew Melon', 'fruits', 160, 150, 'Green melon'),
            ('Grapefruit', 'fruits', 60, 180, 'Pink grapefruit'),
            ('Lime Fresh 6pcs', 'fruits', 50, 220, 'Fresh limes'),
            ('Nectarines 500g', 'fruits', 180, 140, 'Sweet nectarines'),
        ]
        
        for name, cat, price, stock, desc in fruits:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Meat (30 items)
        meat = [
            ('Beef Steak 500g', 'meat', 400, 180, 'Premium beef steak'),
            ('Beef Stew 1kg', 'meat', 600, 200, 'Stewing beef'),
            ('Minced Beef 500g', 'meat', 300, 220, 'Fresh mince'),
            ('Beef Bones 1kg', 'meat', 200, 210, 'Soup bones'),
            ('Goat Meat 1kg', 'meat', 800, 160, 'Fresh goat'),
            ('Mutton 1kg', 'meat', 750, 150, 'Fresh mutton'),
            ('Pork Chops 500g', 'meat', 350, 170, 'Pork chops'),
            ('Beef Sausages 500g', 'meat', 280, 240, 'Beef sausages'),
            ('Bacon Smoked 250g', 'meat', 300, 200, 'Crispy bacon'),
            ('Beef Liver 500g', 'meat', 250, 180, 'Fresh liver'),
            ('Tripe Matumbo 500g', 'meat', 180, 190, 'Beef tripe'),
            ('Beef Ribs 1kg', 'meat', 550, 170, 'Beef ribs'),
            ('Smokies 500g', 'meat', 250, 250, 'Cocktail sausages'),
            ('Corned Beef 340g', 'meat', 280, 220, 'Canned beef'),
            ('Salami 200g', 'meat', 320, 180, 'Sliced salami'),
            ('Beef Patties Pack 4', 'meat', 350, 170, 'Burger patties'),
            ('Lamb Chops 500g', 'meat', 650, 130, 'Lamb chops'),
            ('T-Bone Steak 500g', 'meat', 500, 140, 'T-bone steak'),
            ('Beef Fillet 500g', 'meat', 600, 130, 'Tender fillet'),
            ('Pork Belly 500g', 'meat', 380, 150, 'Pork belly'),
            ('Beef Brisket 1kg', 'meat', 650, 140, 'Slow cook brisket'),
            ('Lamb Leg 1kg', 'meat', 900, 100, 'Whole leg'),
            ('Beef Tongue 500g', 'meat', 350, 120, 'Beef tongue'),
            ('Oxtail 1kg', 'meat', 700, 110, 'Beef oxtail'),
            ('Pork Ribs 1kg', 'meat', 550, 140, 'Pork ribs'),
            ('Ham Sliced 200g', 'meat', 300, 180, 'Deli ham'),
            ('Pastrami 200g', 'meat', 350, 150, 'Smoked pastrami'),
            ('Chorizo 250g', 'meat', 320, 140, 'Spicy sausage'),
            ('Pepperoni 150g', 'meat', 280, 160, 'Pizza pepperoni'),
            ('Meat Balls 500g', 'meat', 320, 170, 'Beef meatballs'),
        ]
        
        for name, cat, price, stock, desc in meat:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Poultry (25 items)
        poultry = [
            ('Whole Chicken 1.5kg', 'poultry', 650, 220, 'Fresh chicken'),
            ('Chicken Breasts 500g', 'poultry', 350, 250, 'Boneless breasts'),
            ('Chicken Thighs 1kg', 'poultry', 450, 240, 'Chicken thighs'),
            ('Chicken Wings 1kg', 'poultry', 400, 230, 'Chicken wings'),
            ('Drumsticks 1kg', 'poultry', 420, 235, 'Chicken drumsticks'),
            ('Chicken Gizzards 500g', 'poultry', 200, 200, 'Fresh gizzards'),
            ('Farm Eggs Tray 30', 'poultry', 450, 300, 'Fresh eggs'),
            ('Whole Turkey', 'poultry', 1800, 80, 'Whole turkey'),
            ('Duck Whole', 'poultry', 1200, 60, 'Fresh duck'),
            ('Quail Eggs 12pcs', 'poultry', 180, 170, 'Quail eggs'),
            ('Chicken Mince 500g', 'poultry', 280, 200, 'Minced chicken'),
            ('Chicken Livers 500g', 'poultry', 180, 180, 'Chicken livers'),
            ('Chicken Sausages 500g', 'poultry', 300, 210, 'Chicken sausages'),
            ('Smoked Chicken', 'poultry', 900, 110, 'Whole smoked'),
            ('Turkey Sausages 500g', 'poultry', 380, 150, 'Turkey sausages'),
            ('Chicken Nuggets 500g', 'poultry', 320, 190, 'Breaded nuggets'),
            ('Chicken Strips 500g', 'poultry', 330, 180, 'Breaded strips'),
            ('Ground Turkey 500g', 'poultry', 350, 140, 'Turkey mince'),
            ('Duck Breast 500g', 'poultry', 700, 90, 'Duck breast'),
            ('Turkey Breast 500g', 'poultry', 450, 120, 'Turkey breast'),
            ('Chicken Stock 1L', 'poultry', 150, 160, 'Chicken broth'),
            ('Cornish Hen', 'poultry', 600, 80, 'Small hen'),
            ('Free Range Eggs 12', 'poultry', 280, 200, 'Organic eggs'),
            ('Duck Eggs 6pcs', 'poultry', 200, 130, 'Duck eggs'),
            ('Turkey Wings 1kg', 'poultry', 500, 110, 'Turkey wings'),
        ]
        
        for name, cat, price, stock, desc in poultry:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Fish (25 items)
        fish = [
            ('Tilapia Fresh 1kg', 'fish', 600, 200, 'Fresh tilapia'),
            ('Nile Perch 1kg', 'fish', 700, 180, 'Fresh perch'),
            ('Salmon Fillet 500g', 'fish', 900, 150, 'Salmon fillet'),
            ('Tuna Canned 200g', 'fish', 180, 280, 'Canned tuna'),
            ('Sardines Canned', 'fish', 120, 300, 'Sardines in oil'),
            ('Prawns Fresh 500g', 'fish', 800, 160, 'Fresh prawns'),
            ('Octopus 500g', 'fish', 650, 140, 'Fresh octopus'),
            ('Squid 500g', 'fish', 600, 150, 'Fresh squid'),
            ('Mackerel Canned', 'fish', 140, 250, 'Canned mackerel'),
            ('Omena Dry 500g', 'fish', 150, 230, 'Silver fish'),
            ('Catfish 1kg', 'fish', 550, 150, 'Fresh catfish'),
            ('Crab 500g', 'fish', 700, 120, 'Fresh crab'),
            ('Lobster 500g', 'fish', 1200, 80, 'Fresh lobster'),
            ('Mussels 500g', 'fish', 400, 130, 'Fresh mussels'),
            ('Fish Fingers Pack', 'fish', 280, 190, 'Breaded fish'),
            ('Smoked Fish 500g', 'fish', 450, 140, 'Smoked tilapia'),
            ('Cod Fillet 500g', 'fish', 750, 110, 'Cod fillet'),
            ('Haddock 500g', 'fish', 680, 100, 'Fresh haddock'),
            ('Sea Bass 1kg', 'fish', 850, 90, 'Fresh sea bass'),
            ('Oysters 6pcs', 'fish', 500, 80, 'Fresh oysters'),
            ('Clams 500g', 'fish', 450, 100, 'Fresh clams'),
            ('Anchovies Canned', 'fish', 160, 180, 'Canned anchovies'),
            ('Herring Pickled', 'fish', 200, 140, 'Pickled herring'),
            ('Trout Fresh 500g', 'fish', 650, 100, 'Rainbow trout'),
            ('Swordfish Steak 500g', 'fish', 950, 70, 'Swordfish steak'),
        ]
        
        for name, cat, price, stock, desc in fish:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Dairy (30 items)
        dairy = [
            ('Fresh Milk 1L', 'dairy', 120, 350, 'Fresh cow milk'),
            ('Mala 500ml', 'dairy', 60, 300, 'Fermented milk'),
            ('Yogurt 500ml', 'dairy', 100, 280, 'Fruit yogurt'),
            ('Cheddar Cheese 200g', 'dairy', 250, 220, 'Cheddar cheese'),
            ('Butter 500g', 'dairy', 350, 240, 'Salted butter'),
            ('Margarine 500g', 'dairy', 180, 300, 'Blue band'),
            ('Fresh Cream 250ml', 'dairy', 150, 200, 'Fresh cream'),
            ('Buttermilk 500ml', 'dairy', 80, 210, 'Buttermilk'),
            ('Ghee 500ml', 'dairy', 400, 180, 'Pure ghee'),
            ('Milk Powder 1kg', 'dairy', 550, 250, 'Full cream powder'),
            ('Ice Cream 1L', 'dairy', 280, 200, 'Vanilla ice cream'),
            ('Cottage Cheese 250g', 'dairy', 200, 170, 'Cottage cheese'),
            ('Sour Cream 200ml', 'dairy', 120, 180, 'Sour cream'),
            ('Condensed Milk 397g', 'dairy', 180, 250, 'Sweetened milk'),
            ('Evaporated Milk 340g', 'dairy', 120, 270, 'Evaporated milk'),
            ('Greek Yogurt 500ml', 'dairy', 150, 170, 'Greek yogurt'),
            ('Chocolate Milk 500ml', 'dairy', 90, 220, 'Flavored milk'),
            ('Mozzarella 200g', 'dairy', 280, 160, 'Mozzarella cheese'),
            ('Parmesan 100g', 'dairy', 350, 130, 'Parmesan cheese'),
            ('Whipping Cream 250ml', 'dairy', 180, 150, 'Heavy cream'),
            ('Cream Cheese 200g', 'dairy', 220, 160, 'Cream cheese'),
            ('Feta Cheese 200g', 'dairy', 240, 140, 'Feta cheese'),
            ('Blue Cheese 150g', 'dairy', 300, 100, 'Blue cheese'),
            ('Gouda Cheese 200g', 'dairy', 270, 130, 'Gouda cheese'),
            ('Brie Cheese 150g', 'dairy', 320, 90, 'Brie cheese'),
            ('String Cheese Pack', 'dairy', 180, 170, 'String cheese'),
            ('Cheese Slices 200g', 'dairy', 200, 200, 'Processed slices'),
            ('Kefir 500ml', 'dairy', 110, 150, 'Fermented kefir'),
            ('Almond Milk 1L', 'dairy', 180, 140, 'Plant-based milk'),
            ('Oat Milk 1L', 'dairy', 170, 130, 'Plant-based milk'),
        ]
        
        for name, cat, price, stock, desc in dairy:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Beverages (40 items)
        beverages = [
            ('Coca Cola 500ml', 'beverages', 60, 450, 'Coke'),
            ('Fanta Orange 500ml', 'beverages', 60, 430, 'Orange soda'),
            ('Sprite 500ml', 'beverages', 60, 420, 'Lemon soda'),
            ('Mineral Water 500ml', 'beverages', 30, 600, 'Bottled water'),
            ('Fruit Juice 1L', 'beverages', 120, 300, 'Mixed juice'),
            ('Mango Juice 500ml', 'beverages', 70, 330, 'Mango juice'),
            ('Coffee Instant 100g', 'beverages', 180, 250, 'Instant coffee'),
            ('Tea Leaves 250g', 'beverages', 120, 300, 'Kenya tea'),
            ('Hot Chocolate 250g', 'beverages', 200, 220, 'Chocolate drink'),
            ('Energy Drink 250ml', 'beverages', 150, 250, 'Energy boost'),
            ('Water 1.5L', 'beverages', 50, 550, 'Drinking water'),
            ('Apple Juice 1L', 'beverages', 150, 270, 'Apple juice'),
            ('Orange Juice 1L', 'beverages', 140, 280, 'Orange juice'),
            ('Pineapple Juice 1L', 'beverages', 130, 260, 'Pineapple juice'),
            ('Ginger Tea 20bags', 'beverages', 180, 230, 'Ginger tea'),
            ('Green Tea 20bags', 'beverages', 200, 220, 'Green tea'),
            ('Lemonade 500ml', 'beverages', 80, 290, 'Fresh lemonade'),
            ('Milkshake 500ml', 'beverages', 120, 230, 'Chocolate shake'),
            ('Coconut Water 500ml', 'beverages', 100, 250, 'Natural coconut'),
            ('Passion Juice 500ml', 'beverages', 90, 260, 'Passion juice'),
            ('Pepsi 500ml', 'beverages', 60, 400, 'Pepsi cola'),
            ('Mountain Dew 500ml', 'beverages', 60, 370, 'Mountain dew'),
            ('Mirinda 500ml', 'beverages', 60, 360, 'Orange soda'),
            ('Stoney 500ml', 'beverages', 60, 390, 'Ginger drink'),
            ('Alvaro 500ml', 'beverages', 80, 300, 'Fruit juice'),
            ('Soda Water 500ml', 'beverages', 50, 350, 'Soda water'),
            ('Iced Coffee 500ml', 'beverages', 120, 220, 'Cold coffee'),
            ('Strawberry Juice 1L', 'beverages', 150, 200, 'Strawberry juice'),
            ('Guava Juice 500ml', 'beverages', 90, 240, 'Guava juice'),
            ('Herbal Tea 20bags', 'beverages', 180, 180, 'Herbal tea'),
            ('Black Tea 20bags', 'beverages', 150, 260, 'Black tea'),
            ('Chamomile Tea 20bags', 'beverages', 200, 170, 'Chamomile tea'),
            ('Peppermint Tea 20bags', 'beverages', 190, 180, 'Mint tea'),
            ('Lemon Tea 20bags', 'beverages', 170, 190, 'Lemon tea'),
            ('Iced Tea 500ml', 'beverages', 70, 280, 'Peach iced tea'),
            ('Cranberry Juice 1L', 'beverages', 160, 180, 'Cranberry juice'),
            ('Grape Juice 1L', 'beverages', 140, 200, 'Grape juice'),
            ('Tomato Juice 1L', 'beverages', 130, 170, 'Tomato juice'),
            ('Carrot Juice 500ml', 'beverages', 100, 190, 'Carrot juice'),
            ('Beetroot Juice 500ml', 'beverages', 110, 170, 'Beetroot juice'),
        ]
        
        for name, cat, price, stock, desc in beverages:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Snacks (40 items)
        snacks = [
            ('Potato Crisps 150g', 'snacks', 100, 350, 'Crispy chips'),
            ('Biscuits 300g', 'snacks', 120, 330, 'Assorted biscuits'),
            ('Peanuts 250g', 'snacks', 80, 300, 'Roasted peanuts'),
            ('Popcorn 100g', 'snacks', 50, 310, 'Butter popcorn'),
            ('Chocolate Bar', 'snacks', 80, 350, 'Milk chocolate'),
            ('Sweets 200g', 'snacks', 60, 330, 'Mixed sweets'),
            ('Chewing Gum Pack', 'snacks', 40, 370, 'Mint gum'),
            ('Cake Slice', 'snacks', 100, 220, 'Chocolate cake'),
            ('Cookies 200g', 'snacks', 140, 270, 'Chip cookies'),
            ('Crackers 200g', 'snacks', 90, 290, 'Salted crackers'),
            ('Pretzels 150g', 'snacks', 110, 240, 'Salty pretzels'),
            ('Mixed Nuts 250g', 'snacks', 200, 230, 'Mixed nuts'),
            ('Granola Bars 6pack', 'snacks', 180, 260, 'Energy bars'),
            ('Fruit Roll Pack', 'snacks', 70, 280, 'Fruit snack'),
            ('Corn Chips 150g', 'snacks', 120, 290, 'Nacho chips'),
            ('Rice Cakes Pack', 'snacks', 100, 240, 'Plain rice cakes'),
            ('Trail Mix 200g', 'snacks', 180, 220, 'Nuts & fruits'),
            ('Beef Jerky 50g', 'snacks', 150, 200, 'Dried beef'),
            ('Cheese Puffs 100g', 'snacks', 90, 300, 'Cheese snack'),
            ('Samosas 4pack', 'snacks', 80, 240, 'Veg samosas'),
            ('Cashew Nuts 200g', 'snacks', 280, 190, 'Roasted cashews'),
            ('Macadamia 150g', 'snacks', 350, 150, 'Premium nuts'),
            ('Plantain Chips 150g', 'snacks', 90, 250, 'Crispy plantain'),
            ('Beef Samosas 4pack', 'snacks', 100, 230, 'Beef samosas'),
            ('Chapati Crisps 100g', 'snacks', 70, 270, 'Chapati snack'),
            ('Honey Peanuts 250g', 'snacks', 100, 240, 'Sweet peanuts'),
            ('Cheese Balls 150g', 'snacks', 100, 280, 'Cheese snack'),
            ('Coconut Biscuits 200g', 'snacks', 100, 260, 'Coconut cookies'),
            ('Dark Chocolate Bar', 'snacks', 120, 220, 'Dark chocolate'),
            ('White Chocolate Bar', 'snacks', 120, 210, 'White chocolate'),
            ('Wafer Biscuits 200g', 'snacks', 110, 250, 'Cream wafers'),
            ('Marshmallows 200g', 'snacks', 90, 230, 'Soft marshmallows'),
            ('Muffins 4pack', 'snacks', 150, 180, 'Chocolate muffins'),
            ('Brownies 4pack', 'snacks', 160, 170, 'Fudge brownies'),
            ('Donuts 6pack', 'snacks', 180, 200, 'Sugar donuts'),
            ('Cupcakes 4pack', 'snacks', 200, 160, 'Decorated cupcakes'),
            ('Protein Bars 6pack', 'snacks', 250, 140, 'Protein bars'),
            ('Dried Mango 150g', 'snacks', 130, 180, 'Dried fruit'),
            ('Dried Pineapple 150g', 'snacks', 140, 170, 'Dried fruit'),
            ('Energy Balls 6pack', 'snacks', 180, 150, 'Date balls'),
        ]
        
        for name, cat, price, stock, desc in snacks:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Bakery (20 items)
        bakery = [
            ('White Bread 400g', 'bakery', 50, 350, 'Fresh bread'),
            ('Brown Bread 400g', 'bakery', 60, 330, 'Whole wheat'),
            ('Chapati 5pack', 'bakery', 100, 300, 'Soft chapatis'),
            ('Mandazi 6pack', 'bakery', 60, 310, 'Sweet mandazi'),
            ('Doughnuts 6pack', 'bakery', 120, 240, 'Sugar donuts'),
            ('Croissants 4pack', 'bakery', 150, 220, 'Butter croissants'),
            ('Buns 6pack', 'bakery', 80, 290, 'Soft buns'),
            ('Pizza Base', 'bakery', 100, 230, 'Ready pizza base'),
            ('Pita Bread 6pack', 'bakery', 90, 240, 'Pita pockets'),
            ('French Loaf', 'bakery', 70, 270, 'Crispy French'),
            ('Bagels 4pack', 'bakery', 120, 190, 'Plain bagels'),
            ('English Muffins 6pack', 'bakery', 100, 200, 'Muffins'),
            ('Cinnamon Rolls 4pack', 'bakery', 150, 170, 'Sweet rolls'),
            ('Garlic Bread', 'bakery', 80, 220, 'Garlic butter'),
            ('Brioche Buns 4pack', 'bakery', 140, 180, 'Soft brioche'),
            ('Sourdough Loaf', 'bakery', 120, 160, 'Artisan bread'),
            ('Rye Bread', 'bakery', 90, 170, 'Dark rye'),
            ('Multigrain Bread', 'bakery', 80, 200, 'Seeded bread'),
            ('Dinner Rolls 8pack', 'bakery', 100, 210, 'Soft rolls'),
            ('Pretzel Buns 4pack', 'bakery', 130, 150, 'Pretzel buns'),
        ]
        
        for name, cat, price, stock, desc in bakery:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Flour & Grains (30 items)
        grains = [
            ('Maize Flour 2kg', 'flour', 180, 400, 'Unga wa mahindi'),
            ('Wheat Flour 2kg', 'flour', 200, 370, 'All purpose'),
            ('Pishori Rice 2kg', 'grains', 250, 350, 'Pishori rice'),
            ('Spaghetti 500g', 'grains', 120, 330, 'Pasta'),
            ('Oats 500g', 'grains', 150, 290, 'Rolled oats'),
            ('Atta Flour 2kg', 'flour', 220, 300, 'Chapati flour'),
            ('Self-Raising 1kg', 'flour', 140, 310, 'Baking flour'),
            ('Instant Noodles Pack', 'grains', 40, 500, 'Quick noodles'),
            ('Corn Flour 1kg', 'flour', 120, 330, 'Corn starch'),
            ('Millet Flour 1kg', 'flour', 150, 240, 'Wimbi flour'),
            ('Sorghum Flour 1kg', 'flour', 140, 230, 'Mtama flour'),
            ('Rice Flour 500g', 'flour', 100, 270, 'Ground rice'),
            ('Barley 500g', 'grains', 130, 220, 'Pearl barley'),
            ('Couscous 500g', 'grains', 180, 200, 'Instant couscous'),
            ('Quinoa 500g', 'grains', 350, 180, 'White quinoa'),
            ('Basmati Rice 2kg', 'grains', 350, 240, 'Basmati rice'),
            ('Brown Rice 2kg', 'grains', 280, 220, 'Brown rice'),
            ('Macaroni 500g', 'grains', 130, 300, 'Macaroni pasta'),
            ('Penne 500g', 'grains', 140, 290, 'Penne pasta'),
            ('Vermicelli 500g', 'grains', 110, 270, 'Thin noodles'),
            ('Fusilli 500g', 'grains', 135, 260, 'Spiral pasta'),
            ('Lasagna Sheets', 'grains', 160, 200, 'Pasta sheets'),
            ('Egg Noodles 500g', 'grains', 150, 240, 'Egg noodles'),
            ('Wild Rice 500g', 'grains', 320, 150, 'Wild rice'),
            ('Jasmine Rice 2kg', 'grains', 300, 210, 'Jasmine rice'),
            ('Arborio Rice 1kg', 'grains', 280, 170, 'Risotto rice'),
            ('Buckwheat 500g', 'grains', 200, 180, 'Buckwheat'),
            ('Cornmeal 1kg', 'grains', 140, 250, 'Corn meal'),
            ('Semolina 1kg', 'grains', 160, 230, 'Semolina'),
            ('Bread Flour 1kg', 'flour', 150, 260, 'Strong flour'),
        ]
        
        for name, cat, price, stock, desc in grains:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Spices (30 items)
        spices = [
            ('Salt 500g', 'spices', 40, 500, 'Table salt'),
            ('Black Pepper 50g', 'spices', 80, 300, 'Ground pepper'),
            ('Curry Powder 50g', 'spices', 100, 290, 'Curry spice'),
            ('Turmeric 50g', 'spices', 90, 280, 'Ground turmeric'),
            ('Cumin 50g', 'spices', 110, 270, 'Cumin seeds'),
            ('Cinnamon 50g', 'spices', 100, 260, 'Cinnamon sticks'),
            ('Paprika 50g', 'spices', 120, 250, 'Smoked paprika'),
            ('Chili Powder 50g', 'spices', 80, 290, 'Hot chili'),
            ('Mixed Herbs 30g', 'spices', 100, 230, 'Italian herbs'),
            ('Cardamom 30g', 'spices', 150, 220, 'Green cardamom'),
            ('Cloves 30g', 'spices', 120, 230, 'Whole cloves'),
            ('Nutmeg 30g', 'spices', 130, 210, 'Ground nutmeg'),
            ('Bay Leaves 20g', 'spices', 80, 240, 'Dry bay leaves'),
            ('Thyme 20g', 'spices', 90, 220, 'Dry thyme'),
            ('Oregano 20g', 'spices', 90, 220, 'Dry oregano'),
            ('Garam Masala 50g', 'spices', 120, 200, 'Indian spice'),
            ('Chili Flakes 50g', 'spices', 100, 230, 'Crushed chili'),
            ('Garlic Powder 50g', 'spices', 100, 240, 'Garlic powder'),
            ('Onion Powder 50g', 'spices', 100, 240, 'Onion powder'),
            ('Mixed Spice 50g', 'spices', 110, 220, 'Baking spice'),
            ('Coriander 50g', 'spices', 90, 230, 'Ground coriander'),
            ('Fennel Seeds 50g', 'spices', 100, 210, 'Fennel seeds'),
            ('Star Anise 30g', 'spices', 140, 180, 'Star anise'),
            ('Rosemary 20g', 'spices', 100, 200, 'Dry rosemary'),
            ('Basil 20g', 'spices', 90, 210, 'Dry basil'),
            ('Sage 20g', 'spices', 100, 190, 'Dry sage'),
            ('Dill 20g', 'spices', 90, 200, 'Dry dill'),
            ('Parsley Dried 20g', 'spices', 80, 210, 'Dry parsley'),
            ('Celery Salt 100g', 'spices', 100, 200, 'Celery salt'),
            ('Mustard Seeds 50g', 'spices', 90, 210, 'Yellow mustard'),
        ]
        
        for name, cat, price, stock, desc in spices:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Cooking Oil (15 items)
        oils = [
            ('Vegetable Oil 2L', 'cooking_oil', 450, 350, 'Cooking oil'),
            ('Olive Oil 500ml', 'cooking_oil', 650, 220, 'Extra virgin'),
            ('Sunflower Oil 1L', 'cooking_oil', 280, 300, 'Sunflower oil'),
            ('Coconut Oil 500ml', 'cooking_oil', 400, 230, 'Virgin coconut'),
            ('Palm Oil 1L', 'cooking_oil', 300, 240, 'Red palm oil'),
            ('Sesame Oil 250ml', 'cooking_oil', 350, 190, 'Sesame oil'),
            ('Canola Oil 1L', 'cooking_oil', 320, 270, 'Canola oil'),
            ('Avocado Oil 250ml', 'cooking_oil', 550, 180, 'Avocado oil'),
            ('Vegetable Oil 1L', 'cooking_oil', 240, 330, 'Cooking oil'),
            ('Groundnut Oil 1L', 'cooking_oil', 300, 230, 'Peanut oil'),
            ('Corn Oil 1L', 'cooking_oil', 280, 240, 'Corn oil'),
            ('Blended Oil 2L', 'cooking_oil', 400, 290, 'Mixed oil'),
            ('Grapeseed Oil 500ml', 'cooking_oil', 380, 160, 'Grapeseed oil'),
            ('Walnut Oil 250ml', 'cooking_oil', 420, 140, 'Walnut oil'),
            ('Flaxseed Oil 250ml', 'cooking_oil', 400, 150, 'Flax oil'),
        ]
        
        for name, cat, price, stock, desc in oils:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Household (25 items)
        household = [
            ('Toilet Paper 4rolls', 'household', 150, 350, 'Soft tissue'),
            ('Soap Bars 3pack', 'household', 120, 400, 'Bathing soap'),
            ('Detergent 1kg', 'household', 180, 330, 'Washing powder'),
            ('Dish Soap 500ml', 'household', 100, 350, 'Dish liquid'),
            ('Bleach 1L', 'household', 120, 300, 'Cleaning bleach'),
            ('Air Freshener 300ml', 'household', 200, 240, 'Room spray'),
            ('Matches Box', 'household', 20, 600, 'Safety matches'),
            ('Candles 5pack', 'household', 100, 330, 'White candles'),
            ('Garbage Bags 20pcs', 'household', 120, 300, 'Heavy duty'),
            ('Sponges 3pack', 'household', 80, 350, 'Kitchen sponges'),
            ('Broom', 'household', 200, 240, 'Floor broom'),
            ('Mop', 'household', 250, 220, 'Wet mop'),
            ('Hangers 10pack', 'household', 150, 270, 'Plastic hangers'),
            ('Floor Wipes 50pack', 'household', 180, 230, 'Cleaning wipes'),
            ('Laundry Basket', 'household', 300, 180, 'Plastic basket'),
            ('Bucket 20L', 'household', 250, 220, 'Water bucket'),
            ('Disinfectant 1L', 'household', 180, 260, 'Surface cleaner'),
            ('Hand Soap 500ml', 'household', 120, 310, 'Liquid soap'),
            ('Glass Cleaner 500ml', 'household', 140, 240, 'Window cleaner'),
            ('Floor Cleaner 1L', 'household', 160, 250, 'Floor cleaner'),
            ('Toilet Cleaner 750ml', 'household', 150, 260, 'Toilet cleaner'),
            ('Fabric Softener 1L', 'household', 180, 230, 'Softener'),
            ('Dish Cloths 3pack', 'household', 90, 280, 'Dish cloths'),
            ('Trash Can', 'household', 350, 160, 'Waste bin'),
            ('Dust Pan & Brush', 'household', 180, 200, 'Cleaning set'),
        ]
        
        for name, cat, price, stock, desc in household:
            products.append(Product(name=name, category=cat, price=price, stock=stock, description=desc))
        
        # Add all products
        db.session.bulk_save_objects(products)
        db.session.commit()
        print(f"✅ Successfully seeded {len(products)} products!")

if __name__ == '__main__':
    seed_products()