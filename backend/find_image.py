#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Find the correct path for the uploaded image"""

import requests
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

base_url = "https://edgccnkaitculxtukayj.supabase.co/storage/v1/object/public/user_uploads"

# From the screenshot, try different possible paths
possible_paths = [
    # Original attempt
    "session_1762640659664_hcpd8l8obp/1762640659664.jpg",
    "session_1762640659664_hcpdbfb6brc/1762640659664.jpg",  # From screenshot
    
    # Maybe it's directly in the bucket
    "1762640659664.jpg",
    
    # Maybe different session ID format
    "session_1762640659664/1762640659664.jpg",
    "1762640659664/1762640659664.jpg",
    
    # Maybe different file extension
    "session_1762640659664_hcpdbfb6brc/1762640659664.jpeg",
    "session_1762640659664_hcpdbfb6brc/1762640659664.png",
    
    # Maybe different filename
    "session_1762640659664_hcpdbfb6brc/image.jpg",
    "session_1762640659664_hcpdbfb6brc/photo.jpg",
]

print("🔍 Searching for the uploaded image...")
print("=" * 60)
print()

found = False
for path in possible_paths:
    url = f"{base_url}/{path}"
    try:
        r = requests.get(url, timeout=5)
        status_icon = "✅" if r.status_code == 200 else "❌"
        print(f"{status_icon} {r.status_code} | {path}")
        
        if r.status_code == 200:
            print(f"\n🎉 FOUND IT!")
            print(f"Path: {path}")
            print(f"Full URL: {url}")
            print(f"Size: {len(r.content):,} bytes")
            print(f"Content-Type: {r.headers.get('content-type', 'unknown')}")
            found = True
            break
    except Exception as e:
        print(f"❌ ERROR | {path} | {e}")

print()
print("=" * 60)

if not found:
    print("\n❌ Image not found in any of the tried paths")
    print("\n📋 Please check Supabase Storage and provide:")
    print("1. The exact folder name")
    print("2. The exact file name")
    print("3. Screenshot of the file in Supabase Storage")
else:
    print("\n✅ Update the backend to use this path!")

