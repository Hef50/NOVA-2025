import json
import requests

# Load environment variables
openrouter_api_key_file = open("OPENROUTER_API_KEY.txt", 'r')
OPENROUTER_API_KEY  = openrouter_api_key_file.read() # This is your API key to use in requests
openrouter_api_key_file.close()
GOOGLE_API_KEY = "AIzaSyCgJYfLGjovXIqUjpeTpgUEFkIJyftERA8"
GOOGLE_CX = "f5f4344fffbda40ab"

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1"


def get_real_link(query):
    """
    Uses Google Custom Search API to find the most relevant link for a booking or activity.
    """
    params = {
        "key": GOOGLE_API_KEY,
        "cx": GOOGLE_CX,
        "q": query
    }
    response = requests.get(GOOGLE_SEARCH_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        if "items" in data and len(data["items"]) > 0:
            return data["items"][0]["link"]  # First result link
    return None


def generate_trip_plan(selected_activities, destination_info):
    """
    Inputs:
    - destination_info: {title, destination, summary, price_estimate}
    - selected_activities: list of {name, category}
    Output:
    JSON with keys: itinerary, bookings, packing_list
    Each key contains its own structured JSON list.
    """

    prompt = f"""
    You are a travel planning AI. Based on this trip:
    Title: {destination_info.get('title')}
    Destination: {destination_info.get('destination')}
    Summary: {destination_info.get('summary')}
    Price estimate: {destination_info.get('price_estimate')}

    Selected activities:
    {json.dumps(selected_activities)}

    Generate three separate JSON arrays:
    1. itinerary: Each item has (activity_name, location, time)
    2. bookings: Each item has (booking_name, company_name, link=null)
       - Do NOT hallucinate links. Leave link as null.
    3. packing_list: Each item has (item, count)
       - Tailor to destination weather and activities.
    Return the result as a single JSON object with keys: itinerary, bookings, packing_list.
    """

    payload = {
        "model": "openai/gpt-4",
        "messages": [
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "response_format": {"type": "json_object"}  # Force JSON output
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(OPENROUTER_URL, headers=headers, json=payload)

    if response.status_code == 200:
        result_text = response.json()["choices"][0]["message"]["content"]

        # Clean up in case response_format didn't work (fallback)
        clean_text = result_text.strip()
        if clean_text.startswith("```"):
            clean_text = clean_text.split("```")[1]
            clean_text = clean_text.replace("json", "").strip()

        try:
            trip_plan = json.loads(clean_text)
        except json.JSONDecodeError:
            trip_plan = {"error": "Model did not return valid JSON", "raw_output": result_text}

        # Replace null links with real ones using Google Search
        if "bookings" in trip_plan:
            for booking in trip_plan["bookings"]:
                query = f"{booking['booking_name']} {booking['company_name']} official site"
                real_link = get_real_link(query)
                booking["link"] = real_link if real_link else "Link not found"

        return trip_plan
    else:
        return {"error": f"API request failed with status {response.status_code}", "details": response.text}


# Example usage
if __name__ == "__main__":
    destination_info = {
        "title": "Winter Wonderland in Prague",
        "destination": "Prague, Czech Republic",
        "summary": "Affordable winter destination with stunning architecture, Christmas markets, and cozy cafes.",
        "price_estimate": "budget"
    }

    selected_activities = [
        {"name": "Charles Bridge Walk", "category": "Sightseeing"},
        {"name": "Prague Castle Tour", "category": "Cultural"},
        {"name": "Christmas Market Visit", "category": "Food & Culture"}
    ]

    trip_plan = generate_trip_plan(selected_activities, destination_info)
    print(json.dumps(trip_plan, indent=2))