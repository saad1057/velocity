# Django AI Microservice

This directory will contain the Django-based AI microservice for the Velocity recruitment platform.

## Planned Features

- **Resume Parsing**: Extract information from PDF/DOCX resumes
- **Candidate Matching**: AI-powered job-candidate matching
- **NLP Processing**: Text analysis for candidate screening
- **Skills Extraction**: Automatic skills detection from resumes
- **Interview Questions**: AI-generated interview questions based on job requirements

## Integration

This service will be called from the Express.js backend via HTTP API.

## Setup (Future)

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install django djangorestframework
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints (Planned)

- `POST /api/parse-resume` - Parse and extract data from resume
- `POST /api/match-candidates` - Match candidates to job
- `POST /api/extract-skills` - Extract skills from text
- `POST /api/generate-questions` - Generate interview questions
- `POST /api/analyze-sentiment` - Analyze candidate responses




