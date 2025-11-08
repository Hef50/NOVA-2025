#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test endpoint and show detailed request info"""

import requests
import sys
import time

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Wait for backend
time.sleep(3)

# Test different URLs
test_urls = [
    "http://localhost:8000/",
    "http://localhost:8000/check_upload/session_1762640959748_6hc7l199xja",
    "http://127.0.0.1:8000/check_upload/session_1762640959748_6hc7l199xja",
]

print("🔍 Testing Backend Endpoints")
print("=" * 60)

for url in test_urls:
    print(f"\nTesting: {url}")
    try:
        r = requests.get(url, timeout=10)
        print(f"  Status: {r.status_code}")
        if r.status_code == 200:
            try:
                data = r.json()
                if isinstance(data, dict) and "image" in data:
                    print(f"  ✅ SUCCESS! Image found")
                    print(f"  Image length: {len(data.get('image', ''))} chars")
                else:
                    print(f"  Response: {str(data)[:100]}")
            except:
                print(f"  Response: {r.text[:100]}")
        else:
            print(f"  Response: {r.text[:200]}")
    except Exception as e:
        print(f"  ❌ Error: {e}")

print("\n" + "=" * 60)
print("\n💡 If all return 404, the backend might not be fully started")
print("   or there's a routing issue with FastAPI")

