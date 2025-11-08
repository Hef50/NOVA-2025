# Supabase Setup Guide for QR Code Feature

## Quick Start

### 1. Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create account
3. Create a new project or select existing
4. Go to **Project Settings** → **API**
5. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Configure Backend

Create or update `backend/.env`:

```env
# Add these lines
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `user_uploads`
4. Make it **Public** (or configure RLS policies)
5. Click **Create bucket**

### 4. Test Connection

```bash
cd backend
python main.py
```

**Expected output:**
```
✅ Supabase client initialized successfully
```

## Detailed Configuration

### Storage Bucket Setup

#### Option A: Public Bucket (Easiest)

1. Create bucket named `user_uploads`
2. Toggle **Public bucket** to ON
3. No additional policies needed

#### Option B: Private Bucket with RLS

1. Create bucket named `user_uploads`
2. Keep **Public bucket** OFF
3. Add RLS policy:

```sql
-- Allow uploads to user-specific folders
CREATE POLICY "Allow uploads to user folders"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user_uploads');

-- Allow reading from user folders
CREATE POLICY "Allow reading from user folders"
ON storage.objects FOR SELECT
USING (bucket_id = 'user_uploads');
```

### Folder Structure

Images will be stored as:
```
user_uploads/
├── session_1234567890_abc123/
│   └── image.jpg
├── session_9876543210_xyz789/
│   └── photo.png
└── ...
```

Each session ID gets its own folder.

## External Service Integration

### QR Code Host Configuration

The external service at `https://qrcodehost.vercel.app` needs to:

1. **Receive session ID** from QR code URL parameter
2. **Upload image** to Supabase:
   ```javascript
   // Example upload code
   const { data, error } = await supabase
     .storage
     .from('user_uploads')
     .upload(`${sessionId}/image.jpg`, file)
   ```

3. **Optionally notify backend** (not required - polling will detect it):
   ```javascript
   // Optional: Direct notification
   await fetch('http://localhost:8000/upload_qr_image', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       session_id: sessionId,
       image: base64Image
     })
   })
   ```

## Verification Steps

### 1. Check Backend Logs

When starting backend:
```
✅ Supabase client initialized successfully
```

If you see:
```
⚠️ Supabase credentials not found in environment variables
```
→ Check your `.env` file

### 2. Test Upload Manually

Using Supabase dashboard:
1. Go to **Storage** → `user_uploads`
2. Create a folder named `test_session_123`
3. Upload an image to that folder
4. Call API: `GET http://localhost:8000/check_upload/test_session_123`
5. Should return the image in base64

### 3. Test via QR Code

1. Open packing page
2. Click "Take Picture with Phone"
3. Note the session ID (e.g., `session_1234567890_abc123`)
4. Manually upload to Supabase: `user_uploads/session_1234567890_abc123/test.jpg`
5. Wait 2 seconds (polling interval)
6. Modal should show "Image Received!"

## Troubleshooting

### "Supabase credentials not found"

**Problem:** Backend can't find credentials

**Solutions:**
```bash
# 1. Check .env file exists
ls backend/.env

# 2. Check contents
cat backend/.env

# 3. Verify format (no quotes needed)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbG...

# 4. Restart backend
cd backend
python main.py
```

### "Bucket not found"

**Problem:** `user_uploads` bucket doesn't exist

**Solutions:**
1. Go to Supabase dashboard
2. Storage → Create bucket
3. Name must be exactly `user_uploads`
4. Make public or add RLS policies

### "Permission denied"

**Problem:** Can't read/write to bucket

**Solutions:**
1. Check bucket is public OR
2. Add RLS policies (see above) OR
3. Use service role key instead of anon key (less secure)

### Images Not Detected

**Problem:** Upload works but polling doesn't find image

**Debug checklist:**
```python
# Add to backend/main.py in check_upload function
print(f"Checking session: {session_id}")
print(f"Bucket: {SUPABASE_BUCKET}")
print(f"Files found: {files}")
print(f"File path: {file_path}")
```

**Common issues:**
- ❌ Wrong folder name (must match session ID exactly)
- ❌ Image in root instead of folder
- ❌ Bucket name typo
- ❌ Wrong credentials

## Environment Variables Reference

```env
# Required for QR code feature
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Other required variables
OPENROUTER_API_KEY=sk-or-v1-...
```

## Security Considerations

### Current Setup (Development)

- ✅ Uses anon key (safe for client-side)
- ✅ Public bucket (easy setup)
- ⚠️ No authentication on uploads
- ⚠️ No file size limits

### Production Recommendations

1. **Add Authentication:**
   ```python
   # Verify session is valid before checking
   if not is_valid_session(session_id):
       raise HTTPException(401, "Invalid session")
   ```

2. **Add File Size Limits:**
   ```python
   MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
   if len(image_data) > MAX_FILE_SIZE:
       raise HTTPException(413, "File too large")
   ```

3. **Add Rate Limiting:**
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   
   @app.get("/check_upload/{session_id}")
   @limiter.limit("10/minute")
   async def check_upload(session_id: str):
       ...
   ```

4. **Implement Session Cleanup:**
   ```python
   # Delete old sessions (> 1 hour)
   async def cleanup_old_sessions():
       cutoff = datetime.now() - timedelta(hours=1)
       for session_id, data in list(qr_sessions.items()):
           if data['timestamp'] < cutoff:
               del qr_sessions[session_id]
               # Also delete from Supabase
               supabase.storage.from_('user_uploads').remove([f"{session_id}/"])
   ```

## Performance Tips

### Caching

Current implementation caches images in memory:
```python
qr_sessions[session_id] = {
    "status": "completed",
    "image": image_url,
    "timestamp": json.dumps({"time": "now"})
}
```

**Benefits:**
- ✅ Fast subsequent requests
- ✅ Reduces Supabase API calls

**Limitations:**
- ⚠️ Lost on restart
- ⚠️ Memory usage grows

**Production alternative:**
```python
# Use Redis for persistent cache
import redis
r = redis.Redis(host='localhost', port=6379, db=0)
r.setex(f"session:{session_id}", 3600, image_url)  # 1 hour TTL
```

### Polling Optimization

Current: 2-second polling

**Alternatives:**
1. **WebSocket** - Real-time updates
2. **Supabase Realtime** - Listen to storage changes
3. **Webhook** - External service notifies backend

## Cost Considerations

### Supabase Free Tier

- ✅ 1GB storage
- ✅ 2GB bandwidth/month
- ✅ 50,000 API requests/month

**Estimate:**
- Average image: 2MB
- Storage: ~500 images
- Bandwidth: ~1,000 downloads/month

### Optimization

1. **Compress images** before upload
2. **Delete old images** after analysis
3. **Use CDN** for frequently accessed images

## Next Steps

1. ✅ Configure Supabase credentials
2. ✅ Create `user_uploads` bucket
3. ✅ Test with manual upload
4. ✅ Configure external QR service
5. ✅ Test end-to-end flow
6. 🔄 Monitor usage and costs
7. 🔄 Implement cleanup job
8. 🔄 Add production security

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Storage Guide: https://supabase.com/docs/guides/storage
- Python Client: https://supabase.com/docs/reference/python

**Last Updated:** November 8, 2025

