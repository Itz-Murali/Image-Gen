from flask import Flask, send_from_directory, request, send_file, jsonify
from flask_cors import CORS
import os
import requests
from PIL import Image
from io import BytesIO
import random
import string

app = Flask(__name__, static_folder='../Frontend', static_url_path='')
CORS(app)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/download-image', methods=['POST'])
def download_image():
    data = request.get_json()
    image_url = data.get('imageUrl')

    if not image_url:
        return jsonify({'error': 'Image URL missing'}), 400

    try:
        response = requests.get(image_url, stream=True)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch image'}), 500

        img = Image.open(BytesIO(response.content)).convert("RGBA")
        filename = f"Chiku-Ai-{''.join(random.choices(string.ascii_lowercase, k=6))}.png"
        filepath = os.path.join("temp", filename)

        os.makedirs("temp", exist_ok=True)
        img.save(filepath, format="PNG")

        return send_file(filepath, mimetype='image/png', as_attachment=True)

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': 'Something went wrong'}), 500

port = int(os.environ.get("PORT", 5000))
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port)
