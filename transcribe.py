import requests
import time
import os
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

# Upload audio file to AssemblyAI
def upload_to_assemblyai(filepath):
    headers = {'authorization': ASSEMBLYAI_API_KEY}
    with open(filepath, 'rb') as f:
        response = requests.post(
            'https://api.assemblyai.com/v2/upload',
            headers=headers,
            data=f.read()
        )
    response.raise_for_status()
    return response.json()['upload_url']

# Request transcription
def request_transcription(audio_url):
    endpoint = 'https://api.assemblyai.com/v2/transcript'
    json_data = {'audio_url': audio_url}
    headers = {
        'authorization': ASSEMBLYAI_API_KEY,
        'content-type': 'application/json'
    }
    response = requests.post(endpoint, json=json_data, headers=headers)
    response.raise_for_status()
    return response.json()['id']

# Poll until transcription completes
def poll_transcription(transcript_id):
    endpoint = f'https://api.assemblyai.com/v2/transcript/{transcript_id}'
    headers = {'authorization': ASSEMBLYAI_API_KEY}
    while True:
        response = requests.get(endpoint, headers=headers)
        response.raise_for_status()
        status = response.json()['status']
        if status == 'completed':
            return response.json()['text']
        elif status == 'error':
            raise Exception("Transcription failed:", response.json()['error'])
        time.sleep(2)

# Wrapper function to use in your chatbot
def transcribe_audio_assemblyai(filename):
    print("🔼 Uploading to AssemblyAI...")
    audio_url = upload_to_assemblyai(filename)
    print("📄 Requesting transcription...")
    transcript_id = request_transcription(audio_url)
    print("⏳ Waiting for transcription result...")
    text = poll_transcription(transcript_id)
    return text
