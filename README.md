
# Resume Match Flask Application

This is a Flask application that helps users match their resumes against job descriptions using AI analysis.

## Features

- Upload multiple PDF resumes
- Enter job description text
- Get AI-powered analysis comparing resumes to the job description
- See match percentage, strengths, areas for improvement, and keyword matches
- View detailed feedback for each resume

## Setup Instructions

1. Clone the repository:
```
git clone <repository-url>
cd resume-match-flask
```

2. Create a virtual environment and activate it:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the dependencies:
```
pip install -r requirements.txt
```

4. Run the application:
```
python app.py
```

5. Open your web browser and navigate to:
```
http://127.0.0.1:5000/
```

## Integrating with Google Gemini API

This application includes a mock implementation of resume analysis. To integrate with the actual Google Gemini API:

1. Sign up for Google Gemini API access: https://ai.google.dev/
2. Get your API key
3. Modify the `analyze_with_gemini` function in `app.py` to use the Gemini API client

## Project Structure

- `app.py`: Main Flask application file
- `templates/index.html`: HTML template for the web interface
- `uploads/`: Folder where uploaded PDFs are stored

## Technologies Used

- Flask: Python web framework
- Alpine.js: JavaScript framework for frontend interactivity
- Tailwind CSS: Utility-first CSS framework for styling
- Google Gemini API: AI for resume analysis (mock implementation)
