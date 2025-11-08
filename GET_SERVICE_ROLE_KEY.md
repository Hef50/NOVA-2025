# How to Get the Correct Service Role Key

## The Issue

The secret you provided (`sb_secret_CY6oEkBtZ95UDQN2BwlRAg_aqZHAiGi`) is just the signing secret, not the full service role key.

## Get the Full Service Role Key

1. **Go to Supabase Dashboard:**
   - https://edgccnkaitculxtukayj.supabase.co

2. **Navigate to Settings:**
   - Click **Project Settings** (gear icon in bottom left)
   - Click **API** in the left menu

3. **Find Service Role Key:**
   - Scroll down to **Project API keys**
   - Find the key labeled **`service_role`** (NOT `anon`)
   - It should start with `eyJ...` and be very long
   - Click the **Copy** button

4. **Update .env:**
   - Open `backend/.env`
   - Replace the `SUPABASE_KEY` line with:
   ```env
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ2NjbmthaXRjdWx4dHVrYXlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYwNDE2NiwiZXhwIjoyMDc4MTgwMTY2fQ.YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE
   ```

## What You Should See

### In Supabase Dashboard → Settings → API:

```
Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ2NjbmthaXRjdWx4dHVrYXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDQxNjYsImV4cCI6MjA3ODE4MDE2Nn0.RyBjNGcrrw8DP7rB0GWIHWO3BduS6E39-UacFBxJWTY
[Copy button]

service_role secret  ⚠️ This key has the ability to bypass Row Level Security. Never share it publicly.
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ2NjbmthaXRjdWx4dHVrYXlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYwNDE2NiwiZXhwIjoyMDc4MTgwMTY2fQ.XXXXXXXXXXXXXXXXXX
[Copy button]  <-- COPY THIS ONE
```

## Alternative: Use Public URL Approach (No Service Key Needed)

Since the bucket is already public, we can use the public URL approach. Let me test if the public URL works:

### Test Public URL:

```bash
curl "https://edgccnkaitculxtukayj.supabase.co/storage/v1/object/public/user_uploads/session_1762640659664_hcpd8l8obp/1762640659664.jpg" -I
```

**If you get:**
- `200 OK` → Public access works! ✅
- `404 Not Found` → File path is wrong
- `403 Forbidden` → Bucket is not actually public

## Quick Fix: Make Sure Bucket is REALLY Public

1. Go to **Storage** → `user_uploads`
2. Click the **⋮** menu
3. Click **Edit bucket**
4. **Make sure "Public bucket" toggle is ON** (should be green/blue)
5. Click **Save**
6. **Refresh the page** to confirm it shows "Public" badge

## Then Test Again

```bash
cd backend
python -c "import requests; r = requests.get('https://edgccnkaitculxtukayj.supabase.co/storage/v1/object/public/user_uploads/session_1762640659664_hcpd8l8obp/1762640659664.jpg'); print(f'Status: {r.status_code}'); print(f'Size: {len(r.content)} bytes' if r.status_code == 200 else 'Not accessible')"
```

---

**Bottom Line:**
- If bucket is truly public → Public URL approach should work (no service key needed)
- If public URL returns 200 → Backend will work
- If still 404 → Check exact file path in Supabase storage

