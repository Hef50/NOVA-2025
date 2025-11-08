# 🚀 Quick Start Guide - QR Code Feature

## Step 1: Configure Backend (2 minutes)

### Option A: Automatic Setup (Recommended)
```bash
cd backend
python setup_env.py
```

### Option B: Manual Setup
1. Create `backend/.env` file
2. Add these lines:
```env
OPENROUTER_API_KEY=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
SUPABASE_URL=https://edgccnkaitculxtukayj.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ2NjbmthaXRjdWx4dHVrYXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDQxNjYsImV4cCI6MjA3ODE4MDE2Nn0.RyBjNGcrrw8DP7rB0GWIHWO3BduS6E39-UacFBxJWTY
```

---

## Step 2: Setup Supabase Storage (3 minutes)

1. **Go to Supabase Dashboard:**
   - Open: https://edgccnkaitculxtukayj.supabase.co
   - Sign in with your account

2. **Create Storage Bucket:**
   - Click **Storage** in left sidebar
   - Click **New bucket**
   - Name: `user_uploads`
   - Toggle **Public bucket** to ON
   - Click **Create bucket**

3. **Verify:**
   - You should see `user_uploads` in bucket list
   - Bucket should show "Public" badge

---

## Step 3: Start Backend (1 minute)

```bash
cd backend
python main.py
```

**Expected output:**
```
✅ Supabase client initialized successfully
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**If you see:**
```
⚠️ Supabase credentials not found in environment variables
```
→ Go back to Step 1

---

## Step 4: Start Frontend (1 minute)

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 5: Test QR Code Feature (2 minutes)

1. **Open app:** http://localhost:5173
2. **Navigate to packing page:**
   - Create or select a trip
   - Click "Packing" tab
3. **Open QR modal:**
   - Click "Scan Suitcase" tab
   - Click "Take Picture with Phone"
4. **Verify:**
   - ✅ Modal opens with split layout
   - ✅ QR code visible on left
   - ✅ Instructions on right
   - ✅ X button in top-right corner

---

## Testing Upload (Optional)

### Manual Test via Supabase Dashboard

1. **Get session ID:**
   - Open QR modal
   - Note session ID (e.g., `session_1234567890_abc123`)

2. **Upload test image:**
   - Go to Supabase Storage → `user_uploads`
   - Click **Upload file**
   - Create folder: `session_1234567890_abc123`
   - Upload an image to that folder

3. **Wait for detection:**
   - Modal should update within 2 seconds
   - Status changes to "Image Received!" ✅
   - Modal closes automatically
   - Analysis starts

---

## Troubleshooting

### Backend won't start
```bash
# Check .env file exists
ls backend/.env

# Verify contents
cat backend/.env

# Reinstall dependencies
pip install -r requirements.txt
```

### "Supabase credentials not found"
- Check `.env` file is in `backend/` directory
- Verify no typos in variable names
- Restart backend after creating `.env`

### QR modal not responsive
- Clear browser cache
- Try different browser
- Check browser width is ≥ 1024px for split view

### Images not detected
1. ✅ Check bucket named `user_uploads` exists
2. ✅ Check bucket is public
3. ✅ Check image uploaded to correct folder: `{session_id}/`
4. ✅ Check backend logs for errors

---

## Quick Reference

### Your Supabase Project
- **URL:** https://edgccnkaitculxtukayj.supabase.co
- **Bucket:** `user_uploads`
- **Folder structure:** `user_uploads/{session_id}/image.jpg`

### Backend Endpoints
- **Check upload:** `GET /check_upload/{session_id}`
- **Upload image:** `POST /upload_qr_image`

### Polling
- **Interval:** 2 seconds
- **Timeout:** None (polls until image found or modal closed)

---

## Next Steps

### For Development
1. ✅ Configure credentials
2. ✅ Create storage bucket
3. ✅ Test QR code flow
4. 🔄 Configure external QR service
5. 🔄 Test end-to-end upload

### For Production
1. 🔄 Add session cleanup job
2. 🔄 Implement rate limiting
3. 🔄 Add file size validation
4. 🔄 Set up monitoring
5. 🔄 Configure CDN

---

## Need Help?

### Documentation
- **Full Setup:** `SUPABASE_SETUP.md`
- **Feature Details:** `QR_CODE_FEATURE.md`
- **Bug Fixes:** `QR_CODE_FIXES.md`

### Common Commands
```bash
# Setup backend
cd backend && python setup_env.py

# Start backend
cd backend && python main.py

# Start frontend
cd frontend && npm run dev

# Check Supabase connection
curl http://localhost:8000/check_upload/test_session
```

### Support Links
- Supabase Docs: https://supabase.com/docs
- Storage Guide: https://supabase.com/docs/guides/storage
- Python Client: https://supabase.com/docs/reference/python

---

**Total Setup Time:** ~10 minutes
**Status:** ✅ Ready to Use
**Last Updated:** November 8, 2025

🎉 **You're all set! Start uploading images via QR code!**

