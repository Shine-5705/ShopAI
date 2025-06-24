from transcribe import transcribe_audio_assemblyai

filename = "responses/audio_inputs/hello.wav"
transcribed_text = transcribe_audio_assemblyai(filename)
print("✅ Transcription:", transcribed_text)