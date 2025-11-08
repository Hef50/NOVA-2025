from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from vision_service import VisionService

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI()

# Initialize vision service
vision_service = VisionService()

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

@app.options("/chat_streaming")
async def chat_streaming_options():
    """Handle CORS preflight request for chat_streaming endpoint"""
    return Response(status_code=200)

@app.options("/analyze_packing")
async def analyze_packing_options():
    """Handle CORS preflight request for analyze_packing endpoint"""
    return Response(status_code=200)


