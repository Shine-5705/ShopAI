from dotenv import load_dotenv
import os
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Read API key from env
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY is not set in your environment or .env file!")

# Initialize Groq client
client = Groq(api_key=api_key)

# Path to history file
history_file = "chat_history.txt"

# Load previous chat history
def load_history():
    if os.path.exists(history_file):
        with open(history_file, "r", encoding="utf-8") as f:
            return f.read()
    return ""

# Save new Q&A to history
def save_to_history(user_input, bot_response):
    with open(history_file, "a", encoding="utf-8") as f:
        f.write(f"User: {user_input}\n")
        f.write(f"Grok: {bot_response}\n\n")

# Chat loop
print("🤖 Ask me anything! (type 'exit' or 'quit' to end the chat)\n")
while True:
    raw_input_text = input("You: ")
    user_input = raw_input_text.strip().lower()

    if user_input in ["exit", "quit"]:
        print("Goodbye! 👋")
        break

    # Load context from history
    context = load_history()

    # Build message history
    messages = []
    if context:
        messages.append({
            "role": "system",
            "content": f"Here's a summary of the past conversation:\n{context.strip()}"
        })

    # Use original casing of user input in message
    messages.append({"role": "user", "content": raw_input_text.strip()})

    # Call Groq API
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama3-70b-8192",
    )

    bot_response = chat_completion.choices[0].message.content
    print(f"Grok: {bot_response}\n")

    # Save to chat history
    save_to_history(raw_input_text.strip(), bot_response)
