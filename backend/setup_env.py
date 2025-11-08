#!/usr/bin/env python3
"""
Setup script to create .env file with Supabase credentials
Run this script to automatically configure your backend
"""

import os

# Configuration
SUPABASE_URL = "https://edgccnkaitculxtukayj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ2NjbmthaXRjdWx4dHVrYXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDQxNjYsImV4cCI6MjA3ODE4MDE2Nn0.RyBjNGcrrw8DP7rB0GWIHWO3BduS6E39-UacFBxJWTY"
OPENROUTER_API_KEY = "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"

def create_env_file():
    """Create .env file with credentials"""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    # Check if .env already exists
    if os.path.exists(env_path):
        response = input(".env file already exists. Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("❌ Setup cancelled")
            return
    
    # Create .env content
    env_content = f"""# OpenRouter API Configuration
OPENROUTER_API_KEY={OPENROUTER_API_KEY}

# Supabase Configuration (for QR code image uploads)
SUPABASE_URL={SUPABASE_URL}
SUPABASE_KEY={SUPABASE_KEY}
"""
    
    # Write to file
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print("✅ .env file created successfully!")
        print(f"📁 Location: {env_path}")
        print("\n📋 Next steps:")
        print("1. Go to https://edgccnkaitculxtukayj.supabase.co")
        print("2. Navigate to Storage")
        print("3. Create a bucket named 'user_uploads'")
        print("4. Make it public or configure RLS policies")
        print("5. Run: python main.py")
        print("\n🎉 You're all set!")
    except Exception as e:
        print(f"❌ Error creating .env file: {str(e)}")
        print("\n📝 Manual setup:")
        print("1. Create a file named .env in the backend directory")
        print("2. Copy the following content:")
        print(env_content)

if __name__ == "__main__":
    print("🚀 NOVA-2025 Backend Setup")
    print("=" * 50)
    create_env_file()

