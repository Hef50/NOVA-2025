#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update .env file with service role key"""

import os
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Configuration
SUPABASE_URL = "https://edgccnkaitculxtukayj.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ2NjbmthaXRjdWx4dHVrYXlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYwNDE2NiwiZXhwIjoyMDc4MTgwMTY2fQ.sb_secret_CY6oEkBtZ95UDQN2BwlRAg_aqZHAiGi"
OPENROUTER_API_KEY = "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"

def update_env_file():
    """Update .env file with service role key"""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    # Create .env content with service role key
    env_content = f"""# OpenRouter API Configuration
OPENROUTER_API_KEY={OPENROUTER_API_KEY}

# Supabase Configuration (for QR code image uploads)
# Using SERVICE ROLE KEY for full access
SUPABASE_URL={SUPABASE_URL}
SUPABASE_KEY={SERVICE_ROLE_KEY}
"""
    
    # Write to file
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print("✅ .env file updated with service role key!")
        print(f"📁 Location: {env_path}")
        print("\n⚠️  IMPORTANT: Service role key has admin access!")
        print("   Keep this key secret and never commit to git")
        print("\n📋 Next step: Restart backend")
        print("   cd backend && python main.py")
    except Exception as e:
        print(f"❌ Error updating .env file: {str(e)}")

if __name__ == "__main__":
    print("🔧 Updating .env with Service Role Key")
    print("=" * 50)
    update_env_file()

