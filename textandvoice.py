import os
import time
import pyttsx3
import datetime
import requests
import threading
import keyboard
import speech_recognition as sr
from dotenv import load_dotenv
from groq import Groq
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

# === Load API keys ===
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not ASSEMBLYAI_API_KEY or not GROQ_API_KEY:
    raise ValueError("❌ Missing API keys in .env!")

# === Init clients ===
groq_client = Groq(api_key=GROQ_API_KEY)
engine = pyttsx3.init()

# === Paths ===
HISTORY_FILE = "chat_history.txt"
RESPONSES_FOLDER = "responses"
AUDIO_FOLDER = os.path.join(RESPONSES_FOLDER, "audio_inputs")
USER_INPUT_LOG = os.path.join(RESPONSES_FOLDER, "real_time_audio_input.txt")
os.makedirs(AUDIO_FOLDER, exist_ok=True)

# === Voice output thread control ===
def speak(text):
    def _speak():
        engine.say(text)
        engine.runAndWait()
    thread = threading.Thread(target=_speak)
    thread.start()
    return thread

def stop_speech():
    engine.stop()

# === Transcribe audio via AssemblyAI ===
def transcribe_audio_file(filepath):
    if not os.path.exists(filepath):
        raise Exception("❌ File does not exist.")

    print("🔼 Uploading to AssemblyAI...")
    headers = {'authorization': ASSEMBLYAI_API_KEY}
    with open(filepath, 'rb') as f:
        response = requests.post("https://api.assemblyai.com/v2/upload", headers=headers, data=f.read())
    response.raise_for_status()
    audio_url = response.json()['upload_url']

    print("📄 Requesting transcription...")
    trans_res = requests.post(
        "https://api.assemblyai.com/v2/transcript",
        headers={'authorization': ASSEMBLYAI_API_KEY, 'content-type': 'application/json'},
        json={'audio_url': audio_url}
    )
    transcript_id = trans_res.json()['id']

    print("⏳ Waiting for transcription result...")
    for _ in range(30):
        poll_res = requests.get(f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                                headers={'authorization': ASSEMBLYAI_API_KEY})
        poll_res.raise_for_status()
        result = poll_res.json()
        if result['status'] == 'completed':
            return result['text']
        elif result['status'] == 'error':
            raise Exception(f"❌ Transcription failed: {result['error']}")
        time.sleep(2)

    raise Exception("❌ Transcription timed out.")

# === Record from microphone and transcribe ===
def record_and_transcribe():
    recognizer = sr.Recognizer()
    mic = sr.Microphone(sample_rate=16000)

    with mic as source:
        print("🎤 Adjusting for ambient noise...")
        recognizer.adjust_for_ambient_noise(source, duration=1)

        print("🎙️ Listening... (start speaking within 10s)")
        try:
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=15)
        except sr.WaitTimeoutError:
            raise Exception("⏰ Timeout: No speech detected within 10 seconds.")

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(AUDIO_FOLDER, f"audio_{timestamp}.wav")
    with open(filename, "wb") as f:
        f.write(audio.get_wav_data())

    if os.path.getsize(filename) == 0:
        raise Exception("❌ Error: Recorded audio is empty!")

    return transcribe_audio_file(filename)

# === Image captioning ===
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def caption_image(image_path):
    if not os.path.exists(image_path):
        raise Exception("❌ Image file not found.")

    image = Image.open(image_path).convert("RGB")
    inputs = blip_processor(image, return_tensors="pt")
    out = blip_model.generate(**inputs, max_new_tokens=50)
    caption = blip_processor.decode(out[0], skip_special_tokens=True)
    return caption

# === Logging ===
def save_user_input(text):
    with open(USER_INPUT_LOG, "a", encoding="utf-8") as f:
        f.write(text + "\n")

def save_to_history(user_input, bot_response):
    with open(HISTORY_FILE, "a", encoding="utf-8") as f:
        f.write(f"User: {user_input}\nGrok: {bot_response}\n\n")

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return f.read()
    return ""

# === Main Chat Loop ===
print("🤖 Groq Multimodal Chatbot (text / voice / upload / image input, voice reply)")
print("Type or say 'exit' to quit.\n")

while True:
    try:
        mode = input("🌀 Input mode [voice/text/upload/image]: ").strip().lower()

        if mode == "voice":
            user_input = record_and_transcribe()
        elif mode == "text":
            user_input = input("🧑 You: ").strip()
        elif mode == "upload":
            filepath = input("📁 Enter path to your audio file (WAV/MP3): ").strip()
            user_input = transcribe_audio_file(filepath)
        elif mode == "image":
            image_path = input("🖼️ Enter image file path: ").strip()
            user_input = caption_image(image_path)
            print(f"📝 Image Caption: {user_input}")
        else:
            print("❗ Invalid input. Use 'voice', 'text', 'upload', or 'image'.")
            continue

        if user_input.lower() in ["exit", "quit"]:
            print("👋 Goodbye!")
            break

        print(f"🗣 You: {user_input}")
        save_user_input(user_input)

        # === Ask Groq for response
        messages = [
            {"role": "system", "content": "You are a helpful assistant. Always give short, crisp, and informative responses."},
            {"role": "user", "content": user_input}
        ]

        completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=messages
        )
        bot_response = completion.choices[0].message.content.strip()

        print(f"\n🤖 Groq: {bot_response}\n")

        # === Speak response with interrupt
        thread = speak(bot_response)
        print("🔊 Press 's' to stop voice output early...")
        while thread.is_alive():
            if keyboard.is_pressed("s"):
                stop_speech()
                print("⏹️ Voice output stopped.")
                break
            time.sleep(0.1)

        save_to_history(user_input, bot_response)

    except Exception as e:
        print(f"❌ Error: {e}")
