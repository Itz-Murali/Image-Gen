from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='../Frontend', static_url_path='')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

port = int(os.environ.get("PORT", 5000))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port)
