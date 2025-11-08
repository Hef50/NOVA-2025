import os
import requests
from typing import List, Dict

class VisionService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
    def analyze_suitcase_image(self, image_base64: str, packing_list: List[str]) -> Dict[str, any]:
        """
        Analyze a suitcase image and identify packed items
        
        Args:
            image_base64: Base64 encoded image string
            packing_list: List of items to check for
            
        Returns:
            Dictionary with 'packed', 'missing', and 'confidence' lists
        """
        
        # Create prompt for vision model
        items_text = "\n".join([f"- {item}" for item in packing_list])
        prompt = f"""You are an expert packing assistant analyzing a suitcase/luggage image to identify packed items.

PACKING LIST TO CHECK:
{items_text}

INSTRUCTIONS:
1. Carefully examine the image for each item on the list
2. Look for items that match the description (e.g., "T-Shirts (5)" means look for multiple t-shirts)
3. Consider similar items (e.g., sneakers for "Comfortable Shoes")
4. Be thorough but realistic - only mark items as packed if you can see them

Return your response in this EXACT JSON format:
{{
    "packed": [
        {{"item": "item name", "confidence": 0.95}}
    ],
    "missing": ["item1", "item2"]
}}

The confidence score should be 0.0 to 1.0 based on how certain you are the item is visible.
Only include items with confidence > 0.6 in the packed list.
Be conservative - if unsure, mark as missing."""

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
                
                # Extract packed items with confidence
                packed_items = analysis.get("packed", [])
                packed_names = []
                confidence_scores = {}
                
                for item in packed_items:
                    if isinstance(item, dict):
                        item_name = item.get("item", "")
                        confidence = item.get("confidence", 0.8)
                        packed_names.append(item_name)
                        confidence_scores[item_name] = confidence
                    else:
                        # Fallback for simple string format
                        packed_names.append(str(item))
                        confidence_scores[str(item)] = 0.8
                
                return {
                    "packed": packed_names,
                    "missing": analysis.get("missing", packing_list),
                    "confidence": confidence_scores
                }
            else:
                # Fallback if JSON parsing fails
                return {
                    "packed": [],
                    "missing": packing_list,
                    "confidence": {}
                }
                
        except Exception as e:
            print(f"Error analyzing image: {str(e)}")
            # Return empty packed list on error
            return {
                "packed": [],
                "missing": packing_list,
                "confidence": {}
            }

