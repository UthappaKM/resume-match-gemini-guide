
from flask import Flask, render_template, request, jsonify, session
import os
import uuid
import json
from werkzeug.utils import secure_filename
import time

app = Flask(__name__)
app.secret_key = "resume-match-secret-key"  # For session management
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max upload size

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Store resume data in memory for simplicity (in a real app, use a database)
resumes = {}

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/upload-resume', methods=['POST'])
def upload_resume():
    """Handle resume file upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('file')
    
    if not files or files[0].filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    uploaded_resumes = []
    
    for file in files:
        if file and file.filename.endswith('.pdf'):
            filename = secure_filename(file.filename)
            resume_id = str(uuid.uuid4())
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{resume_id}_{filename}")
            
            file.save(file_path)
            
            # In a real app, extract text from PDF here
            # For now, we'll mock the text extraction
            resume_text = f"Sample extracted text from {filename}. This would be the actual content of the resume in a real implementation."
            
            resume_data = {
                'id': resume_id,
                'fileName': filename,
                'text': resume_text,
                'filePath': file_path
            }
            
            resumes[resume_id] = resume_data
            uploaded_resumes.append({
                'id': resume_id,
                'fileName': filename
            })
        else:
            return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    return jsonify({'success': True, 'resumes': uploaded_resumes})

@app.route('/delete-resume/<resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    """Delete a resume"""
    if resume_id in resumes:
        # Delete the file
        try:
            os.remove(resumes[resume_id]['filePath'])
        except:
            pass  # Ignore file deletion errors
        
        # Remove from our data store
        del resumes[resume_id]
        return jsonify({'success': True})
    
    return jsonify({'error': 'Resume not found'}), 404

@app.route('/analyze-resumes', methods=['POST'])
def analyze_resumes():
    """Analyze resumes against a job description"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    job_description = data.get('jobDescription')
    resume_ids = data.get('resumeIds', [])
    
    if not job_description:
        return jsonify({'error': 'No job description provided'}), 400
    
    if not resume_ids:
        return jsonify({'error': 'No resumes selected for analysis'}), 400
    
    results = []
    
    for resume_id in resume_ids:
        if resume_id not in resumes:
            continue
        
        resume = resumes[resume_id]
        
        # Mock the resume analysis
        # In a real app, integrate with Gemini API here
        time.sleep(1)  # Simulate processing time
        
        # Generate a random match percentage between 60-90%
        import random
        match_percentage = random.randint(60, 90)
        
        result = {
            'resumeId': resume_id,
            'fileName': resume['fileName'],
            'matchPercentage': match_percentage,
            'strengths': [
                "Strong technical background in required skills",
                "Relevant experience in similar roles",
                "Good educational qualifications"
            ],
            'improvements': [
                "Add more quantifiable achievements",
                "Highlight experience with specific tools mentioned in the job",
                "Tailor your resume summary to match the job description better"
            ],
            'keywordMatches': {
                'matched': ["project management", "communication", "teamwork"],
                'missing': ["agile methodology", "specific tool experience", "industry certification"]
            },
            'detailedFeedback': "Your resume shows strong foundational skills, but could be better tailored to this specific position. Consider highlighting your experience with relevant tools and methodologies mentioned in the job description. Quantifying your achievements would make your experience more compelling. Adding industry-specific keywords would improve your visibility in automated screening systems."
        }
        
        results.append(result)
    
    return jsonify({'success': True, 'results': results})

# Function for integrating with Google Gemini API (mock implementation)
def analyze_with_gemini(resume_text, job_description):
    """
    In a real implementation, this function would call the Google Gemini API
    to analyze the resume against the job description.
    """
    # Mock implementation
    import random
    
    match_percentage = random.randint(60, 90)
    
    return {
        'matchPercentage': match_percentage,
        'strengths': [
            "Strong technical background in required skills",
            "Relevant experience in similar roles", 
            "Good educational qualifications"
        ],
        'improvements': [
            "Add more quantifiable achievements",
            "Highlight experience with specific tools mentioned in the job",
            "Tailor your resume summary to match the job description better"
        ],
        'keywordMatches': {
            'matched': ["project management", "communication", "teamwork"],
            'missing': ["agile methodology", "specific tool experience", "industry certification"]
        },
        'detailedFeedback': "Your resume shows strong foundational skills, but could be better tailored to this specific position. Consider highlighting your experience with relevant tools and methodologies mentioned in the job description. Quantifying your achievements would make your experience more compelling. Adding industry-specific keywords would improve your visibility in automated screening systems."
    }

if __name__ == '__main__':
    app.run(debug=True)
