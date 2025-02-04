from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text')
    source_lang = data.get('source_lang', '').replace('🌐 ', '')  # Remove globe icon if present
    target_lang = data.get('target_lang', '').replace('🌐 ', '')  # Remove globe icon if present
    
    try:
        # First, detect the language if not specified
        if not source_lang or source_lang == "Auto":
            detect_prompt = f"Detect the language of this text and respond with ONLY the language name: {text}"
            detect_response = model.generate_content(detect_prompt)
            source_lang = detect_response.text.strip()
        
        # Then translate
        translate_prompt = f"Translate the following text from {source_lang} to {target_lang}. Only provide the translation, no additional text: {text}"
        translate_response = model.generate_content(translate_prompt)
        translated_text = translate_response.text.strip()
        
        return jsonify({
            'translation': translated_text,
            'detected_language': source_lang if not data.get('source_lang') else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 