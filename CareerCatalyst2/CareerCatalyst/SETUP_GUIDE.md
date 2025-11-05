# Enhanced ATS Resume Analyzer Setup Guide

## Overview
Your ATS Resume Analyzer has been upgraded with advanced AI capabilities powered by Google's Gemini API. The system now supports two analysis modes:

1. **Quick ATS Check** - Instant resume compatibility analysis without job description
2. **Job Match Analysis** - Detailed comparison against specific job requirements

## New Features
- ✅ AI-powered analysis using Google Gemini
- ✅ Two analysis modes (with/without job description)
- ✅ File upload for job descriptions (PDF, DOCX, TXT)
- ✅ Comprehensive section detection
- ✅ Enhanced formatting issue detection
- ✅ Detailed markdown reports
- ✅ Improved scoring algorithm
- ✅ Smart keyword analysis
- ✅ Actionable improvement suggestions

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Install spaCy English model (required for text processing)
python -m spacy download en_core_web_sm

# Create environment file
cp .env.example .env
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a free API key
3. Add it to your `.env` file:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```

### 3. Start the Backend

```bash
# Using FastAPI (recommended)
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Or using Flask (if you prefer)
python app.py
```

### 4. Frontend Setup

The frontend has been updated to support the new features. No additional setup required if you already have the React environment running.

```bash
cd ..  # Go back to root
npm start
```

## API Endpoints

### New Endpoints:
- `POST /analyze-resume-file` - Enhanced file analysis with optional job description
- `POST /analyze-resume-quick` - Quick analysis without job description
- `POST /analyze-resume` - Text-based analysis

### Request Formats:

#### Quick Analysis
```javascript
const formData = new FormData();
formData.append('resume_file', file);

fetch('http://localhost:8000/analyze-resume-quick', {
  method: 'POST',
  body: formData
});
```

#### Job Match Analysis
```javascript
const formData = new FormData();
formData.append('resume_file', resumeFile);

// Option 1: Text job description
formData.append('job_description_text', jobDescriptionText);

// Option 2: File job description
formData.append('job_description_file', jobDescriptionFile);

fetch('http://localhost:8000/analyze-resume-file', {
  method: 'POST',
  body: formData
});
```

## Response Format

The API now returns comprehensive analysis results:

```json
{
  "totalScore": 85,
  "scoreCategory": "Excellent",
  "scoreEmoji": "🟢",
  "hasJobDescription": true,
  "detectedSections": {
    "present": ["Contact Info", "Skills", "Work Experience"],
    "missing": ["Certifications", "Projects"]
  },
  "formattingIssues": [
    "Missing phone number",
    "Inconsistent date formats"
  ],
  "skillsAnalysis": {
    "matchedKeywords": ["python", "machine learning", "sql"],
    "missingKeywords": ["docker", "aws", "kubernetes"],
    "keywordMatchPercentage": 75
  },
  "suggestions": [
    "Add Docker and containerization experience",
    "Include more quantified achievements",
    "Strengthen technical skills section"
  ],
  "markdownReport": "# 🎯 ATS Resume Analysis Report\n\n## 🟢 ATS Compatibility Score: **85/100**\n..."
}
```

## Troubleshooting

### Common Issues:

1. **Gemini API Error**: Make sure your API key is valid and set in the `.env` file
2. **spaCy Model Missing**: Run `python -m spacy download en_core_web_sm`
3. **CORS Issues**: Ensure the backend is running on port 8000
4. **File Upload Issues**: Check file types are supported (PDF, DOCX, TXT)

### Error Messages:
- "Could not reach backend" → Backend not running or wrong port
- "Unsupported file type" → Use PDF, DOCX, or TXT files only
- "Gemini API error" → Check API key in .env file

## Testing the System

1. Start the backend server
2. Navigate to the ATS Resume page
3. Choose analysis mode (Quick or Job Match)
4. Upload a resume file
5. For Job Match mode, add job description (text or file)
6. Click analyze and review the results

The system should now provide much more detailed and actionable feedback!

## Development Notes

- The system uses Google's Gemini 1.5 Flash model for fast, accurate analysis
- Scoring algorithm combines AI insights with traditional ATS checks
- The frontend automatically adapts based on the selected analysis mode
- All file processing is done securely on the backend
