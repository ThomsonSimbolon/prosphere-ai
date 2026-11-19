import json
import urllib.request
import urllib.error

API_KEY = "AQ.Ab8RN6K1Ni49Qq8rltq1shtwiIzfn897m7Iw6ZEwpVU2A33zXg"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        for m in data.get('models', []):
            if 'generateContent' in m.get('supportedGenerationMethods', []):
                print(m.get('name'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.reason)
    print(e.read().decode('utf-8'))
