# 🛒 Noory Shop - E-Commerce Delivery Platform

A full-stack e-commerce delivery platform for Kenyan products with customer, driver, and admin roles.

## 🌟 Features

### Customer Features
- Browse products by category (vegetables, snacks, beverages, household items, flowers)
- Add to cart with persistent storage
- Checkout with multiple payment methods (M-Pesa, Airtel Money, Visa, MasterCard)
- Track orders in real-time
- Submit feedback and complaints
- Apply to become a driver

### Driver Features
- View available orders
- Accept orders (first-come-first-served)
- Track active and completed deliveries
- View earnings dashboard
- Submit feedback to admin

### Admin Features
- Dashboard with revenue analytics
- Manage products (add, edit, delete)
- Approve/reject driver applications
- Auto-assign driver identities (Driver-1, Driver-2, etc.)
- View all orders and track status
- Manage customer and driver feedback
- View profit reports

## 🛠 Tech Stack

### Backend
- **Framework**: Flask 3.0
- **Database**: PostgreSQL (Render)
- **Authentication**: JWT tokens
- **Email**: Gmail SMTP
- **Deployment**: Render

### Security
- Password hashing with Werkzeug
- JWT-based authentication
- Role-based access control
- Admin password protection

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- PostgreSQL database
- Git

### Environment Variables
Create a `.env` file in the backend directory with:

```env
DATABASE_URL=your_postgresql_url
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
JWT_SECRET_KEY=your_secret_key
ADMIN_PASSWORD=ITSALOTOFWORKMAN
SECRET_KEY=your_flask_secret
MAX_DELIVERY_FEE=220
```

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd noory-shop/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Initialize database**
```bash
flask db init
flask db migrate
flask db upgrade
```

5. **Seed products**
```bash
python seed.py
```

6. **Run the application**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 🚀 Deployment to Render

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
```bash
cd noory-shop/backend
git init
git add .
git commit -m "Initial commit - Noory Shop Backend"
```

2. **Push to GitHub**
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `noory-shop/backend` directory

3. **Configure Service**
   ```
   Name: noory-backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

4. **Add Environment Variables**
   Go to Environment tab and add all variables from your `.env` file:
   - `DATABASE_URL`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `JWT_SECRET_KEY`
   - `ADMIN_PASSWORD`
   - `SECRET_KEY`
   - `MAX_DELIVERY_FEE`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be live at: `https://noory-backend.onrender.com`

### Step 3: Run Database Migrations

After deployment, open the Render Shell and run:
```bash
python seed.py
```

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new customer
- `POST /api/login` - Login (customer/driver/admin)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=vegetables` - Filter by category
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)
- `DELETE /api/admin/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Driver
- `POST /api/driver/applications` - Submit application
- `GET /api/driver/available-orders` - Get available orders
- `POST /api/driver/orders/:id/accept` - Accept order
- `GET /api/driver/orders` - Get driver's orders
- `POST /api/driver/feedback` - Submit feedback

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `GET /api/admin/driver-applications` - Driver applications
- `POST /api/admin/driver-applications/:id/approve` - Approve driver
- `POST /api/admin/driver-applications/:id/reject` - Reject driver
- `GET /api/admin/drivers` - All drivers
- `DELETE /api/admin/drivers/:id` - Remove driver
- `GET /api/admin/customer-feedback` - Customer feedback
- `GET /api/admin/driver-feedback` - Driver feedback

### Feedback
- `POST /api/feedback` - Submit customer feedback (anonymous allowed)

## 🔑 Authentication Flow

### Admin Login
- Username: One of `['Jacob', 'John', 'Mary', 'Sarah']` (configured in config.py)
- Password: `ITSALOTOFWORKMAN`
- System checks name + password
- Redirects to admin dashboard

### Driver Login
- Driver Identity: `Driver-1`, `Driver-2`, etc. (auto-assigned on approval)
- Password: Secret key (sent via email on approval)
- Example: `Driver-1` with secret key `A3F8B2C1`

### Customer Login
- Email + Password
- Standard JWT authentication

## 💰 Payment Integration

Currently supports:
- M-Pesa
- Airtel Money
- Visa
- MasterCard

**Note**: Payment gateway integration (Flutterwave/Pesapal) needs to be added for live payments.

## 📧 Email Notifications

Automated emails sent for:
- ✅ Welcome email on registration
- ✅ Order confirmation
- ✅ Driver approval with credentials
- ✅ Password reset (if implemented)

## 🗃 Database Schema

### Tables
- `users` - All users (customers, drivers, admins)
- `drivers` - Driver profiles
- `products` - Product catalog
- `cart_items` - Shopping cart
- `orders` - Order records
- `order_items` - Order line items
- `customer_feedback` - Customer complaints/suggestions
- `driver_feedback` - Driver complaints/suggestions
- `driver_applications` - Driver application submissions

## 🔒 Security Best Practices

✅ Passwords hashed with Werkzeug
✅ JWT tokens for authentication
✅ Role-based access control
✅ Environment variables for secrets
✅ CORS configured
✅ SQL injection protection (SQLAlchemy)
✅ Input validation

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format
postgresql://username:password@host:port/database
```

### Email Not Sending
```bash
# Ensure Gmail App Password is used (not regular password)
# Enable "Less secure app access" or use App Password
```

### Deployment Issues on Render
```bash
# Check logs in Render Dashboard
# Ensure all environment variables are set
# Verify Python version in runtime.txt
```

## 📊 Future Enhancements

- [ ] Live payment gateway integration
- [ ] Real-time order tracking with maps
- [ ] Push notifications
- [ ] Customer reviews and ratings
- [ ] Loyalty points system
- [ ] Multi-language support (English/Swahili)
- [ ] Mobile app (React Native)

## 👥 Contributors

- Your Name - Initial work

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Email: shopnoorey@gmail.com
- Create an issue on GitHub

---

**Built with ❤️ in Kenya 🇰🇪**
