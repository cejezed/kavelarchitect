#!/usr/bin/env python3
"""Test Google Sheets webhook integratie"""
import yaml
import requests
import datetime

# Laad config
with open("config.yaml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)

webhook_cfg = config.get("sheets_webhook")

if not webhook_cfg:
    print("❌ Geen sheets_webhook configuratie gevonden in config.yaml")
    exit(1)

print("=" * 60)
print("Google Sheets Webhook Test")
print("=" * 60)
print(f"URL: {webhook_cfg['url']}")
print(f"Token: {webhook_cfg['token'][:20]}...")
print()

# Test payload (met alle vereiste velden)
test_payload = {
    "type": "kavel",
    "token": webhook_cfg["token"],
    "address": "Teststraat 123, Amsterdam",
    "place": "Amsterdam",
    "province": "Noord-Holland",
    "price": "€ 150.000",
    "surface": "500 m²",
    "url": "https://www.funda.nl/detail/koop/amsterdam/bouwgrond-teststraat-123/99999999",
    "date": datetime.datetime.now().strftime("%Y-%m-%d"),
    "status": "test",
}

print("Test payload:")
for key, value in test_payload.items():
    if key != "token":
        print(f"  {key}: {value}")
print()

try:
    print("Verzenden naar Google Sheets...")
    response = requests.post(
        webhook_cfg["url"],
        json=test_payload,
        timeout=15
    )

    print(f"Status code: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    print()

    # Probeer JSON te parsen
    try:
        data = response.json()
        print("Response JSON:")
        print(data)
        print()

        if isinstance(data, dict):
            if data.get("success"):
                print("✅ SUCCESS! Data is naar Google Sheets gestuurd")
                if data.get("duplicate"):
                    print("   (Opmerking: Dit was een duplicate)")
                if data.get("row"):
                    print(f"   Row nummer: {data.get('row')}")
            else:
                print("❌ FOUT: Webhook gaf success=false")
                if data.get("error"):
                    print(f"   Error: {data.get('error')}")
                if data.get("fields"):
                    print(f"   Missende velden: {data.get('fields')}")
        else:
            print(f"⚠️  Response is geen dict: {type(data)}")
    except Exception as e:
        print(f"⚠️  Kon response niet als JSON parsen: {e}")
        print(f"Raw response: {response.text[:500]}")

except requests.exceptions.Timeout:
    print("❌ TIMEOUT: Webhook duurde te lang (>15 sec)")
except requests.exceptions.ConnectionError as e:
    print(f"❌ CONNECTION ERROR: Kan webhook niet bereiken")
    print(f"   {e}")
except Exception as e:
    print(f"❌ FOUT: {e}")

print()
print("=" * 60)
