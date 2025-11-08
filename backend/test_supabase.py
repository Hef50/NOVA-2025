#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test Supabase connection and file access"""

from supabase import create_client
import os
import sys
from dotenv import load_dotenv

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Load environment variables
load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')

print(f"URL: {url}")
print(f"Key: {key[:20]}..." if key else "Key: None")
print()

# Create client
supabase = create_client(url, key)
print("✅ Supabase client created")
print()

# Test 1: List all buckets
print("📦 Testing bucket access...")
try:
    buckets = supabase.storage.list_buckets()
    print(f"Buckets found: {[b.name for b in buckets]}")
except Exception as e:
    print(f"❌ Error listing buckets: {e}")
print()

# Test 2: List files in user_uploads
print("📁 Testing file listing...")
session_id = "session_1762640659664_hcpd8l8obp"
try:
    # Try different path formats
    print(f"Trying to list: '{session_id}'")
    files = supabase.storage.from_('user_uploads').list(session_id)
    print(f"Files in folder: {files}")
    
    print(f"\nTrying to list: '' (root)")
    files_root = supabase.storage.from_('user_uploads').list('')
    print(f"Files in root: {files_root}")
    
    print(f"\nTrying to list: None")
    files_none = supabase.storage.from_('user_uploads').list()
    print(f"Files with no path: {files_none}")
except Exception as e:
    print(f"❌ Error listing files: {e}")
print()

# Test 3: Try to download the specific file
print("⬇️ Testing file download...")
file_paths = [
    f"{session_id}/1762640659664.jpg",
    "session_1762640659664_hcpd8l8obp/1762640659664.jpg",
    "1762640659664.jpg",
]

for file_path in file_paths:
    try:
        print(f"Trying: '{file_path}'")
        data = supabase.storage.from_('user_uploads').download(file_path)
        print(f"✅ Downloaded: {len(data)} bytes")
        break
    except Exception as e:
        print(f"❌ Error: {e}")
print()

# Test 4: Get public URL
print("🔗 Testing public URL...")
try:
    public_url = supabase.storage.from_('user_uploads').get_public_url(f"{session_id}/1762640659664.jpg")
    print(f"Public URL: {public_url}")
except Exception as e:
    print(f"❌ Error: {e}")

