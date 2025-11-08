# 🔧 Fix Supabase Permissions - URGENT

## Problem Identified

The `user_uploads` bucket exists but **is not accessible** with the anon key. This is why the app can't detect uploaded images.

## Solution: Make Bucket Public

### Step 1: Go to Supabase Storage Settings

1. Open: **https://edgccnkaitculxtukayj.supabase.co**
2. Click **Storage** in the left sidebar
3. Find the `user_uploads` bucket
4. Click on `user_uploads` to select it

### Step 2: Make Bucket Public

**Option A: Via Bucket Settings (Recommended)**
1. Click the **⋮** (three dots) next to `user_uploads`
2. Click **Edit bucket**
3. Toggle **Public bucket** to **ON**
4. Click **Save**

**Option B: Via Policies Tab**
1. Click on `user_uploads` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Add this policy:

```sql
-- Policy name: Public Access
-- Allowed operation: SELECT
-- Target roles: public

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'user_uploads' );
```

6. Click **Review** → **Save policy**

### Step 3: Verify It Works

Run this test:

```bash
cd backend
python -c "import requests; url = 'https://edgccnkaitculxtukayj.supabase.co/storage/v1/object/public/user_uploads/session_1762640659664_hcpd8l8obp/1762640659664.jpg'; r = requests.get(url); print(f'Status: {r.status_code}')"
```

**Expected output:**
```
Status: 200
```

**If you see:**
```
Status: 400 or 404
```
→ Bucket is still not public

---

## Alternative: Use Service Role Key (Less Secure)

If you can't make the bucket public, use the service role key instead:

### Step 1: Get Service Role Key

1. Go to **Project Settings** → **API**
2. Find **service_role** key (starts with `eyJ...`)
3. **⚠️ WARNING:** This key has admin access - keep it secret!

### Step 2: Update .env

Replace in `backend/.env`:
```env
# Change this line:
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ2NjbmthaXRjdWx4dHVrYXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDQxNjYsImV4cCI6MjA3ODE4MDE2Nn0.RyBjNGcrrw8DP7rB0GWIHWO3BduS6E39-UacFBxJWTY

# To this (your service_role key):
SUPABASE_KEY=your_service_role_key_here
```

### Step 3: Restart Backend

```bash
cd backend
python main.py
```

---

## Quick Test After Fix

### Test 1: Check Backend Connection

```bash
cd backend
python test_supabase.py
```

**Expected output:**
```
✅ Supabase client created
Buckets found: ['user_uploads']  # Should show the bucket
```

### Test 2: Test Image Fetch

```bash
curl "http://localhost:8000/check_upload/session_1762640659664_hcpd8l8obp"
```

**Expected output:**
```json
{
  "status": "completed",
  "image": "data:image/jpeg;base64,..."
}
```

**If you see:**
```json
{
  "status": "waiting",
  "image": null
}
```
→ Still can't access the file

---

## Understanding the Issue

### What Went Wrong

1. **Bucket created** ✅
2. **Image uploaded** ✅
3. **Bucket NOT public** ❌
4. **Anon key can't read** ❌

### Why It Matters

- **Anon key** = Safe for client-side, limited permissions
- **Service role key** = Admin access, should stay on server
- **Public bucket** = Anyone can read (but not write without auth)

### Current Status

```
Your Setup:
├── Bucket: user_uploads ✅
├── Image: session_1762640659664_hcpd8l8obp/1762640659664.jpg ✅
├── Public access: ❌ (THIS IS THE PROBLEM)
└── Backend can't fetch: ❌
```

---

## Step-by-Step Fix (Screenshots Guide)

### 1. Navigate to Storage
![Storage Tab](Click "Storage" in left sidebar)

### 2. Find user_uploads Bucket
![Bucket List](You should see "user_uploads" in the list)

### 3. Click Three Dots Menu
![Menu](Click ⋮ next to user_uploads)

### 4. Edit Bucket
![Edit](Select "Edit bucket")

### 5. Toggle Public
![Public Toggle](Turn ON "Public bucket")

### 6. Save
![Save](Click "Save" button)

### 7. Verify
![Verify](Bucket should now show "Public" badge)

---

## After Making It Public

### Restart Backend

```bash
# Stop backend (Ctrl+C)
cd backend
python main.py
```

### Test in App

1. Open http://localhost:5173
2. Go to packing page
3. Click "Take Picture with Phone"
4. Note the session ID
5. Upload image to Supabase with that session ID
6. Wait 2 seconds
7. Should see "Image Received!" ✅

---

## Troubleshooting

### "I made it public but still doesn't work"

1. **Clear browser cache**
2. **Restart backend**
3. **Check file path matches:**
   - Should be: `user_uploads/{session_id}/{filename}.jpg`
   - Example: `user_uploads/session_1762640659664_hcpd8l8obp/1762640659664.jpg`

### "I can't find the public toggle"

Try the policy approach:
1. Storage → user_uploads
2. Policies tab
3. New Policy → Full customization
4. Paste the SQL policy above

### "Still getting 404"

Check the exact file path in Supabase:
1. Storage → user_uploads
2. Click on the session folder
3. Note the exact filename
4. Update the test URL to match

---

## Security Notes

### Public Bucket (Recommended)

✅ **Pros:**
- Safe to use anon key
- Anyone can read
- Can't write without auth

❌ **Cons:**
- Images are publicly accessible
- Anyone with URL can view

### Service Role Key (Not Recommended)

✅ **Pros:**
- Full access
- Can read/write/delete

❌ **Cons:**
- Admin access - very dangerous if leaked
- Should NEVER be in client-side code
- Only use on backend

---

## Next Steps

1. ✅ Make bucket public (5 minutes)
2. ✅ Restart backend
3. ✅ Test with existing image
4. ✅ Test with new upload
5. 🎉 Feature working!

---

**Need Help?**

If you're still stuck after making the bucket public:
1. Check backend logs for errors
2. Verify the exact file path in Supabase
3. Try the test commands above
4. Check if bucket shows "Public" badge

**Last Updated:** November 8, 2025

