import requests
import json


openrouter_api_key_file = open("OPENROUTER_API_KEY.txt", 'r')
API_KEY  = openrouter_api_key_file.read() # This is your API key to use in requests
openrouter_api_key_file.close()

API_URL = "https://openrouter.ai/api/v1/chat/completions"

def get_activity_list(destination_info):
    """
    destination_info: dict with keys like title, destination, summary, price_estimate
    Example:
    {
        "title": "Winter Wonderland in Prague",
        "destination": "Prague, Czech Republic",
        "summary": "Affordable winter destination with stunning architecture, Christmas markets, and cozy cafes.",
        "price_estimate": "budget"
    }
    """

    prompt = f"""
    You are a travel assistant. Based on this trip:
    Title: {destination_info.get('title')}
    Destination: {destination_info.get('destination')}
    Summary: {destination_info.get('summary')}
    Price estimate: {destination_info.get('price_estimate')}

    Generate a JSON list of 20 recommended activities for this destination.
    Each activity should have:
    - name: short name of the activity
    - description: what it is and why it's interesting
    - category: e.g., sightseeing, food, adventure, cultural
    - estimated_cost: approximate cost in USD
    Ensure activities match the price estimate (budget, mid-range, luxury).
    """

    payload = {
        "model": "openai/gpt-4",  # or "anthropic/claude-3"
        "messages": [
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        result_text = response.json()["choices"][0]["message"]["content"]
        try:
            activities = json.loads(result_text)
        except json.JSONDecodeError:
            activities = {"error": "Model did not return valid JSON", "raw_output": result_text}
        return activities
    else:
        return {"error": f"API request failed with status {response.status_code}", "details": response.text}


# Example usage
if __name__ == "__main__":
    chosen_trip = {
        "title": "Winter Wonderland in Prague",
        "destination": "Prague, Czech Republic",
        "summary": "Affordable winter destination with stunning architecture, Christmas markets, and cozy cafes.",
        "price_estimate": "budget"
    }

    activities = get_activity_list(chosen_trip)
    print(json.dumps(activities, indent=2))