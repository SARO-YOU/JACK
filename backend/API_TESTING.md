# API Testing Guide

## Base URL
```
Local: http://localhost:5000
Production: https://noory-backend.onrender.com
```

## 1. Health Check

```bash
curl https://noory-backend.onrender.com/health
```

## 2. Register Customer

```bash
curl -X POST https://noory-backend.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Mwangi",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+254712345678"
  }'
```

## 3. Login (Customer)

```bash
curl -X POST https://noory-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

## 4. Login (Admin)

```bash
curl -X POST https://noory-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "Jacob",
    "password": "ITSALOTOFWORKMAN"
  }'
```

## 5. Get Products

```bash
curl https://noory-backend.onrender.com/api/products
```

## 6. Get Products by Category

```bash
curl https://noory-backend.onrender.com/api/products?category=vegetables
```

## 7. Add to Cart (Requires Token)

```bash
curl -X POST https://noory-backend.onrender.com/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

## 8. Get Cart (Requires Token)

```bash
curl https://noory-backend.onrender.com/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 9. Create Order (Requires Token)

```bash
curl -X POST https://noory-backend.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "delivery_location": "Kikuyu, Nairobi",
    "payment_method": "mpesa",
    "transaction_id": "MPESA123456",
    "delivery_fee": 200
  }'
```

## 10. Submit Driver Application

```bash
curl -X POST https://noory-backend.onrender.com/api/driver/applications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Peter Kamau",
    "email": "peter@example.com",
    "phone": "+254723456789",
    "id_number": "12345678",
    "vehicle_type": "motorbike",
    "vehicle_registration": "KAA 123B",
    "about": "Experienced rider with 5 years in delivery"
  }'
```

## 11. Admin - Get Dashboard Stats (Requires Admin Token)

```bash
curl https://noory-backend.onrender.com/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 12. Admin - Get Driver Applications (Requires Admin Token)

```bash
curl https://noory-backend.onrender.com/api/admin/driver-applications \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 13. Admin - Approve Driver (Requires Admin Token)

```bash
curl -X POST https://noory-backend.onrender.com/api/admin/driver-applications/1/approve \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 14. Admin - Create Product (Requires Admin Token)

```bash
curl -X POST https://noory-backend.onrender.com/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Fresh Mangoes",
    "category": "fruits",
    "price": 150,
    "stock": 50,
    "description": "Sweet tropical mangoes",
    "image_url": "https://example.com/mango.jpg"
  }'
```

## 15. Admin - Update Product (Requires Admin Token)

```bash
curl -X PUT https://noory-backend.onrender.com/api/admin/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Fresh Sukuma Wiki",
    "price": 35
  }'
```

## 16. Admin - Delete Product (Requires Admin Token)

```bash
curl -X DELETE https://noory-backend.onrender.com/api/admin/products/1 \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 17. Submit Customer Feedback (No Token Required)

```bash
curl -X POST https://noory-backend.onrender.com/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anonymous Customer",
    "email": "customer@example.com",
    "subject": "Delivery Issue",
    "message": "My order was late by 2 hours"
  }'
```

## 18. Driver - Login

```bash
curl -X POST https://noory-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "Driver-1",
    "password": "SECRET_KEY_HERE"
  }'
```

## 19. Driver - Get Available Orders (Requires Driver Token)

```bash
curl https://noory-backend.onrender.com/api/driver/available-orders \
  -H "Authorization: Bearer DRIVER_TOKEN_HERE"
```

## 20. Driver - Accept Order (Requires Driver Token)

```bash
curl -X POST https://noory-backend.onrender.com/api/driver/orders/1/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DRIVER_TOKEN_HERE" \
  -d '{
    "driver_id": 1
  }'
```

## Testing Workflow

### 1. Setup (First Time)
1. Register as customer
2. Login and save token
3. Browse products
4. Add items to cart

### 2. Order Flow
1. Create order from cart
2. Order appears in admin dashboard
3. Order appears in driver available orders
4. Driver accepts order
5. Driver marks as delivered
6. Customer confirms delivery

### 3. Admin Workflow
1. Login as admin
2. View dashboard stats
3. Manage products
4. Approve driver applications
5. View feedback

## Environment-Specific Testing

### Local Testing
```bash
export API_URL=http://localhost:5000
```

### Production Testing
```bash
export API_URL=https://noory-backend.onrender.com
```

Then use `$API_URL` in your curl commands:
```bash
curl $API_URL/health
```

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Tips

1. **Save tokens**: Store JWT tokens in environment variables for easier testing
2. **Use Postman**: Import these examples into Postman for easier testing
3. **Check logs**: Monitor Render logs for debugging
4. **Test incrementally**: Test each endpoint before moving to the next
