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
from urllib.parse import urlparse

# === Load API keys ===
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not ASSEMBLYAI_API_KEY or not GROQ_API_KEY:
    raise ValueError("❌ Missing API keys in .env!")

# === Init clients ===
groq_client = Groq(api_key=GROQ_API_KEY)
engine = pyttsx3.init()
speech_lock = threading.Lock()  # ✅ Added lock for thread-safe speech

# === Paths ===
HISTORY_FILE = "chat_history.txt"
RESPONSES_FOLDER = "responses"
AUDIO_FOLDER = os.path.join(RESPONSES_FOLDER, "audio_inputs")
USER_INPUT_LOG = os.path.join(RESPONSES_FOLDER, "real_time_audio_input.txt")
os.makedirs(AUDIO_FOLDER, exist_ok=True)

# === Voice output ===
def speak(text):
    def _speak():
        with speech_lock:  # ✅ Ensures one speech thread at a time
            engine.say(text)
            engine.runAndWait()
    thread = threading.Thread(target=_speak)
    thread.start()
    return thread

def stop_speech():
    with speech_lock:
        engine.stop()

# === Transcription via AssemblyAI ===
def transcribe_audio_file(filepath):
    if not os.path.exists(filepath):
        raise Exception("❌ File does not exist.")

    headers = {'authorization': ASSEMBLYAI_API_KEY}
    with open(filepath, 'rb') as f:
        response = requests.post("https://api.assemblyai.com/v2/upload", headers=headers, data=f.read())
    response.raise_for_status()
    audio_url = response.json()['upload_url']

    res = requests.post(
        "https://api.assemblyai.com/v2/transcript",
        headers={'authorization': ASSEMBLYAI_API_KEY, 'content-type': 'application/json'},
        json={'audio_url': audio_url}
    )
    transcript_id = res.json()['id']

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

# === Mic recording ===
def record_and_transcribe():
    recognizer = sr.Recognizer()
    mic = sr.Microphone(sample_rate=16000)

    with mic as source:
        print("🎤 Adjusting for ambient noise...")
        recognizer.adjust_for_ambient_noise(source, duration=1)

        print("🎤 Listening... (start speaking within 30s, max phrase 60s)")
        try:
            audio = recognizer.listen(source, timeout=30, phrase_time_limit=60)
            print("✅ Voice input received. Processing...")
        except sr.WaitTimeoutError:
            raise Exception("⏰ Timeout: No speech detected within 30 seconds.")

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(AUDIO_FOLDER, f"audio_{timestamp}.wav")
    with open(filename, "wb") as f:
        f.write(audio.get_wav_data())

    if os.path.getsize(filename) == 0:
        raise Exception("❌ Error: Recorded audio is empty!")

    return transcribe_audio_file(filename)

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

# === Image helpers ===
TEMP_IMAGE_FILE = "temp_image.jpg"

def download_image(url):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(TEMP_IMAGE_FILE, "wb") as f:
                f.write(response.content)
            return TEMP_IMAGE_FILE
        else:
            print("❌ Failed to download image.")
            return None
    except Exception as e:
        print(f"❌ Error downloading image: {e}")
        return None

def is_url(path):
    try:
        result = urlparse(path)
        return all([result.scheme, result.netloc])
    except:
        return False

# === Main Chat Loop ===
print("Groq Multimodal Chatbot (text / voice / upload / image input, voice reply)")
print("Type or say 'exit' to quit.\n")

image_context = None

while True:
    try:
        mode = input("Input mode [voice/text/upload/image]: ").strip().lower()

        if mode == "voice":
            user_input = record_and_transcribe()

        elif mode == "text":
            user_input = input("You: ").strip()
            if user_input:
                print("✅ Text input received. Processing...")

        elif mode == "upload":
            filepath = input("Enter path to your audio file (WAV/MP3): ").strip()
            if filepath:
                print("✅ File path received. Processing audio file...")
            user_input = transcribe_audio_file(filepath)

        elif mode == "image":
            image_input = input("Enter image file path or URL: ").strip()
            if image_input:
                print("✅ Image input received. Processing image...")

            if is_url(image_input):
                image_path = download_image(image_input)
                if not image_path:
                    print("❌ Could not download image.")
                    continue
            elif os.path.exists(image_input):
                image_path = image_input
            else:
                print("❌ Invalid image path or URL.")
                continue

            print("✅ Image loaded.")
            caption = input("Enter your own description of the image: ").strip()
            if not caption:
                print("❗ Caption cannot be empty.")
                continue
            else:
                print("✅ Image description received.")

            image_context = f"Image Description: {caption}"
            print("You can now ask questions about this image in 'text' mode.")
            continue

        elif mode in ["exit", "quit"]:
            print("Goodbye!")
            break

        else:
            print("❓ Invalid input. Use 'voice', 'text', 'upload', or 'image'.")
            continue

        if user_input.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break

        if image_context:
            prompt = f"{image_context}\nQuestion: {user_input}"
            messages = [
                {"role": "system", "content": "You're a helpful assistant answering questions about images based on user-provided descriptions."},
                {"role": "user", "content": prompt}
            ]
        else:
            messages = [
                {"role": "system", "content": "You are a helpful assistant. Always give short, crisp, and informative responses."},
                {"role": "user", "content": user_input}
            ]

        completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=messages
        )
        bot_response = completion.choices[0].message.content.strip()

        print(f"\nGroq: {bot_response}\n")

        stop_speech()  # ✅ Make sure last one is stopped before starting new
        thread = speak(bot_response)
        print("Press 's' to stop voice output early...")

        while thread.is_alive():
            if keyboard.is_pressed("s"):
                stop_speech()
                print("Voice output stopped.")
                break
            time.sleep(0.1)

        save_user_input(user_input)
        save_to_history(user_input, bot_response)

        if image_context and mode != "image":
            pass
        elif mode == "image" and image_path == TEMP_IMAGE_FILE and os.path.exists(TEMP_IMAGE_FILE):
            os.remove(TEMP_IMAGE_FILE)

    except Exception as e:
        print(f"❌ Error: {e}")
