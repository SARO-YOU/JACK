import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://noory-backend.onrender.com';

// ── PRODUCT IMAGES (keyword → Unsplash URL) ──────────────────────────────────
const PRODUCT_IMAGES = {
  // Vegetables
  'sukuma': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
  'kale': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
  'swiss chard': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
  'cabbage': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&fit=crop',
  'tomato': 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&fit=crop',
  'onion': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&fit=crop',
  'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&fit=crop',
  'potato': 'https://images.unsplash.com/photo-1518977676405-d052b9ea9b35?w=400&fit=crop',
  'sweet potato': 'https://images.unsplash.com/photo-1596097635092-a7870aac4e70?w=400&fit=crop',
  'pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&fit=crop',
  'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&fit=crop',
  'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&fit=crop',
  'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&fit=crop',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&fit=crop',
  'dhania': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&fit=crop',
  'coriander': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&fit=crop',
  'spring onion': 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=400&fit=crop',
  'garlic': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&fit=crop',
  'ginger': 'https://images.unsplash.com/photo-1615485500704-8e3b5a8b8c5b?w=400&fit=crop',
  'beetroot': 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&fit=crop',
  'pumpkin': 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&fit=crop',
  'butternut': 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&fit=crop',
  'eggplant': 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=400&fit=crop',
  'mushroom': 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400&fit=crop',
  'green bean': 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&fit=crop',
  'pea': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&fit=crop',
  'zucchini': 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&fit=crop',
  'leek': 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=400&fit=crop',
  'celery': 'https://images.unsplash.com/photo-1550411294-e9f8db83e132?w=400&fit=crop',
  'arrowroot': 'https://images.unsplash.com/photo-1518977676405-d052b9ea9b35?w=400&fit=crop',
  'cherry tomato': 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&fit=crop',
  'pak choi': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
  'okra': 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&fit=crop',
  'asparagus': 'https://images.unsplash.com/photo-1515442261605-65987783cb6a?w=400&fit=crop',
  'chili': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&fit=crop',
  'parsley': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&fit=crop',
  'mint': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&fit=crop',
  'basil': 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&fit=crop',

  // Fruits
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&fit=crop',
  'apple': 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&fit=crop',
  'orange': 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&fit=crop',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&fit=crop',
  'watermelon': 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&fit=crop',
  'pineapple': 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400&fit=crop',
  'papaya': 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&fit=crop',
  'avocado': 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&fit=crop',
  'passion': 'https://images.unsplash.com/photo-1604140602882-0e4d4df4e1fc?w=400&fit=crop',
  'grape': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&fit=crop',
  'strawberr': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&fit=crop',
  'lemon': 'https://images.unsplash.com/photo-1582287014914-1dfd7e6e9d4f?w=400&fit=crop',
  'lime': 'https://images.unsplash.com/photo-1582287014914-1dfd7e6e9d4f?w=400&fit=crop',
  'guava': 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&fit=crop',
  'coconut': 'https://images.unsplash.com/photo-1580984969071-a8da8d144a8b?w=400&fit=crop',
  'plum': 'https://images.unsplash.com/photo-1584868687543-cd0f7e0a2d81?w=400&fit=crop',
  'pear': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&fit=crop',
  'kiwi': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&fit=crop',
  'blueberr': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&fit=crop',
  'raspberr': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&fit=crop',
  'melon': 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&fit=crop',
  'date': 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&fit=crop',

  // Meat
  'beef steak': 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&fit=crop',
  'steak': 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&fit=crop',
  'beef stew': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&fit=crop',
  'minced beef': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&fit=crop',
  'mince': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&fit=crop',
  'beef bones': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  'goat': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  'mutton': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  'lamb': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  'pork': 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&fit=crop',
  'sausage': 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&fit=crop',
  'smokie': 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&fit=crop',
  'bacon': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&fit=crop',
  'liver': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  'tripe': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  'ribs': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&fit=crop',
  'corned beef': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&fit=crop',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&fit=crop',
  'oxtail': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&fit=crop',
  'brisket': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&fit=crop',

  // Poultry
  'whole chicken': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&fit=crop',
  'chicken breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=400&fit=crop',
  'chicken thigh': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  'chicken wing': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&fit=crop',
  'drumstick': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  'gizzard': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  'egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&fit=crop',
  'turkey': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&fit=crop',
  'duck': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&fit=crop',
  'chicken liver': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  'chicken sausage': 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&fit=crop',
  'nugget': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&fit=crop',
  'chicken strip': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&fit=crop',
  'quail': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&fit=crop',

  // Fish
  'tilapia': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'nile perch': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&fit=crop',
  'tuna': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'sardine': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&fit=crop',
  'prawn': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&fit=crop',
  'shrimp': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&fit=crop',
  'octopus': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'squid': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&fit=crop',
  'mackerel': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'omena': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&fit=crop',
  'crab': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&fit=crop',
  'lobster': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&fit=crop',
  'cod': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&fit=crop',
  'trout': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&fit=crop',
  'smoked fish': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'fish finger': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&fit=crop',

  // Dairy
  'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  'mala': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&fit=crop',
  'cheddar': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&fit=crop',
  'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&fit=crop',
  'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&fit=crop',
  'margarine': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&fit=crop',
  'cream': 'https://images.unsplash.com/photo-1587301669750-8f5e07440a26?w=400&fit=crop',
  'ghee': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&fit=crop',
  'ice cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&fit=crop',
  'milk powder': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  'condensed milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',

  // Beverages
  'coca cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&fit=crop',
  'fanta': 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&fit=crop',
  'sprite': 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&fit=crop',
  'pepsi': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&fit=crop',
  'water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&fit=crop',
  'juice': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&fit=crop',
  'coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&fit=crop',
  'tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&fit=crop',
  'energy drink': 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&fit=crop',
  'milo': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&fit=crop',
  'ovaltine': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&fit=crop',
  'coconut water': 'https://images.unsplash.com/photo-1580984969071-a8da8d144a8b?w=400&fit=crop',
  'hot chocolate': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&fit=crop',

  // Snacks
  'crisps': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop',
  'chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop',
  'biscuit': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&fit=crop',
  'cookie': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&fit=crop',
  'peanut': 'https://images.unsplash.com/photo-1567892737950-30a373dcfae4?w=400&fit=crop',
  'cashew': 'https://images.unsplash.com/photo-1567892737950-30a373dcfae4?w=400&fit=crop',
  'nut': 'https://images.unsplash.com/photo-1567892737950-30a373dcfae4?w=400&fit=crop',
  'popcorn': 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&fit=crop',
  'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&fit=crop',
  'sweet': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&fit=crop',
  'candy': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&fit=crop',
  'cracker': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&fit=crop',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&fit=crop',
  'granola': 'https://images.unsplash.com/photo-1517093602195-b40af9929084?w=400&fit=crop',
  'muffin': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&fit=crop',
  'brownie': 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&fit=crop',
  'donut': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&fit=crop',
  'cupcake': 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&fit=crop',
  'protein bar': 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=400&fit=crop',
  'dried mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&fit=crop',
  'banana chips': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&fit=crop',

  // Bakery
  'white bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop',
  'brown bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop',
  'chapati': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&fit=crop',
  'mandazi': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&fit=crop',
  'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&fit=crop',
  'bun': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop',
  'pita': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&fit=crop',
  'bagel': 'https://images.unsplash.com/photo-1567245155690-e67c37a2ddf9?w=400&fit=crop',
  'naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&fit=crop',
  'sourdough': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop',
  'cinnamon roll': 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&fit=crop',
  'garlic bread': 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&fit=crop',
  'pizza base': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&fit=crop',

  // Grains & Flour
  'maize flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  'wheat flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  'flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  'rice': 'https://images.unsplash.com/photo-1536304993881-ff86e6c83a57?w=400&fit=crop',
  'spaghetti': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&fit=crop',
  'pasta': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&fit=crop',
  'macaroni': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&fit=crop',
  'penne': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&fit=crop',
  'noodle': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&fit=crop',
  'oat': 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=400&fit=crop',
  'quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&fit=crop',
  'couscous': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&fit=crop',
  'barley': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',

  // Spices
  'salt': 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&fit=crop',
  'black pepper': 'https://images.unsplash.com/photo-1600348712270-e2a6e1827eed?w=400&fit=crop',
  'curry': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'turmeric': 'https://images.unsplash.com/photo-1615485500704-8e3b5a8b8c5b?w=400&fit=crop',
  'cumin': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'cinnamon': 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=400&fit=crop',
  'paprika': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'cardamom': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'clove': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'nutmeg': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'bay leaf': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'garam masala': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'saffron': 'https://images.unsplash.com/photo-1615485500704-8e3b5a8b8c5b?w=400&fit=crop',
  'vanilla': 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=400&fit=crop',

  // Oils
  'vegetable oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'olive oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'sunflower oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'coconut oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',

  // Household
  'toilet paper': 'https://images.unsplash.com/photo-1584556326561-c5b8043e5ac8?w=400&fit=crop',
  'soap': 'https://images.unsplash.com/photo-1584556326561-c5b8043e5ac8?w=400&fit=crop',
  'detergent': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'dish soap': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'bleach': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'air freshener': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'match': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop',
  'candle': 'https://images.unsplash.com/photo-1608181831718-c9fcd8ca2771?w=400&fit=crop',
  'garbage bag': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'sponge': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'broom': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'mop': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'disinfectant': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'hand soap': 'https://images.unsplash.com/photo-1584556326561-c5b8043e5ac8?w=400&fit=crop',
  'fabric softener': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'rubber glove': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
};

// Category fallback images
const CATEGORY_DEFAULTS = {
  vegetables: 'https://images.unsplash.com/photo-1543168256-418811576931?w=400&fit=crop',
  fruits: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&fit=crop',
  meat: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  poultry: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&fit=crop',
  fish: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&fit=crop',
  snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop',
  flour: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  grains: 'https://images.unsplash.com/photo-1536304993881-ff86e6c83a57?w=400&fit=crop',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  cooking_oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  household: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
};

const getProductImage = (product) => {
  if (product.image_url && product.image_url.startsWith('http')) return product.image_url;
  const nameLower = product.name.toLowerCase();
  for (const [keyword, url] of Object.entries(PRODUCT_IMAGES)) {
    if (nameLower.includes(keyword)) return url;
  }
  return CATEGORY_DEFAULTS[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop';
};

const CATEGORIES = [
  { id: 'all', label: '🏪 All' },
  { id: 'vegetables', label: '🥦 Vegetables' },
  { id: 'fruits', label: '🍎 Fruits' },
  { id: 'meat', label: '🥩 Meat' },
  { id: 'poultry', label: '🍗 Poultry' },
  { id: 'fish', label: '🐟 Fish' },
  { id: 'dairy', label: '🥛 Dairy' },
  { id: 'beverages', label: '🥤 Drinks' },
  { id: 'snacks', label: '🍿 Snacks' },
  { id: 'bakery', label: '🍞 Bakery' },
  { id: 'flour', label: '🌾 Flour' },
  { id: 'grains', label: '🌾 Grains' },
  { id: 'spices', label: '🌶️ Spices' },
  { id: 'cooking_oil', label: '🫙 Oils' },
  { id: 'household', label: '🧹 Household' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const url = category !== 'all'
        ? `${API}/api/products?category=${category}`
        : `${API}/api/products`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (isAuthenticated) fetchCartCount();
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setCartCount(data.count || 0);
    } catch { /* ignore */ }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const addToCart = async (product) => {
    // ✅ FIXED: was navigate('/working'), now navigate('/login')
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      setAddingId(product.id);
      const res = await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (res.ok) {
        setCartCount(prev => prev + 1);
        showToast(`✅ ${product.name} added!`);
      } else {
        const err = await res.json();
        showToast(`❌ ${err.error || 'Failed to add'}`);
      }
    } catch {
      showToast('❌ Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="shop-container">

      {toast && <div className="toast">{toast}</div>}

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🛍️</span>
            <div className="logo-text">
              <h1>NOORY <span>SHOP</span></h1>
              <p>FRESH GROCERIES 🇰🇪</p>
            </div>
          </div>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">Hi, {user?.name?.split(' ')[0]} 👋</span>
                {user?.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="btn btn-admin">⚙️ Admin</button>
                )}
                {user?.role === 'driver' && (
                  <button onClick={() => navigate('/driver-dashboard')} className="btn btn-driver">🏍️ Driver</button>
                )}
                <button onClick={() => navigate('/cart')} className="btn btn-cart">
                  🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
                <button onClick={logout} className="btn btn-outline">Out</button>
              </>
            ) : (
              <>
                {/* ✅ FIXED: was navigate('/working') */}
                <button onClick={() => navigate('/login')} className="btn btn-outline">Login</button>
                <button onClick={() => navigate('/register')} className="btn btn-primary">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Fresh Groceries Delivered 🛵</h2>
          <p>500+ products • Fast delivery • M-Pesa</p>
          <div className="hero-badges">
            <span className="badge badge-red">📦 Same Day</span>
            <span className="badge badge-green">💚 M-Pesa</span>
            <span className="badge badge-white" onClick={() => navigate('/contact')}>💬 Contact</span>
            <span className="badge badge-blue" onClick={() => navigate('/driver-apply')}>🏍️ Be a Driver</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="categories">
        <div className="categories-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`category-btn ${category === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <main className="main-content">
        <div className="products-header">
          <h3>
            {CATEGORIES.find(c => c.id === category)?.label || '🏪 All'}
            <span className="count">({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-icon">⏳</div>
            <p>Loading fresh products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <p>No products found</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    onError={e => {
                      e.target.src = CATEGORY_DEFAULTS[product.category]
                        || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop';
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="stock-overlay">
                      <span className="stock-badge out">OUT OF STOCK</span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="stock-badge low">Only {product.stock} left!</div>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-price-row">
                    <span className="product-price">KES {product.price}</span>
                    <span className="product-stock">
                      {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                    </span>
                  </div>
                  <button
                    disabled={product.stock === 0 || addingId === product.id}
                    onClick={() => addToCart(product)}
                    className={`add-to-cart ${product.stock === 0 ? 'disabled' : ''} ${addingId === product.id ? 'loading' : ''}`}
                  >
                    {addingId === product.id
                      ? '⏳ Adding...'
                      : product.stock === 0
                        ? '❌ Out of Stock'
                        : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🛍️ NOORY SHOP</h3>
            <p>Kenya&apos;s freshest groceries delivered to your door.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <p onClick={() => navigate('/cart')}>🛒 Cart</p>
            <p onClick={() => navigate('/contact')}>💬 Contact</p>
            <p onClick={() => navigate('/driver-apply')}>🏍️ Be a Driver</p>
            <p onClick={() => navigate('/register')}>📝 Register</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 0756967304</p>
            <p>✉️ shopnoory@gmail.com</p>
            <p>📍 Nairobi, Kenya</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Noory Shop • Made with ❤️ in Kenya 🇰🇪
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .shop-container { min-height: 100vh; background: #f8f9fa; font-family: 'Segoe UI', -apple-system, sans-serif; }

        .toast { position: fixed; top: 20px; right: 20px; z-index: 9999; background: #1a1a2e; color: #fff; padding: 14px 20px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(400px); } to { transform: translateX(0); } }

        .header { background: #1a1a2e; padding: 12px 16px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 20px rgba(0,0,0,0.3); }
        .header-content { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; }
        .logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .logo-icon { font-size: 24px; }
        .logo-text h1 { font-size: 18px; font-weight: 900; color: #fff; line-height: 1; }
        .logo-text h1 span { color: #e94560; }
        .logo-text p { font-size: 8px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; }
        .search-wrapper { width: 100%; }
        .search-input { width: 100%; padding: 10px 16px; border-radius: 50px; border: 2px solid #0f3460; background: #16213e; color: #fff; font-size: 14px; outline: none; font-family: inherit; }
        .header-actions { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
        .user-greeting { color: #94a3b8; font-size: 12px; font-weight: 600; white-space: nowrap; display: none; }
        .btn { border: none; padding: 8px 12px; border-radius: 50px; cursor: pointer; font-weight: 700; font-size: 11px; font-family: inherit; white-space: nowrap; transition: all 0.2s; }
        .btn-admin { background: #e94560; color: #fff; }
        .btn-driver { background: #22c55e; color: #fff; }
        .btn-cart { background: #0f3460; color: #fff; position: relative; }
        .btn-outline { background: transparent; color: #64748b; border: 1px solid #0f3460; }
        .btn-primary { background: #e94560; color: #fff; }
        .cart-badge { background: #e94560; border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; margin-left: 4px; }

        .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 28px 16px; text-align: center; position: relative; overflow: hidden; }
        .hero-overlay { position: absolute; inset: 0; background: url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&fit=crop") center/cover; opacity: 0.08; }
        .hero-content { position: relative; z-index: 1; }
        .hero-content h2 { font-size: 24px; font-weight: 900; color: #fff; margin: 0 0 6px; letter-spacing: -0.5px; }
        .hero-content p { color: #94a3b8; font-size: 13px; margin: 0 0 14px; }
        .hero-badges { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
        .badge { padding: 6px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .badge-red { background: rgba(233,69,96,0.15); border: 1px solid rgba(233,69,96,0.4); color: #e94560; }
        .badge-green { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #22c55e; }
        .badge-white { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; }
        .badge-blue { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.4); color: #60a5fa; }

        .categories { background: #fff; border-bottom: 2px solid #f0f0f0; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .categories::-webkit-scrollbar { display: none; }
        .categories-scroll { display: flex; gap: 6px; padding: 10px 16px; min-width: max-content; }
        .category-btn { padding: 8px 14px; border-radius: 50px; border: none; cursor: pointer; background: #f8f9fa; color: #555; font-weight: 700; font-size: 12px; font-family: inherit; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
        .category-btn.active { background: #e94560; color: #fff; }

        .main-content { max-width: 1400px; margin: 0 auto; padding: 20px 16px; }
        .products-header { margin-bottom: 16px; }
        .products-header h3 { font-size: 16px; font-weight: 900; color: #1a1a2e; }
        .count { font-size: 12px; color: #888; font-weight: 600; margin-left: 6px; }
        .loading, .empty { text-align: center; padding: 60px 20px; color: #888; }
        .loading-icon, .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .loading p, .empty p { font-weight: 700; font-size: 16px; }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        .product-card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; transition: all 0.2s; }
        .product-card:active { transform: scale(0.98); }
        .product-image { height: 140px; overflow: hidden; background: #f8f9fa; position: relative; }
        .product-image img { width: 100%; height: 100%; object-fit: cover; }
        .stock-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
        .stock-badge { padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 10px; }
        .stock-badge.out { background: #e94560; color: #fff; }
        .stock-badge.low { position: absolute; top: 6px; right: 6px; background: #f59e0b; color: #fff; }
        .product-info { padding: 10px; }
        .product-category { font-size: 9px; color: #e94560; font-weight: 700; text-transform: uppercase; margin: 0 0 4px; letter-spacing: 0.5px; }
        .product-name { font-size: 13px; font-weight: 700; color: #1a1a2e; margin: 0 0 8px; line-height: 1.3; min-height: 34px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .product-price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .product-price { font-size: 16px; font-weight: 900; color: #e94560; }
        .product-stock { font-size: 10px; color: #aaa; font-weight: 600; }
        .add-to-cart { width: 100%; padding: 10px; border: none; border-radius: 10px; font-weight: 800; font-size: 12px; cursor: pointer; font-family: inherit; transition: all 0.2s; background: #e94560; color: #fff; }
        .add-to-cart.disabled { background: #f0f0f0; color: #aaa; cursor: not-allowed; }
        .add-to-cart.loading { background: #ccc; cursor: not-allowed; }
        .add-to-cart:active:not(.disabled):not(.loading) { transform: scale(0.95); }

        .footer { background: #1a1a2e; padding: 32px 16px; margin-top: 40px; }
        .footer-content { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 24px; }
        .footer-section h3 { color: #fff; font-weight: 900; font-size: 16px; margin: 0 0 8px; }
        .footer-section h4 { color: #fff; font-weight: 800; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .footer-section p { color: #64748b; font-size: 12px; margin: 0 0 6px; cursor: pointer; font-weight: 600; }
        .footer-section p:hover { color: #e94560; }
        .footer-bottom { border-top: 1px solid #0f3460; padding-top: 16px; text-align: center; color: #64748b; font-size: 11px; font-weight: 600; }

        @media (min-width: 768px) {
          .user-greeting { display: block; }
          .logo-text h1 { font-size: 20px; }
          .logo-text p { font-size: 9px; }
          .search-input { max-width: 500px; }
          .btn { padding: 8px 14px; font-size: 12px; }
          .hero-content h2 { font-size: 32px; }
          .hero-content p { font-size: 15px; }
          .badge { font-size: 12px; padding: 6px 14px; }
          .category-btn { font-size: 13px; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
          .product-image { height: 160px; }
          .product-name { font-size: 14px; }
          .add-to-cart { font-size: 13px; }
          .footer-content { grid-template-columns: repeat(3, 1fr); }
          .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
        }
        @media (min-width: 480px) and (max-width: 767px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-content { grid-template-columns: repeat(2, 1fr); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #e94560; border-radius: 3px; }
      `}</style>
    </div>
  );
}