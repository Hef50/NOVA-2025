#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test if public URL works for the uploaded image"""

import requests
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Test the exact URL from Supabase
url = "https://edgccnkaitculxtukayj.supabase.co/storage/v1/object/public/user_uploads/session_1762640659664_hcpd8l8obp/1762640659664.jpg"

print(f"Testing URL: {url}")
print()

try:
    r = requests.get(url, timeout=10)
    print(f"Status Code: {r.status_code}")
    print(f"Content-Type: {r.headers.get('content-type', 'unknown')}")
    
    if r.status_code == 200:
        print(f"✅ SUCCESS! Image accessible")
        print(f"Size: {len(r.content):,} bytes")
        print()
        print("The backend should work now!")
    elif r.status_code == 404:
        print(f"❌ 404 Not Found")
        print(f"Response: {r.text[:500]}")
        print()
        print("Possible issues:")
        print("1. File path is wrong")
        print("2. File doesn't exist at this location")
        print("3. Check exact path in Supabase Storage")
    elif r.status_code == 403:
        print(f"❌ 403 Forbidden")
        print(f"Response: {r.text[:500]}")
        print()
        print("Bucket is NOT actually public!")
        print("Go to Supabase → Storage → user_uploads")
        print("Click ⋮ → Edit bucket → Toggle 'Public bucket' ON")
    else:
        print(f"❌ Unexpected status: {r.status_code}")
        print(f"Response: {r.text[:500]}")
        
except Exception as e:
    print(f"❌ Error: {e}")

