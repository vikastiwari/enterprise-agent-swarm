import os
import requests

api_key = None
with open(".env", "r") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.strip().split("=")[1].strip('"')

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
next_token = ""
found = []
while True:
    req_url = url + (f"&pageToken={next_token}" if next_token else "")
    response = requests.get(req_url).json()
    for m in response.get("models", []):
        if "lite" in m["name"].lower():
            found.append(m["name"])
    next_token = response.get("nextPageToken")
    if not next_token:
        break

print("Gemini 1.5 Models:")
for m in found:
    print(m)
