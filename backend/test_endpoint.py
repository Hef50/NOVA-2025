#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test the check_upload endpoint"""

import requests
import sys
import time

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Wait for backend to start
print("⏳ Waiting for backend to start...")
time.sleep(3)

# Test with the session that has an image
session_id = "session_1762640959748_6hc7l199xja"
url = f"http://localhost:8000/check_upload/{session_id}"

print(f"\n🔍 Testing endpoint: {url}")
print("=" * 60)

try:
    response = requests.get(url, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "completed" and data.get("image"):
            print("\n✅ SUCCESS! Image detected and converted to base64!")
            print(f"Image data length: {len(data['image'])} characters")
            print("\n🎉 The QR code feature is now working!")
        else:
            print(f"\n⚠️ Status: {data.get('status')}")
            print("Image not found yet")
    else:
        print(f"\n❌ Error: {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("\n❌ Backend is not running!")
    print("Start it with: cd backend && python main.py")
except Exception as e:
    print(f"\n❌ Error: {e}")

