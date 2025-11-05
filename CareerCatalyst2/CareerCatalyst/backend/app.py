from fastapi import FastAPI, UploadFile, Form, HTTPException, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ats_analyzer import analyzeResume
import pdfplumber
from typing import Optional
import io
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

# Try to import docx, handle if not available
try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False
    print("Warning: python-docx not installed. DOCX support disabled.")

# Load environment variables
load_dotenv()

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found. AI assistant will use fallback responses.")

# Create FastAPI app
app = FastAPI(title="CareerCatalyst API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "CareerCatalyst FastAPI is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

class ResumeRequest(BaseModel):
    resume: str
    jobDescription: Optional[str] = None

def extract_text_from_file(file: UploadFile) -> str:
    """Extract text from uploaded PDF or DOCX file"""
    filename = file.filename.lower()
    
    # Read file content into memory
    file_content = file.file.read()
    file.file.seek(0)  # Reset file pointer
    
    if filename.endswith('.pdf'):
        try:
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                text = "\n".join(page.extract_text() or "" for page in pdf.pages)
                return text.strip()
        except Exception as e:
            raise ValueError(f"Error processing PDF file: {str(e)}")
            
    elif filename.endswith('.docx'):
        if not DOCX_AVAILABLE:
            raise ValueError("DOCX support not available. Please install python-docx: pip install python-docx")
        try:
            doc = Document(io.BytesIO(file_content))
            text = "\n".join([para.text for para in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error processing DOCX file: {str(e)}")
            
    elif filename.endswith('.txt'):
        try:
            text = file_content.decode('utf-8')
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error processing TXT file: {str(e)}")
    else:
        raise ValueError("Unsupported file type. Only PDF, DOCX, and TXT files are supported.")

@app.post("/analyze-resume")
def analyze_resume(req: ResumeRequest):
    """Analyze resume text with optional job description"""
    result = analyzeResume(req.resume, req.jobDescription)
    return result

@app.post("/analyze-resume-file")
async def analyze_resume_file(
    resume_file: UploadFile = File(...),
    job_description_text: Optional[str] = Form(None),
    job_description_file: Optional[UploadFile] = File(None)
):
    """
    Analyze resume file with optional job description (text or file)
    Supports both modes: with and without job description
    """
    try:
        # Extract resume text
        resume_text = extract_text_from_file(resume_file)
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from resume file")
        
        # Handle job description
        job_description = None
        
        if job_description_file:
            # Extract text from job description file
            try:
                job_description = extract_text_from_file(job_description_file)
            except Exception as e:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Could not extract text from job description file: {str(e)}"
                )
        elif job_description_text and job_description_text.strip():
            # Use provided text
            job_description = job_description_text.strip()
        
        # Analyze resume
        result = analyzeResume(resume_text, job_description)
        return JSONResponse(content=result)
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze-resume-quick")
async def analyze_resume_quick(
    resume_file: UploadFile = File(...)
):
    """
    Quick resume analysis without job description
    For general ATS compatibility check
    """
    try:
        resume_text = extract_text_from_file(resume_file)
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from resume file")
        
        # Analyze without job description
        result = analyzeResume(resume_text, None)
        return JSONResponse(content=result)
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

class AIAssistantRequest(BaseModel):
    message: str
    resume_data: Optional[dict] = None
    context: Optional[str] = None

@app.post("/ai-assistant")
async def ai_assistant_chat(request: AIAssistantRequest):
    """
    AI Assistant endpoint for resume building guidance
    """
    try:
        user_message = request.message.lower()
        resume_data = request.resume_data or {}
        
        # Create context-aware prompt
        context_info = ""
        if resume_data:
            context_info = f"""
Current Resume Data:
- Name: {resume_data.get('header', {}).get('fullName', 'Not provided')}
- Summary: {resume_data.get('summary', 'Not provided')}
- Experience entries: {len(resume_data.get('experience', []))}
- Skills: {len(resume_data.get('skills', {}).get('technical', [])) + len(resume_data.get('skills', {}).get('soft', []))} total
- Education entries: {len(resume_data.get('education', []))}
- Projects: {len(resume_data.get('projects', []))}
"""

        # Use Gemini AI if available, otherwise fallback
        if model and GEMINI_API_KEY:
            try:
                prompt = f"""
You are an expert resume writing assistant specializing in ATS-friendly resumes. 
Help users create compelling, professional resumes that pass Applicant Tracking Systems.

{context_info}

User Question: {request.message}

Provide specific, actionable advice. Include examples when helpful. Keep responses concise but comprehensive.
Focus on ATS optimization, keyword usage, quantifiable achievements, and professional formatting.
"""
                
                response = model.generate_content(prompt)
                ai_response = response.text
                
            except Exception as e:
                print(f"Gemini API error: {e}")
                ai_response = get_fallback_response(user_message)
        else:
            ai_response = get_fallback_response(user_message)
        
        return JSONResponse(content={
            "response": ai_response,
            "status": "success"
        })
        
    except Exception as e:
        print(f"AI Assistant error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "response": "I'm having trouble connecting right now. Please try again.",
                "status": "error"
            }
        )

def get_fallback_response(user_message: str) -> str:
    """Fallback responses when Gemini API is not available"""
    
    if any(keyword in user_message for keyword in ['summary', 'objective']):
        return """For your professional summary, focus on:

• 2-3 sentences highlighting your key strengths
• Include relevant keywords from your target job
• Mention years of experience and key achievements
• Keep it concise but impactful

Example: 'Results-driven Software Engineer with 3+ years of experience in full-stack development, specializing in React and Node.js. Proven track record of delivering scalable applications that improved user engagement by 40%.'"""

    elif any(keyword in user_message for keyword in ['experience', 'work']):
        return """For work experience entries:

• Use action verbs (Developed, Implemented, Led, Achieved)
• Quantify results with numbers and percentages
• Focus on achievements, not just responsibilities
• Use reverse chronological order
• Include relevant keywords for ATS

Format: Action Verb + What you did + Result/Impact"""

    elif any(keyword in user_message for keyword in ['skills']):
        return """For your skills section:

• Separate technical and soft skills
• Include specific technologies, not just general terms
• Match skills to job requirements
• Use industry-standard terminology
• Consider adding proficiency levels

Technical: React, Node.js, Python, AWS, Docker
Soft: Leadership, Problem-solving, Communication"""

    elif any(keyword in user_message for keyword in ['education']):
        return """For education section:

• Include degree, institution, graduation year
• Add GPA if 3.5 or higher
• Include relevant coursework for entry-level positions
• Add honors, awards, or relevant projects
• Consider adding certifications here too"""

    elif any(keyword in user_message for keyword in ['ats', 'optimize']):
        return """ATS Optimization Tips:

• Use standard section headings (Experience, Education, Skills)
• Include keywords from job descriptions
• Use simple, clean formatting
• Avoid images, graphics, or complex layouts
• Save as PDF to preserve formatting
• Use standard fonts (Arial, Calibri, Times New Roman)"""

    else:
        return """I can help you with:

• Writing compelling summaries
• Optimizing work experience descriptions
• Selecting relevant skills
• Formatting education details
• ATS optimization tips
• Industry-specific advice

What specific section would you like help with?"""

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
