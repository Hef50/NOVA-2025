#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Direct test of the check_upload logic"""

import os
import sys
import base64
from dotenv import load_dotenv
from supabase import create_client

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Load environment
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_BUCKET = "user_uploads"

print("🔧 Direct Test of Image Download Logic")
print("=" * 60)

# Initialize Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
print("✅ Supabase client initialized")

# Test session
session_id = "session_1762640959748_6hc7l199xja"
print(f"\n📋 Testing session: {session_id}")

# List files in the session folder
try:
    files = supabase.storage.from_(SUPABASE_BUCKET).list(session_id)
    print(f"Files found: {[f['name'] for f in files]}")
    
    if files:
        # Try to download the first file
        file_path = f"{session_id}/{files[0]['name']}"
        print(f"\n⬇️ Downloading: {file_path}")
        
        # Download the file
        file_data = supabase.storage.from_(SUPABASE_BUCKET).download(file_path)
        print(f"✅ Downloaded {len(file_data)} bytes")
        
        # Convert to base64
        base64_image = base64.b64encode(file_data).decode('utf-8')
        image_url = f"data:image/jpeg;base64,{base64_image}"
        
        print(f"✅ Converted to base64: {len(image_url)} characters")
        print("\n🎉 SUCCESS! The logic works!")
        print(f"\nImage data preview: {image_url[:100]}...")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

