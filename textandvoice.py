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

# === Global for voice stop ===
speak_thread = None
speak_stop_flag = False

def record_audio():
    recognizer = sr.Recognizer()
    with sr.Microphone(sample_rate=16000) as source:
        print("🎤 Speak now...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(AUDIO_FOLDER, f"audio_{timestamp}.wav")
    wav_data = audio.get_wav_data()

    with open(filename, "wb") as f:
        f.write(wav_data)

    if os.path.getsize(filename) == 0:
        raise Exception("❌ Error: Audio file is empty!")

    return filename

def transcribe_audio_assemblyai(filename):
    headers = {'authorization': ASSEMBLYAI_API_KEY}
    with open(filename, 'rb') as f:
        upload_res = requests.post("https://api.assemblyai.com/v2/upload", headers=headers, files={"file": f})
    audio_url = upload_res.json().get("upload_url")
    if not audio_url:
        raise Exception("❌ Audio upload failed.")

    trans_res = requests.post("https://api.assemblyai.com/v2/transcript", headers=headers, json={"audio_url": audio_url})
    transcript_id = trans_res.json().get("id")

    while True:
        poll_res = requests.get(f"https://api.assemblyai.com/v2/transcript/{transcript_id}", headers=headers).json()
        if poll_res['status'] == 'completed':
            return poll_res['text']
        elif poll_res['status'] == 'error':
            raise Exception(f"❌ Transcription failed: {poll_res['error']}")
        time.sleep(2)

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

# === Voice output handling ===
def speak(text):
    def _speak():
        engine.say(text)
        engine.runAndWait()
    thread = threading.Thread(target=_speak)
    thread.start()
    return thread

def stop_speech():
    engine.stop()

# === Main Chat Loop ===
print("🤖 Groq Multimodal Chatbot (text/voice input, voice reply)")
print("Type or say 'exit' to quit.\n")

while True:
    try:
        mode = input("🌀 Input mode [voice/text]: ").strip().lower()

        if mode == "voice":
            audio_file = record_audio()
            user_input = transcribe_audio_assemblyai(audio_file)
        elif mode == "text":
            user_input = input("🧑 You: ").strip()
        else:
            print("❗ Invalid input. Use 'voice' or 'text'.")
            continue

        if user_input.lower() in ["exit", "quit"]:
            print("👋 Goodbye!")
            break

        print(f"🗣 You: {user_input}")
        save_user_input(user_input)

        history = load_history()
        messages = []

        # ✅ Short & crisp instruction
        messages.append({"role": "system", "content": "You are a helpful assistant. Always give short, crisp, and informative responses."})
        if history:
            messages.append({"role": "system", "content": f"Chat so far:\n{history.strip()}"})

        messages.append({"role": "user", "content": user_input})

        completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=messages
        )
        bot_response = completion.choices[0].message.content.strip()

        print(f"\n🤖 Groq: {bot_response}\n")

        # 🔊 Speak with option to stop
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
