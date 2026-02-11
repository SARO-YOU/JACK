# Git Commands for Deployment

## Initial Setup (First Time Only)

### If you don't have a Git repository yet:
```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Deploying This Project

### Option 1: Clean Slate (Recommended)

Remove all old files and add new ones:

```bash
# 1. Go to your repository
cd /path/to/your/noory-flask

# 2. Remove all tracked files
git rm -rf .

# 3. Commit the deletion
git commit -m "Clear old files"

# 4. Copy new files
cp -r /path/to/noory-shop/backend/* .

# 5. Add new files (EXCEPT .env!)
git add .

# 6. Commit
git commit -m "Complete rebuild: Production e-commerce platform"

# 7. Push (Render will auto-deploy)
git push origin main
```

### Option 2: Replace Specific Files

If you want to keep some files:

```bash
# Copy only what you need
cp /path/to/noory-shop/backend/app.py .
cp /path/to/noory-shop/backend/models.py .
# ... etc

# Stage changes
git add app.py models.py

# Commit
git commit -m "Update core files"

# Push
git push origin main
```

## Common Git Commands

### Check Status
```bash
git status
```

### Add Files
```bash
# Add all files
git add .

# Add specific file
git add filename.py

# Add multiple files
git add file1.py file2.py
```

### Commit Changes
```bash
# Commit with message
git commit -m "Your message here"

# Add and commit in one step
git commit -am "Your message"
```

### Push to Remote
```bash
# Push to main branch
git push origin main

# Force push (use carefully!)
git push -f origin main
```

### View Commit History
```bash
# See recent commits
git log

# See last 5 commits
git log -5

# See compact history
git log --oneline
```

### Undo Changes

```bash
# Discard local changes (before commit)
git checkout -- filename.py

# Undo last commit (keep changes)
git reset HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Branching

```bash
# Create new branch
git branch feature-name

# Switch to branch
git checkout feature-name

# Create and switch
git checkout -b feature-name

# List branches
git branch

# Merge branch
git checkout main
git merge feature-name
```

## Important .gitignore Rules

Make sure your `.gitignore` includes:

```
__pycache__/
*.pyc
.env
venv/
*.db
.DS_Store
```

**NEVER commit:**
- `.env` file (contains passwords!)
- `__pycache__/` (Python cache)
- Virtual environment folders

## Verify Before Pushing

```bash
# Check what will be pushed
git status

# Check what changed
git diff

# Make sure .env is not staged
git status | grep .env
# Should show nothing!
```

## Emergency: Remove .env from Git

If you accidentally committed `.env`:

```bash
# Remove from Git (keep local copy)
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit
git commit -m "Remove .env from tracking"

# Push
git push origin main
```

## Check Remote Repository

```bash
# See remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/NEW_URL.git
```

## Clone Repository (For Another Computer)

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Go to directory
cd YOUR_REPO

# Create .env file manually
nano .env
# Paste your environment variables
# Save and exit (Ctrl+X, Y, Enter)
```

## Deployment Workflow

**Every time you make changes:**

```bash
# 1. Make your changes
# Edit files in your editor

# 2. Test locally
python app.py

# 3. Check what changed
git status
git diff

# 4. Stage changes
git add .

# 5. Commit with descriptive message
git commit -m "Add payment integration"

# 6. Push to trigger deployment
git push origin main

# 7. Wait for Render to deploy
# Check Render logs for status
```

## Quick Reference

| Command | What it does |
|---------|-------------|
| `git status` | See what changed |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Save changes |
| `git push origin main` | Upload to GitHub |
| `git pull origin main` | Download latest |
| `git log` | See history |
| `git diff` | See changes |

## Connecting to GitHub

### First time setup:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Using SSH (Recommended):
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH Keys → New SSH Key

# Test connection
ssh -T git@github.com
```

### Using HTTPS:
```bash
# You'll be prompted for username/password on push
git push origin main
```

## For Render Deployment

Render automatically deploys when you push to `main` branch.

**After pushing:**
1. Go to Render Dashboard
2. Click on your service
3. Watch "Events" tab
4. See deployment progress in "Logs"

**Deployment usually takes 2-3 minutes.**

## Rollback to Previous Version

If new deployment breaks:

```bash
# Find commit hash
git log

# Reset to previous commit
git reset --hard COMMIT_HASH

# Force push
git push -f origin main
```

Or use Render Dashboard:
1. Go to "Events" tab
2. Find last working deployment
3. Click "Redeploy"

---

## 🎯 Quick Deploy Command

For this project:
```bash
cd /path/to/your/noory-flask && \
git rm -rf . && \
git commit -m "Clear" && \
cp -r /path/to/noory-shop/backend/* . && \
git add . && \
git commit -m "Deploy production version" && \
git push origin main
```

Copy and paste this one-liner (after updating paths)!

---

**Remember:** 
- Always commit before making major changes
- Use descriptive commit messages
- Never commit `.env` file
- Push to `main` branch for Render deployment
