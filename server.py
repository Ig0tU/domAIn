from flask import Flask, request, jsonify
from flask_cors import CORS

# A very simple summarization function (for demonstration)
def simple_summarize(text, max_sentences=3):
    """
    Extracts the first N sentences from a text block.
    In a real application, this would be replaced with a proper ML/LLM library.
    """
    # Naive sentence splitting
    sentences = text.replace('!', '.').replace('?', '.').split('.')
    # Filter out empty strings that may result from splitting
    sentences = [s.strip() for s in sentences if s.strip()]

    summary = ". ".join(sentences[:max_sentences])
    if len(sentences) > max_sentences:
        summary += "."
    return summary

# Initialize Flask app
app = Flask(__name__)
# Enable CORS to allow requests from the userscript running on any website
CORS(app)

@app.route('/api/summarize', methods=['POST'])
def summarize_endpoint():
    """
    API endpoint to receive text and return a summary.
    Expects a JSON payload with a "text" key.
    e.g., curl -X POST -H "Content-Type: application/json" -d '{"text": "Long text..."}' http://127.0.0.1:5000/api/summarize
    """
    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Missing "text" key in request body'}), 400

    text_to_summarize = request.json['text']
    if not isinstance(text_to_summarize, str) or not text_to_summarize:
        return jsonify({'error': 'Invalid "text" provided'}), 400

    summary = simple_summarize(text_to_summarize)

    return jsonify({
        'original_length': len(text_to_summarize),
        'summary': summary
    })

@app.route('/')
def index():
    """A simple index route to confirm the server is running."""
    return "Chameleon AI-Forge Backend is running!"

if __name__ == '__main__':
    # To run this server:
    # 1. Install Flask and Flask-CORS: pip install Flask Flask-CORS
    # 2. Save this code as server.py
    # 3. Run the script from your terminal: python server.py
    # The server will be available at http://127.0.0.1:5000
    app.run(debug=True, port=5000)
