"""
disaster_assistant.py
AI Disaster Assistant (Stable + Optimized)
Uses:
- Wav2Vec2 (speech → text)
- spaCy NER (entity + location detection)
- FLAN-T5-LARGE (best model size for your PC)
"""

import json
import re
from transformers import pipeline
import spacy
import os

# ---------- CONFIG ----------
ASR_MODEL = "facebook/wav2vec2-base-960h"
SUGGEST_MODEL = "google/flan-t5-large"   # ✅ UPDATED (works on normal PC)
AUDIO_INPUT = "input_audio.mp3"          # fixed audio path

RESCUE_LOOKUP = {
    "default": {
        "fire": [{"name": "Fire Service", "phone": "101"}],
        "medical": [{"name": "Ambulance", "phone": "102"}],
        "police": [{"name": "Police", "phone": "100"}],
        "disaster": [{"name": "Disaster Helpline", "phone": "112"}],
    }
}

KEYWORD_MAP = {
    "fire": ["fire", "flames", "smoke", "burning"],
    "medical": ["injured", "unconscious", "bleeding", "not breathing"],
    "flood": ["flood", "water rising", "submerged"],
    "accident": ["accident", "crash", "collision"],
    "earthquake": ["earthquake", "tremor", "building collapsed"],
}

# ---------- LOAD MODELS ----------
print("Loading models...")
asr = pipeline("automatic-speech-recognition", model=ASR_MODEL)
t5 = pipeline("text2text-generation", model=SUGGEST_MODEL)
nlp = spacy.load("en_core_web_sm")
print("Models loaded.\n")

# ---------- ASR ----------
def transcribe():
    if not os.path.exists(AUDIO_INPUT):
        print(f"❌ Audio file missing: {AUDIO_INPUT}")
        return ""

    print(f"Transcribing {AUDIO_INPUT} ...")
    result = asr(AUDIO_INPUT)
    return result.get("text", "")

# ---------- INTENT + LOCATION ----------
def extract_intent_and_location(text):
    lowered = text.lower()
    doc = nlp(text)

    # location
    location = None
    for ent in doc.ents:
        if ent.label_ in ["GPE", "LOC", "FAC"]:
            location = ent.text
            break

    # intent
    intents = []
    for key, words in KEYWORD_MAP.items():
        if any(w in lowered for w in words):
            intents.append(key)

    if not intents:
        intents.append("general_emergency")

    return intents, location

# ---------- GENERATE AI RESPONSE ----------
def generate_suggestions(transcript, intents, location):
    emergency = intents[0]

    prompt = f"""
You are an AI disaster-response assistant. Produce a clear, helpful, structured emergency guide.

TRANSCRIPT: {transcript}
EMERGENCY TYPE: {emergency}
LOCATION: {location or "Unknown"}

Write in this exact format:

--- EMERGENCY ASSESSMENT ---
(Two sentences describing the situation + severity)

--- IMMEDIATE ACTIONS ---
1. Step 1
2. Step 2
3. Step 3
4. Step 4
5. Step 5
6. Step 6

--- WHAT NOT TO DO ---
- Mistake 1
- Mistake 2
- Mistake 3

--- CALL SCRIPT ---
(A one-sentence script for emergency services)

--- SAFETY CHECKLIST ---
- Bullet
- Bullet
- Bullet

--- EMERGENCY NUMBER ---
(Return only one number)
"""

    output = t5(prompt, max_new_tokens=200, do_sample=False)[0]["generated_text"]
    return output

# ---------- MAIN ----------
def run():
    transcript = transcribe()
    print("\nTRANSCRIPT:", transcript)

    intents, location = extract_intent_and_location(transcript)

    # phone number
    contacts = RESCUE_LOOKUP["default"].get(intents[0], [{"name": "Emergency", "phone": "112"}])
    phone = contacts[0]["phone"]

    suggestions = generate_suggestions(transcript, intents, location)

    result = {
        "transcript": transcript,
        "intent": intents[0],
        "location": location,
        "phone": phone,
        "ai_suggestions": suggestions,
    }

    print("\n\n===== AI DISASTER RESPONSE =====\n")
    print(suggestions)
    print("\nRecommended Number:", phone)

    print("\n\n===== JSON OUTPUT =====")
    print(json.dumps(result, indent=2))

# ---------- START ----------
if __name__ == "__main__":
    run()
