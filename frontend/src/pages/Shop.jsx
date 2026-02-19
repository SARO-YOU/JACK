import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://noory-backend.onrender.com';

const PRODUCT_IMAGES = {
  'sukuma': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&fit=crop',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop',
  'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&fit=crop',
  'tomato': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&fit=crop',
  'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&fit=crop',
  'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&fit=crop',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&fit=crop',
  'green pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&fit=crop',
  'red pepper': 'https://images.unsplash.com/photo-1583683641328-01efcd74a8af?w=400&fit=crop',
  'yellow pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&fit=crop',
  'bell pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&fit=crop',
  'chili': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&fit=crop',
  'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&fit=crop',
  'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&fit=crop',
  'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&fit=crop',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711271-6c0f9644b066?w=400&fit=crop',
  'dhania': 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&fit=crop',
  'coriander': 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&fit=crop',
  'spring onion': 'https://images.unsplash.com/photo-1553882809-a4f57e59501d?w=400&fit=crop',
  'garlic': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&fit=crop',
  'ginger': 'https://images.unsplash.com/photo-1615485500634-15e4d7e0eab5?w=400&fit=crop',
  'beetroot': 'https://images.unsplash.com/photo-1570629468485-1a4ce5c67e1a?w=400&fit=crop',
  'sweet potato': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&fit=crop',
  'pumpkin': 'https://images.unsplash.com/photo-1570040935333-5f5f2f0c4d96?w=400&fit=crop',
  'butternut': 'https://images.unsplash.com/photo-1570040935333-5f5f2f0c4d96?w=400&fit=crop',
  'eggplant': 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&fit=crop',
  'zucchini': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&fit=crop',
  'mushroom': 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400&fit=crop',
  'baby corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&fit=crop',
  'green bean': 'https://images.unsplash.com/photo-1589927986089-35812378d59b?w=400&fit=crop',
  'garden pea': 'https://images.unsplash.com/photo-1563746924237-f81d6a3e79e2?w=400&fit=crop',
  'kale': 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=400&fit=crop',
  'okra': 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&fit=crop',
  'asparagus': 'https://images.unsplash.com/photo-1515471209610-dae1a37f0f60?w=400&fit=crop',
  'arrowroot': 'https://images.unsplash.com/photo-1574771197088-ec33e0ad9e54?w=400&fit=crop',
  'celery': 'https://images.unsplash.com/photo-1588888592974-7462b4bc7c95?w=400&fit=crop',
  'leek': 'https://images.unsplash.com/photo-1601000938259-f78ee4a29e83?w=400&fit=crop',
  'radish': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&fit=crop',
  'parsley': 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&fit=crop',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&fit=crop',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&fit=crop',
  'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&fit=crop',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&fit=crop',
  'watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e7851b2?w=400&fit=crop',
  'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&fit=crop',
  'papaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&fit=crop',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&fit=crop',
  'passion': 'https://images.unsplash.com/photo-1604599340287-2042e85a3802?w=400&fit=crop',
  'grape': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&fit=crop',
  'strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&fit=crop',
  'lemon': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&fit=crop',
  'lime': 'https://images.unsplash.com/photo-1590502161521-f4b24c05db78?w=400&fit=crop',
  'guava': 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&fit=crop',
  'coconut': 'https://images.unsplash.com/photo-1589620352903-9c4ea5d3c923?w=400&fit=crop',
  'pear': 'https://images.unsplash.com/photo-1568173217304-f543f258e5b6?w=400&fit=crop',
  'plum': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&fit=crop',
  'peach': 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=400&fit=crop',
  'kiwi': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&fit=crop',
  'tangerine': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&fit=crop',
  'grapefruit': 'https://images.unsplash.com/photo-1568648461681-9ea0b3bc7d7f?w=400&fit=crop',
  'melon': 'https://images.unsplash.com/photo-1563114773-84221bd2d3a1?w=400&fit=crop',
  'dragon fruit': 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&fit=crop',
  'pomegranate': 'https://images.unsplash.com/photo-1586347455350-0394c5cce01f?w=400&fit=crop',
  'steak': 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&fit=crop',
  'beef stew': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&fit=crop',
  'minced beef': 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400&fit=crop',
  'beef mince': 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400&fit=crop',
  'goat': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&fit=crop',
  'mutton': 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&fit=crop',
  'pork': 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&fit=crop',
  'sausage': 'https://images.unsplash.com/photo-1612927178023-a38de0b84363?w=400&fit=crop',
  'smokie': 'https://images.unsplash.com/photo-1612927178023-a38de0b84363?w=400&fit=crop',
  'bacon': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&fit=crop',
  'liver': 'https://images.unsplash.com/photo-1607623814992-e9a6c049d97e?w=400&fit=crop',
  'tripe': 'https://images.unsplash.com/photo-1607623814992-e9a6c049d97e?w=400&fit=crop',
  'ribs': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&fit=crop',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&fit=crop',
  'lamb': 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&fit=crop',
  'ham': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&fit=crop',
  'salami': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&fit=crop',
  'chorizo': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&fit=crop',
  'whole chicken': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  'chicken breast': 'https://images.unsplash.com/photo-1604503468958-c648ef97e7a5?w=400&fit=crop',
  'chicken thigh': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&fit=crop',
  'chicken wing': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&fit=crop',
  'drumstick': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&fit=crop',
  'gizzard': 'https://images.unsplash.com/photo-1607623814992-e9a6c049d97e?w=400&fit=crop',
  'egg': 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&fit=crop',
  'turkey': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&fit=crop',
  'duck': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&fit=crop',
  'quail': 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&fit=crop',
  'tilapia': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'nile perch': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&fit=crop',
  'tuna': 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&fit=crop',
  'sardine': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'prawn': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&fit=crop',
  'omena': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'crab': 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400&fit=crop',
  'lobster': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=400&fit=crop',
  'squid': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&fit=crop',
  'mackerel': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'catfish': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop',
  'cod': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'fish finger': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'smoked fish': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  'fresh milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  'mala': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&fit=crop',
  'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&fit=crop',
  'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&fit=crop',
  'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&fit=crop',
  'margarine': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&fit=crop',
  'cream': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&fit=crop',
  'ghee': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&fit=crop',
  'ice cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&fit=crop',
  'milk powder': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  'water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&fit=crop',
  'coca cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&fit=crop',
  'fanta': 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&fit=crop',
  'sprite': 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&fit=crop',
  'pepsi': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&fit=crop',
  'juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&fit=crop',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&fit=crop',
  'tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&fit=crop',
  'energy drink': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop',
  'coconut water': 'https://images.unsplash.com/photo-1550613020-f6e7e78d5b78?w=400&fit=crop',
  'milo': 'https://images.unsplash.com/photo-1517805686688-47dd930554b2?w=400&fit=crop',
  'ovaltine': 'https://images.unsplash.com/photo-1517805686688-47dd930554b2?w=400&fit=crop',
  'crisps': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop',
  'chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop',
  'biscuit': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&fit=crop',
  'cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&fit=crop',
  'chocolate': 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&fit=crop',
  'peanut': 'https://images.unsplash.com/photo-1567892737950-30a7f09ae14a?w=400&fit=crop',
  'cashew': 'https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=400&fit=crop',
  'popcorn': 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&fit=crop',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&fit=crop',
  'mandazi': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&fit=crop',
  'donut': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&fit=crop',
  'muffin': 'https://images.unsplash.com/photo-1558303958-35b41b38a0da?w=400&fit=crop',
  'cracker': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&fit=crop',
  'granola': 'https://images.unsplash.com/photo-1614961234760-9d8f4dbd27a6?w=400&fit=crop',
  'white bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&fit=crop',
  'brown bread': 'https://images.unsplash.com/photo-1586444248902-2f64eddc8df5?w=400&fit=crop',
  'bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&fit=crop',
  'chapati': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&fit=crop',
  'bun': 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&fit=crop',
  'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&fit=crop',
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&fit=crop',
  'naan': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&fit=crop',
  'maize flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  'wheat flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  'flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  'rice': 'https://images.unsplash.com/photo-1536304993881-ff86e0c9c4f4?w=400&fit=crop',
  'spaghetti': 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&fit=crop',
  'pasta': 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&fit=crop',
  'macaroni': 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&fit=crop',
  'noodle': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&fit=crop',
  'oat': 'https://images.unsplash.com/photo-1614961234760-9d8f4dbd27a6?w=400&fit=crop',
  'quinoa': 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&fit=crop',
  'salt': 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&fit=crop',
  'black pepper': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'curry': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&fit=crop',
  'turmeric': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&fit=crop',
  'cumin': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'cinnamon': 'https://images.unsplash.com/photo-1588776814546-1ffbb5f8ef57?w=400&fit=crop',
  'paprika': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'chili powder': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&fit=crop',
  'cardamom': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'clove': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'nutmeg': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'vanilla': 'https://images.unsplash.com/photo-1588776814546-1ffbb5f8ef57?w=400&fit=crop',
  'garam masala': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop',
  'olive oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'vegetable oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'sunflower oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'coconut oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'palm oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&fit=crop',
  'toilet paper': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&fit=crop',
  'tissue': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&fit=crop',
  'soap bar': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&fit=crop',
  'hand soap': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&fit=crop',
  'detergent': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'dish soap': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'bleach': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'disinfectant': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop',
  'laundry': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'fabric softener': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
  'garbage bag': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&fit=crop',
};

const CATEGORY_DEFAULTS = {
  vegetables: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&fit=crop',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&fit=crop',
  meat: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&fit=crop',
  poultry: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&fit=crop',
  fish: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&fit=crop',
  dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop',
  beverages: 'https://images.unsplash.com/photo-1534353473418-4cfa0c2e3e5e?w=400&fit=crop',
  snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop',
  bakery: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&fit=crop',
  flour: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop',
  grains: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9c4f4?w=400&fit=crop',
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

  // useCallback fixes the missing dependency warning
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const url = category !== 'all'
        ? `${API}/api/products?category=${category}`
        : `${API}/api/products`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    } catch (e) { /* ignore */ }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const addToCart = async (product) => {
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
        showToast(`✅ ${product.name} added to cart!`);
      }
    } catch (e) {
      showToast('❌ Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: '#1a1a2e', color: '#fff', padding: '14px 20px',
          borderRadius: '12px', fontWeight: '700', fontSize: '15px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: '#1a1a2e', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontSize: '26px' }}>🛍️</span>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0 }}>
                NOORY <span style={{ color: '#e94560' }}>SHOP</span>
              </h1>
              <p style={{ fontSize: '9px', color: '#64748b', margin: 0, fontWeight: '600', letterSpacing: '1px' }}>FRESH GROCERIES 🇰🇪</p>
            </div>
          </div>

          <div style={{ flex: 1, maxWidth: '400px' }}>
            <input type="text" placeholder="🔍 Search products..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 16px', borderRadius: '50px', border: '2px solid #0f3460', background: '#16213e', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>Hi, {user?.name?.split(' ')[0]} 👋</span>
                {user?.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', fontFamily: 'inherit' }}>⚙️ Admin</button>
                )}
                {user?.role === 'driver' && (
                  <button onClick={() => navigate('/driver-dashboard')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', fontFamily: 'inherit' }}>🏍️ Driver</button>
                )}
                <button onClick={() => navigate('/cart')} style={{ background: '#0f3460', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', fontFamily: 'inherit', position: 'relative' }}>
                  🛒 {cartCount > 0 && <span style={{ background: '#e94560', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', marginLeft: '4px' }}>{cartCount}</span>}
                </button>
                <button onClick={logout} style={{ background: 'transparent', color: '#64748b', border: '1px solid #0f3460', padding: '7px 12px', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', fontFamily: 'inherit' }}>Out</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #0f3460', padding: '7px 14px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', fontFamily: 'inherit' }}>Login</button>
                <button onClick={() => navigate('/register')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', fontFamily: 'inherit' }}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '36px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&fit=crop") center/cover', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '0 0 8px', letterSpacing: '-1px' }}>Fresh Groceries Delivered 🛵</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 18px' }}>500+ products • Fast delivery • M-Pesa accepted</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: '📦 Same Day Delivery', color: '#e94560' },
              { label: '💚 M-Pesa Ready', color: '#22c55e' },
            ].map((b, i) => (
              <span key={i} style={{ background: `rgba(${b.color === '#e94560' ? '233,69,96' : '34,197,94'},0.15)`, border: `1px solid ${b.color}40`, color: b.color, padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '700' }}>{b.label}</span>
            ))}
            <span onClick={() => navigate('/contact')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>💬 Contact Us</span>
            <span onClick={() => navigate('/driver-apply')} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid #3b82f640', color: '#60a5fa', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>🏍️ Become a Driver</span>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div style={{ background: '#fff', borderBottom: '2px solid #f0f0f0', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '4px', padding: '10px 20px', minWidth: 'max-content' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              style={{ padding: '7px 14px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: category === cat.id ? '#e94560' : '#f8f9fa', color: category === cat.id ? '#fff' : '#555', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>
            {CATEGORIES.find(c => c.id === category)?.label || '🏪 All Products'}
            <span style={{ fontSize: '13px', color: '#888', fontWeight: '600', marginLeft: '8px' }}>({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
            <p style={{ fontWeight: '700' }}>Loading fresh products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontWeight: '700', fontSize: '18px' }}>No products found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {filtered.map(product => (
              <div key={product.id}
                style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ height: '160px', overflow: 'hidden', background: '#f8f9fa', position: 'relative' }}>
                  <img src={getProductImage(product)} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = CATEGORY_DEFAULTS[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop'; }} />
                  {product.stock === 0 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ background: '#e94560', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '12px' }}>OUT OF STOCK</span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#f59e0b', color: '#fff', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>Only {product.stock} left!</div>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ fontSize: '10px', color: '#e94560', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.5px' }}>{product.category}</p>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px', lineHeight: '1.3', minHeight: '36px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#e94560' }}>KES {product.price}</span>
                    <span style={{ fontSize: '11px', color: '#aaa', fontWeight: '600' }}>{product.stock > 0 ? `${product.stock} left` : 'Sold out'}</span>
                  </div>
                  <button
                    disabled={product.stock === 0 || addingId === product.id}
                    onClick={() => addToCart(product)}
                    style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', background: product.stock === 0 ? '#f0f0f0' : addingId === product.id ? '#ccc' : '#e94560', color: product.stock === 0 ? '#aaa' : '#fff' }}>
                    {addingId === product.id ? '⏳ Adding...' : product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1a1a2e', padding: '36px 24px', marginTop: '40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '28px', marginBottom: '28px' }}>
            <div>
              <h3 style={{ color: '#fff', fontWeight: '900', fontSize: '18px', margin: '0 0 10px' }}>🛍️ NOORY SHOP</h3>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>Kenya's freshest groceries delivered to your door.</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: '800', margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
              {[
                { label: '🛒 Cart', action: () => navigate('/cart') },
                { label: '💬 Contact Us', action: () => navigate('/contact') },
                { label: '🏍️ Become a Driver', action: () => navigate('/driver-apply') },
                { label: '📝 Register', action: () => navigate('/register') },
              ].map((l, i) => (
                <p key={i} onClick={l.action} style={{ color: '#64748b', fontSize: '13px', margin: '0 0 6px', cursor: 'pointer', fontWeight: '600' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e94560'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >{l.label}</p>
              ))}
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: '800', margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</h4>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 6px' }}>📞 0716 613 176</p>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 6px' }}>✉️ shopnoory@gmail.com</p>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>📍 Nairobi, Kenya</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #0f3460', paddingTop: '16px', textAlign: 'center', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>
            © 2025 Noory Shop • Made with ❤️ in Kenya 🇰🇪
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #e94560; border-radius: 3px; }
      `}</style>
    </div>
  );
}