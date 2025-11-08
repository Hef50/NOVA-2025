import os
import requests
from typing import List, Dict

class VisionService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
    def analyze_suitcase_image(self, image_base64: str, packing_list: List[str]) -> Dict[str, List[str]]:
        """
        Analyze a suitcase image and identify packed items
        
        Args:
            image_base64: Base64 encoded image string
            packing_list: List of items to check for
            
        Returns:
            Dictionary with 'packed' and 'missing' lists
        """
        
        # Create prompt for vision model
        items_text = ", ".join(packing_list)
        prompt = f"""You are analyzing a suitcase image to identify packed items.

Here is the packing list to check against:
{items_text}

Please analyze the image and identify which items from the list are visible in the suitcase.
Return your response in this exact JSON format:
{{
    "packed": ["item1", "item2", ...],
    "missing": ["item3", "item4", ...]
}}

Only include items that are clearly visible in the image. Be conservative - if you're not sure an item is there, mark it as missing."""

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "qwen/qwen-2-vl-72b-instruct",  # Vision model
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_base64
                                }
                            }
                        ]
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 1000
            }
            
            response = requests.post(
                self.base_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Extract the response content
            content = result['choices'][0]['message']['content']
            
            # Parse JSON from response
            import json
            # Try to extract JSON from the response
            if '{' in content and '}' in content:
                json_start = content.index('{')
                json_end = content.rindex('}') + 1
                json_str = content[json_start:json_end]
                analysis = json.loads(json_str)
                
                return {
                    "packed": analysis.get("packed", []),
                    "missing": analysis.get("missing", packing_list)
                }
            else:
                # Fallback if JSON parsing fails
                return {
                    "packed": [],
                    "missing": packing_list
                }
                
        except Exception as e:
            print(f"Error analyzing image: {str(e)}")
            # Return empty packed list on error
            return {
                "packed": [],
                "missing": packing_list
            }

