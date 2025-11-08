from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from vision_service import VisionService
from supabase import create_client, Client
import requests
import json
import os
import base64

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI()

# Initialize vision service
vision_service = VisionService()

# In-memory storage for QR code sessions (in production, use Redis or database)
qr_sessions: Dict[str, Dict[str, Any]] = {}

# API Keys
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
GOOGLE_API_KEY = "AIzaSyCgJYfLGjovXIqUjpeTpgUEFkIJyftERA8"
GOOGLE_CX = "f5f4344fffbda40ab"

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_BUCKET = "user_uploads"

# Initialize Supabase client
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client initialized successfully")
    except Exception as e:
        print(f"⚠️ Failed to initialize Supabase client: {str(e)}")
else:
    print("⚠️ Supabase credentials not found in environment variables")

# API URLs
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1"

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PackingAnalysisRequest(BaseModel):
    image: str  # Base64 encoded image
    packing_list: List[str]  # List of items to check for

class DestinationRequest(BaseModel):
    prompt: Optional[str] = None
    current_location: Optional[str] = None
    price_range: Optional[Dict[str, float]] = None  # {"min": 0, "max": 5000}
    date_range: Optional[Dict[str, str]] = None  # {"start": "2024-01-01", "end": "2024-01-10"}

class ActivityRequest(BaseModel):
    destination: str
    categories: Optional[List[str]] = None
    price_levels: Optional[List[str]] = None  # ["free", "budget", "moderate", "luxury"]

class TravelDealsRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    deal_type: str  # "flight" or "hotel"

class VisaRequest(BaseModel):
    destination: str  # Country name

class QRImageUpload(BaseModel):
    session_id: str
    image: str  # Base64 encoded image

@app.get("/")
async def root():
    """Simple root endpoint"""
    return {"hello": "world"}

@app.post("/chat_streaming")
async def chat_streaming():
    """Chat streaming endpoint - currently returns a test response"""
    return {"response": "This is a test from the backend"}

@app.post("/analyze_packing")
async def analyze_packing(request: PackingAnalysisRequest):
    """
    Analyze a suitcase image and identify packed items
    """
    try:
        result = vision_service.analyze_suitcase_image(
            request.image,
            request.packing_list
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_google_image(query: str) -> str:
    """Get first image result from Google Custom Search"""
    try:
        params = {
            "key": GOOGLE_API_KEY,
            "cx": GOOGLE_CX,
            "q": query,
            "searchType": "image",
            "num": 1
        }
        response = requests.get(GOOGLE_SEARCH_URL, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "items" in data and len(data["items"]) > 0:
                return data["items"][0]["link"]
    except Exception as e:
        print(f"Error fetching image: {e}")
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"  # Fallback

def get_google_search_results(query: str, num_results: int = 5) -> List[Dict[str, Any]]:
    """Get search results from Google Custom Search"""
    try:
        params = {
            "key": GOOGLE_API_KEY,
            "cx": GOOGLE_CX,
            "q": query,
            "num": num_results
        }
        response = requests.get(GOOGLE_SEARCH_URL, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "items" in data:
                return [
                    {
                        "name": item.get("title", ""),
                        "url": item.get("link", ""),
                        "description": item.get("snippet", ""),
                        "estimated_price": "Check website for pricing"
                    }
                    for item in data["items"]
                ]
    except Exception as e:
        print(f"Error fetching search results: {e}")
    return []

@app.post("/generate_destinations")
async def generate_destinations(request: DestinationRequest):
    """Generate AI-powered destination recommendations"""
    try:
        # Build prompt based on filters
        prompt_parts = ["You are a travel recommendation AI. Generate 10 diverse travel destinations."]
        
        if request.prompt:
            prompt_parts.append(f"User preference: {request.prompt}")
        if request.current_location:
            prompt_parts.append(f"Starting from: {request.current_location}")
        if request.price_range:
            min_price = request.price_range.get("min", 0)
            max_price = request.price_range.get("max", 10000)
            prompt_parts.append(f"Budget range: ${min_price} - ${max_price} per person")
        if request.date_range:
            start = request.date_range.get("start", "")
            end = request.date_range.get("end", "")
            prompt_parts.append(f"Travel dates: {start} to {end}")
        
        prompt_parts.append("""
Return a JSON array with exactly 10 destinations. Each destination must have:
- name: city name
- country: country name
- description: 2-3 sentence description highlighting what makes it special
- price: estimated budget range as string (e.g., "$800 - $1,500")
- highlights: array of 3-4 key attractions/features
- bestTimeToVisit: best season or months to visit

Return ONLY the JSON array, no other text.""")
        
        full_prompt = "\n".join(prompt_parts)
        
        payload = {
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a helpful travel recommendation assistant. Always respond with valid JSON."},
                {"role": "user", "content": full_prompt}
            ],
            "temperature": 0.8
        }
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result_text = response.json()["choices"][0]["message"]["content"]
            
            # Clean up response
            clean_text = result_text.strip()
            if clean_text.startswith("```"):
                clean_text = clean_text.split("```")[1]
                clean_text = clean_text.replace("json", "").strip()
            
            destinations = json.loads(clean_text)
            
            # Get images for each destination
            for dest in destinations:
                image_query = f"4k wallpaper of {dest['name']} {dest['country']}"
                dest["imageUrl"] = get_google_image(image_query)
                dest["id"] = f"{dest['name'].lower().replace(' ', '-')}-{dest['country'].lower().replace(' ', '-')}"
            
            return {"destinations": destinations}
        else:
            raise HTTPException(status_code=500, detail="Failed to generate destinations")
            
    except Exception as e:
        print(f"Error in generate_destinations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_activities")
async def generate_activities(request: ActivityRequest):
    """Generate AI-powered activity recommendations"""
    try:
        categories = request.categories or ["sightseeing", "food", "adventure", "cultural", "entertainment"]
        price_levels = request.price_levels or ["free", "budget", "moderate", "luxury"]
        
        prompt = f"""You are a travel activity recommendation AI. Generate activities for {request.destination}.

Create at least 5 activities for EACH of these categories: {', '.join(categories)}
Include activities at different price levels: {', '.join(price_levels)}

Return a JSON array where each activity has:
- id: unique identifier (e.g., "act-1")
- name: activity name
- description: 2-3 sentences about the activity
- category: one of {categories}
- price: estimated cost in USD (number, use 0 for free activities)
- selected: false

Generate at least 25 total activities with good variety. Return ONLY the JSON array."""

        payload = {
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a helpful travel assistant. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result_text = response.json()["choices"][0]["message"]["content"]
            
            # Clean up response
            clean_text = result_text.strip()
            if clean_text.startswith("```"):
                clean_text = clean_text.split("```")[1]
                clean_text = clean_text.replace("json", "").strip()
            
            activities = json.loads(clean_text)
            
            # Get images for activities
            for activity in activities:
                image_query = f"{activity['name']} in {request.destination}"
                activity["imageUrl"] = get_google_image(image_query)
            
            return {"activities": activities}
        else:
            raise HTTPException(status_code=500, detail="Failed to generate activities")
            
    except Exception as e:
        print(f"Error in generate_activities: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search_travel_deals")
async def search_travel_deals(request: TravelDealsRequest):
    """Search for travel and hotel deals"""
    try:
        if request.deal_type == "flight":
            query = f"best flight deals to {request.destination} {request.start_date}"
        else:  # hotel
            query = f"cheap hotels in {request.destination} {request.start_date} to {request.end_date}"
        
        results = get_google_search_results(query, 5)
        
        return {
            "deals": results,
            "destination": request.destination,
            "type": request.deal_type
        }
        
    except Exception as e:
        print(f"Error in search_travel_deals: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.options("/chat_streaming")
async def chat_streaming_options():
    """Handle CORS preflight request for chat_streaming endpoint"""
    return Response(status_code=200)

@app.options("/analyze_packing")
async def analyze_packing_options():
    """Handle CORS preflight request for analyze_packing endpoint"""
    return Response(status_code=200)

@app.options("/generate_destinations")
async def generate_destinations_options():
    """Handle CORS preflight request for generate_destinations endpoint"""
    return Response(status_code=200)

@app.options("/generate_activities")
async def generate_activities_options():
    """Handle CORS preflight request for generate_activities endpoint"""
    return Response(status_code=200)

@app.options("/search_travel_deals")
async def search_travel_deals_options():
    """Handle CORS preflight request for search_travel_deals endpoint"""
    return Response(status_code=200)

@app.post("/get_visa_requirements")
async def get_visa_requirements(request: VisaRequest):
    """Get visa requirements for a destination country using AI"""
    try:
        prompt = f"""You are a travel visa expert. Provide detailed visa requirements for travelers visiting {request.destination}.

Return a JSON object with the following structure:
{{
    "required": true/false (whether a visa is required for most travelers),
    "type": "string (e.g., 'Tourist Visa', 'Visa on Arrival', 'eVisa')",
    "processingTime": "string (e.g., '2-4 weeks', '3-5 business days')",
    "cost": "string (e.g., '$50-100 USD', 'Free', 'Varies by nationality')",
    "requirements": ["array", "of", "required", "documents"],
    "embassyLink": "string (official embassy or visa website URL)",
    "notes": "string (important notes about visa requirements, variations by nationality, etc.)"
}}

Provide accurate, up-to-date information. If visa requirements vary significantly by nationality, mention this in the notes."""

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "NOVA Travel Assistant"
        }

        payload = {
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a travel visa expert providing accurate visa information."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"}
        }

        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        visa_info = json.loads(content)
        
        return {"visa_info": visa_info}
        
    except Exception as e:
        print(f"Error in get_visa_requirements: {str(e)}")
        # Return fallback data
        return {
            "visa_info": {
                "required": True,
                "type": "Tourist Visa",
                "processingTime": "2-4 weeks",
                "cost": "Varies by nationality",
                "requirements": [
                    "Valid passport (6 months validity)",
                    "Completed visa application form",
                    "Recent passport-sized photographs",
                    "Proof of accommodation",
                    "Proof of sufficient funds",
                    "Return flight tickets"
                ],
                "embassyLink": f"https://www.google.com/search?q={request.destination}+embassy+visa+requirements",
                "notes": "Please verify requirements with your local embassy as they may vary by nationality."
            }
        }

@app.options("/get_visa_requirements")
async def get_visa_requirements_options():
    """Handle CORS preflight request for get_visa_requirements endpoint"""
    return Response(status_code=200)

@app.get("/check_upload/{session_id}")
async def check_upload(session_id: str):
    """Check if an image has been uploaded for a given session in Supabase storage"""
    try:
        # First check in-memory cache
        if session_id in qr_sessions:
            session = qr_sessions[session_id]
            return {
                "status": session.get("status", "waiting"),
                "image": session.get("image", None)
            }
        
        # If not in cache and Supabase is configured, check Supabase storage
        if supabase:
            try:
                # List files in the session folder
                files = supabase.storage.from_(SUPABASE_BUCKET).list(session_id)
                
                if files and len(files) > 0:
                    # Get the first image file
                    first_file = files[0]
                    file_path = f"{session_id}/{first_file['name']}"
                    
                    print(f"📥 Downloading: {file_path}")
                    
                    # Download the file directly using service role key
                    file_data = supabase.storage.from_(SUPABASE_BUCKET).download(file_path)
                    
                    # Convert to base64
                    base64_image = base64.b64encode(file_data).decode('utf-8')
                    
                    # Detect image type from filename
                    filename_lower = first_file['name'].lower()
                    if filename_lower.endswith('.png'):
                        image_url = f"data:image/png;base64,{base64_image}"
                    elif filename_lower.endswith('.gif'):
                        image_url = f"data:image/gif;base64,{base64_image}"
                    else:
                        image_url = f"data:image/jpeg;base64,{base64_image}"
                    
                    # Cache it
                    qr_sessions[session_id] = {
                        "status": "completed",
                        "image": image_url,
                        "timestamp": json.dumps({"time": "now"})
                    }
                    
                    print(f"✅ Successfully downloaded and cached image: {file_path}")
                    return {
                        "status": "completed",
                        "image": image_url
                    }
                else:
                    print(f"📂 No files found in session folder: {session_id}")
                        
            except Exception as e:
                print(f"Error checking Supabase storage: {str(e)}")
                # Continue to return waiting status if error
        
        return {"status": "waiting", "image": None}
        
    except Exception as e:
        print(f"Error in check_upload: {str(e)}")
        return {"status": "waiting", "image": None}

@app.post("/upload_qr_image")
async def upload_qr_image(request: QRImageUpload):
    """Receive an image upload from QR code session"""
    try:
        # Store the image in the session
        qr_sessions[request.session_id] = {
            "status": "completed",
            "image": request.image,
            "timestamp": json.dumps({"time": "now"})  # In production, use proper timestamp
        }
        
        return {
            "success": True,
            "message": "Image uploaded successfully",
            "session_id": request.session_id
        }
    except Exception as e:
        print(f"Error uploading QR image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.options("/check_upload/{session_id}")
async def check_upload_options(session_id: str):
    """Handle CORS preflight request for check_upload endpoint"""
    return Response(status_code=200)

@app.options("/upload_qr_image")
async def upload_qr_image_options():
    """Handle CORS preflight request for upload_qr_image endpoint"""
    return Response(status_code=200)


