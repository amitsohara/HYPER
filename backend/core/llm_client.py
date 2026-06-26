import os
import json
from google import genai

client = genai.Client(api_key="-AQ.Ab8RN6I4_e1DI4H-Xh5GXmZxEC-77Mg9Wvt3tYXmK_mejkxT4A")

def generate_json(prompt: str) -> dict:
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"LLM Error: {e}")
        return {}
