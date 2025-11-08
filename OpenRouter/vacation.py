import requests
import json

openrouter_api_key_file = open("OPENROUTER_API_KEY.txt", 'r')
API_KEY  = openrouter_api_key_file.read() # This is your API key to use in requests
openrouter_api_key_file.close()
# OpenRouter API key
API_URL = "https://openrouter.ai/api/v1/chat/completions"

def get_vacation_recommendations(preferences):
    """
    preferences: dict with keys like location, dates, price
    Example:
    {
        "location": "Europe",
        "dates": "2025-12-15 to 2025-12-30",
        "price": "budget"
    }
    """

    # Create the prompt for the LLM
    prompt = f"""
    You are a travel planning AI. Based on the following preferences:
    Location: {preferences.get('location')}
    Dates: {preferences.get('dates')}
    Price range: {preferences.get('price')}
    
    Suggest 6 vacation recommendations in JSON format with the following fields:
    - title: A short catchy name for the trip
    - destination: The main destination city or region
    - summary: A brief description of why this is a good choice
    - price_estimate: Estimated cost for the trip
    """

    # Prepare the request payload
    payload = {
        "model": "openai/gpt-4",  # You can switch to other models like claude-3
        "messages": [
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    # Make the API request
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        # Extract the model's response
        result_text = response.json()["choices"][0]["message"]["content"]

        # Try to parse the JSON from the model's output
        try:
            recommendations = json.loads(result_text)
        except json.JSONDecodeError:
            recommendations = {"error": "Model did not return valid JSON", "raw_output": result_text}

        return recommendations
    else:
        return {"error": f"API request failed with status {response.status_code}", "details": response.text}


# Example usage
if __name__ == "__main__":
    user_preferences = {
        "location": "Europe",
        "dates": "2025-12-15 to 2025-12-30",
        "price": "100,000-200,000"
    }

    recommendations = get_vacation_recommendations(user_preferences)
    print(json.dumps(recommendations, indent=2))
