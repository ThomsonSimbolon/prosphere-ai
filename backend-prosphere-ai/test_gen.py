import json
import urllib.request
import urllib.error

API_KEY = "AQ.Ab8RN6K1Ni49Qq8rltq1shtwiIzfn897m7Iw6ZEwpVU2A33zXg"
model = "gemini-3.5-flash-lite"
url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"

payload = {
    "contents": [
        {
            "parts": [
                {"text": "Halo! Jelaskan secara singkat dalam 1 kalimat apa keunggulan ProSphere AI."}
            ]
        }
    ]
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        text = res['candidates'][0]['content']['parts'][0]['text']
        print("RESULT:")
        print(text)
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.reason)
    print(e.read().decode('utf-8'))
