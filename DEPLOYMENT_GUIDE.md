# 🚀 DEPLOYMENT GUIDE - Noory Shop

## 📋 Your Current Setup

**Database (PostgreSQL - Render)**
- Host: dpg-d642uc4hg0os73cstnl0-a.oregon-postgres.render.com
- Database: noory_db
- User: noory_db_user
- Password: uUC7vrO30xfq6cM8fLwPADR1YDG4SLGh

**Backend Service (Render)**
- Service: noory-backend
- URL: https://noory-backend.onrender.com

**Frontend Domain**
- URL: shop.nooreyshop.abrdns.com

**Email**
- Email: shopnoorey@gmail.com
- App Password: gomeuvqljtvxaodg

## 🔧 Step-by-Step Deployment

### Step 1: Clear Old Files from Your Git Repository

```bash
# Go to your local repository
cd /path/to/your/noory-flask

# Remove all files
git rm -r *

# Commit deletion
git commit -m "Clear old files for fresh rebuild"

# Push to main
git push origin main
```

### Step 2: Copy New Files

```bash
# Copy all files from /home/claude/noory-shop/backend to your local repo
cp -r /home/claude/noory-shop/backend/* /path/to/your/noory-flask/

# Go to your repo
cd /path/to/your/noory-flask

# Add all new files
git add .

# Commit
git commit -m "Complete rebuild: Full-stack e-commerce platform"

# Push to main
git push origin main
```

### Step 3: Configure Render Environment Variables

Go to your Render service: https://dashboard.render.com/web/srv-d63j601r0fns73bn0570

**Add these environment variables:**

```
DATABASE_URL=postgresql://noory_db_user:uUC7vrO30xfq6cM8fLwPADR1YDG4SLGh@dpg-d642uc4hg0os73cstnl0-a.oregon-postgres.render.com/noory_db

EMAIL_USER=shopnoorey@gmail.com

EMAIL_PASSWORD=gomeuvqljtvxaodg

SMTP_SERVER=smtp.gmail.com

SMTP_PORT=587

JWT_SECRET_KEY=noory-shop-super-secret-key-2025-production

ADMIN_PASSWORD=ITSALOTOFWORKMAN

SECRET_KEY=noory-flask-secret-production-2025

MAX_DELIVERY_FEE=220

FLASK_ENV=production
```

### Step 4: Update Build & Start Commands

In your Render service settings:

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
gunicorn app:app
```

### Step 5: Deploy

1. Go to your Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete (2-3 minutes)

### Step 6: Initialize Database

Once deployed, open the Render Shell and run:

```bash
# Run migrations
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Seed products
python seed.py
```

## ✅ Testing Your Deployment

### Test API Health

```bash
curl https://noory-backend.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

### Test Products Endpoint

```bash
curl https://noory-backend.onrender.com/api/products
```

Should return list of Kenyan products.

### Test Admin Login

```bash
curl -X POST https://noory-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "Jacob", "password": "ITSALOTOFWORKMAN"}'
```

Should return JWT token.

## 🎯 Admin Names (Change These!)

Currently set to `['Jacob', 'John', 'Mary', 'Sarah']`

**To change:**
1. Edit `backend/config.py`
2. Update `ALLOWED_ADMIN_NAMES` list
3. Commit and push

## 🔐 Important Security Notes

⚠️ **NEVER commit your `.env` file to Git**

The `.env` file is already in `.gitignore`, but make sure it's not tracked:

```bash
git rm --cached .env
```

## 📱 Frontend Integration

Your frontend should make API calls to:
```
https://noory-backend.onrender.com/api/
```

Example fetch:
```javascript
const response = await fetch('https://noory-backend.onrender.com/api/products');
const data = await response.json();
```

## 🐛 Common Issues

### Issue: "Application failed to start"
**Solution**: Check Render logs for errors. Usually missing environment variables.

### Issue: "Database connection failed"
**Solution**: Verify DATABASE_URL is correct in environment variables.

### Issue: "Email not sending"
**Solution**: 
1. Verify Gmail App Password (not regular password)
2. Enable 2FA on Gmail account
3. Generate new App Password

### Issue: "CORS errors"
**Solution**: Backend already has CORS enabled for all origins. If issues persist, check if requests include proper headers.

## 📊 Monitoring

**View Logs:**
- Go to Render Dashboard
- Select your service
- Click "Logs" tab

**Check Database:**
- Go to Render Dashboard
- Select your PostgreSQL database
- Click "Info" tab to see connection details

## 🔄 Future Updates

To update your deployment:

```bash
# Make changes locally
# Test changes

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# Render will auto-deploy
```

## 🆘 Emergency Rollback

If something breaks:

1. Go to Render Dashboard
2. Click on your service
3. Go to "Events" tab
4. Find last working deployment
5. Click "Redeploy"

## 📞 Support

If you encounter issues:
1. Check Render logs first
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity

---

**You're all set! 🎉**

Your API is now live at: https://noory-backend.onrender.com
