# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly.

## Before Deployment

### 1. Files Ready
- [ ] Downloaded `noory-shop` folder from Claude
- [ ] Have access to your Git repository
- [ ] Know your repository URL
- [ ] Have Git installed on your computer

### 2. Accounts & Access
- [ ] GitHub account with repository created
- [ ] Render account logged in
- [ ] Access to Render PostgreSQL dashboard
- [ ] Gmail account for sending emails

### 3. Credentials Verified
- [ ] Database URL copied from Render
- [ ] Email password is App Password (not regular password)
- [ ] Know your admin password: `ITSALOTOFWORKMAN`
- [ ] Domain is ready: `shop.nooreyshop.abrdns.com`

## Deployment Steps

### 4. Update Admin Names ⚠️ IMPORTANT
- [ ] Edit `backend/config.py`
- [ ] Change `ALLOWED_ADMIN_NAMES` list (line 23)
- [ ] Replace example names with actual admin names
- [ ] Save file

### 5. Push to Git
- [ ] Navigate to your repository folder
- [ ] Run `git rm -rf .` to clear old files
- [ ] Copy new files: `cp -r /path/to/noory-shop/backend/* .`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Complete rebuild"`
- [ ] Run `git push origin main`
- [ ] Verify push was successful

### 6. Configure Render
- [ ] Go to Render Dashboard
- [ ] Select `noory-backend` service
- [ ] Click "Environment" tab
- [ ] Add all environment variables:
  - [ ] DATABASE_URL
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASSWORD
  - [ ] SMTP_SERVER
  - [ ] SMTP_PORT
  - [ ] JWT_SECRET_KEY
  - [ ] ADMIN_PASSWORD
  - [ ] SECRET_KEY
  - [ ] MAX_DELIVERY_FEE
  - [ ] FLASK_ENV
- [ ] Click "Save Changes"

### 7. Verify Build Settings
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn app:app`
- [ ] Python Version: 3.11.0
- [ ] Settings saved

### 8. Deploy
- [ ] Click "Manual Deploy" button
- [ ] Select "Deploy latest commit"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Check logs for errors
- [ ] Deployment successful (no red errors)

### 9. Initialize Database
- [ ] Open Render Shell
- [ ] Run: `python -c "from app import app, db; app.app_context().push(); db.create_all()"`
- [ ] Database tables created successfully
- [ ] Run: `python seed.py`
- [ ] See "✅ Successfully seeded 27 products!"

## Testing

### 10. API Health Check
- [ ] Test: `curl https://noory-backend.onrender.com/health`
- [ ] Response: `{"status": "healthy"}`

### 11. Test Products
- [ ] Test: `curl https://noory-backend.onrender.com/api/products`
- [ ] Returns list of 27 products
- [ ] Products have Kenyan names (Sukuma Wiki, Mandazi, etc.)

### 12. Test Admin Login
```bash
curl -X POST https://noory-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "YourAdminName", "password": "ITSALOTOFWORKMAN"}'
```
- [ ] Returns JWT token
- [ ] User object has role: "admin"

### 13. Test Customer Registration
```bash
curl -X POST https://noory-backend.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "test123"}'
```
- [ ] Returns success message
- [ ] Returns JWT token
- [ ] Email sent to test@example.com

### 14. Test Cart
- [ ] Register/login as customer (get token)
- [ ] Add product to cart with token
- [ ] Get cart returns items
- [ ] Cart total calculates correctly

### 15. Test Order Creation
- [ ] Add items to cart
- [ ] Create order with delivery details
- [ ] Order appears in orders list
- [ ] Order confirmation email received

### 16. Test Driver Application
```bash
curl -X POST https://noory-backend.onrender.com/api/driver/applications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Driver",
    "email": "driver@example.com",
    "phone": "+254712345678",
    "id_number": "12345678",
    "vehicle_type": "motorbike",
    "vehicle_registration": "KAA 123B"
  }'
```
- [ ] Application submitted successfully
- [ ] Application visible in admin dashboard

## Post-Deployment

### 17. Admin Dashboard
- [ ] Login as admin
- [ ] Dashboard shows stats (orders, customers, drivers, revenue)
- [ ] Can view all orders
- [ ] Can see driver applications
- [ ] Can approve/reject applications

### 18. Driver System
- [ ] Approve a driver application
- [ ] Driver receives email with credentials
- [ ] Driver can login with Driver-1 + secret key
- [ ] Driver sees available orders

### 19. Email System
- [ ] Welcome emails sending on registration
- [ ] Order confirmation emails working
- [ ] Driver approval emails working
- [ ] Emails arrive in inbox (not spam)

### 20. Security Check
- [ ] `.env` file NOT in Git repository
- [ ] Run: `git status | grep .env` (should show nothing)
- [ ] Passwords are hashed (check database)
- [ ] JWT tokens expire after 24 hours

## Optional Enhancements

### 21. Custom Domain
- [ ] Point `shop.nooreyshop.abrdns.com` to Render
- [ ] Update CORS settings if needed
- [ ] SSL certificate active

### 22. Monitoring
- [ ] Set up Render alerts
- [ ] Monitor error logs daily
- [ ] Check database usage
- [ ] Monitor email sending

### 23. Performance
- [ ] API response times < 1 second
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Logs are clean

## Documentation

### 24. Team Onboarding
- [ ] Share API documentation with team
- [ ] Provide admin credentials
- [ ] Document workflow
- [ ] Create user guide

## Production Readiness

### 25. Final Checks
- [ ] All 37 API endpoints tested
- [ ] Error handling works
- [ ] Edge cases considered
- [ ] No hardcoded secrets in code
- [ ] Rate limiting considered
- [ ] Backup strategy planned

### 26. Go Live!
- [ ] Backend is live: ✅
- [ ] Database is populated: ✅
- [ ] Emails are working: ✅
- [ ] Ready for frontend integration: ✅

## Maintenance

### 27. Regular Tasks
- [ ] Check logs weekly
- [ ] Monitor database size
- [ ] Update dependencies monthly
- [ ] Review and respond to feedback
- [ ] Backup database regularly

## Troubleshooting Reference

If something doesn't work:
1. ☑️ Check Render logs first
2. ☑️ Verify environment variables
3. ☑️ Test with curl commands
4. ☑️ Check database connectivity
5. ☑️ Review recent commits
6. ☑️ Check email settings

## Success Criteria

✅ All items checked above
✅ API responding to all requests
✅ Database connected and seeded
✅ Emails sending successfully
✅ Admin can manage everything
✅ Ready for production use

---

## 🎉 Completion

When all boxes are checked, your Noory Shop backend is **LIVE and PRODUCTION-READY**!

**Total Deployment Time**: ~15 minutes
**Features Deployed**: 37 API endpoints
**Products Available**: 27 Kenyan products
**Roles Supported**: Customer, Driver, Admin

---

**Date Deployed**: _______________
**Deployed By**: _______________
**Version**: 1.0.0
**Status**: 🟢 LIVE

---

Print this checklist and check off items as you complete them!
