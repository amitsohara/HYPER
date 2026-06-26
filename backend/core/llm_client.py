import os
import json
from google import genai

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", "dummy"))

def generate_json(prompt: str) -> dict:
    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"LLM Error: {e}")
        return {}
