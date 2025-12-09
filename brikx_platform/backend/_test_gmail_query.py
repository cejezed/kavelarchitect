#!/usr/bin/env python3
"""Test Gmail query om te zien welke berichten er zijn"""
import sys
from brikx.gmail_client import GmailClient

gm = GmailClient("secrets/credentials.json", "secrets/token.json")

print("=" * 60)
print("Test 1: Alle berichten van Funda (laatste 30 dagen)")
print("=" * 60)
msgs = gm.search_messages('from:notificaties@service.funda.nl newer_than:30d', max_results=20)
print(f"Gevonden: {len(msgs)} berichten\n")

if msgs:
    for i, msg in enumerate(msgs[:5], 1):
        headers = msg.get("payload", {}).get("headers", [])
        subject = next((h["value"] for h in headers if h["name"] == "Subject"), "Geen onderwerp")
        date = next((h["value"] for h in headers if h["name"] == "Date"), "Geen datum")
        print(f"{i}. Subject: {subject}")
        print(f"   Datum: {date}\n")

print("\n" + "=" * 60)
print("Test 2: Alleen met 'zoekopdracht' in subject (7 dagen)")
print("=" * 60)
msgs2 = gm.search_messages('from:notificaties@service.funda.nl subject:"zoekopdracht" newer_than:7d', max_results=20)
print(f"Gevonden: {len(msgs2)} berichten\n")

if msgs2:
    for i, msg in enumerate(msgs2[:5], 1):
        headers = msg.get("payload", {}).get("headers", [])
        subject = next((h["value"] for h in headers if h["name"] == "Subject"), "Geen onderwerp")
        date = next((h["value"] for h in headers if h["name"] == "Date"), "Geen datum")
        print(f"{i}. Subject: {subject}")
        print(f"   Datum: {date}\n")

print("\n" + "=" * 60)
print("Test 3: Probeer zonder subject filter (7 dagen)")
print("=" * 60)
msgs3 = gm.search_messages('from:notificaties@service.funda.nl newer_than:7d', max_results=20)
print(f"Gevonden: {len(msgs3)} berichten\n")

if msgs3:
    for i, msg in enumerate(msgs3[:5], 1):
        headers = msg.get("payload", {}).get("headers", [])
        subject = next((h["value"] for h in headers if h["name"] == "Subject"), "Geen onderwerp")
        date = next((h["value"] for h in headers if h["name"] == "Date"), "Geen datum")
        print(f"{i}. Subject: {subject}")
        print(f"   Datum: {date}\n")
