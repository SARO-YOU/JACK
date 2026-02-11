#!/bin/bash

# Noory Shop - Quick Deployment Script

echo "🚀 Noory Shop Deployment Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found. Please run this script from the backend directory."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🗄️ Step 2: Initializing database..."
python -c "from app import app, db; app.app_context().push(); db.create_all()"

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi

echo "✅ Database initialized"
echo ""

echo "🌱 Step 3: Seeding products..."
python seed.py

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed products"
    exit 1
fi

echo "✅ Products seeded"
echo ""

echo "🎉 Deployment complete!"
echo ""
echo "Your API is ready at:"
echo "- Local: http://localhost:5000"
echo "- Production: https://noory-backend.onrender.com"
echo ""
echo "Next steps:"
echo "1. Test the API: curl http://localhost:5000/health"
echo "2. Test products: curl http://localhost:5000/api/products"
echo "3. Push to Git: git push origin main"
echo ""
echo "📚 Read DEPLOYMENT_GUIDE.md for detailed instructions"
