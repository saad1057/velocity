# AI Microservice (Python)

This folder hosts a lightweight Flask microservice that exposes resume parsing via **pyresparser**. The Node backend calls this service over HTTP.

## Quick start
```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Download spaCy and NLTK data (once)
python -m spacy download en_core_web_sm
python - <<'PY'
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
PY

# Run the service
python app.py   # listens on http://0.0.0.0:8001/parse
```

## API
- `POST /parse`
  - Body (JSON):
    ```json
    {
      "documentBase64": "<base64-of-pdf-or-docx>",
      "fileName": "resume.pdf"
    }
    ```
  - Response: `{ success: true, data: <parsed fields> }`

## Notes
- Supports PDF/DOCX.
- Keep files reasonably small (~5MB).
- This can later be replaced or extended with Django/DRF if you need more endpoints.