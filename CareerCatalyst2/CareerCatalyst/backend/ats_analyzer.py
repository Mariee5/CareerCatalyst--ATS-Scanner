import google.generativeai as genai
import re
import json
import os
from typing import Dict, List, Optional
import spacy
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load NLP models
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spaCy model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables. Please set it in your .env file.")
    print("Get your API key from: https://makersuite.google.com/app/apikey")
else:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

def detect_resume_sections(resume_text: str) -> Dict[str, bool]:
    """Detect which standard resume sections are present"""
    sections = {
        "Contact Info": False,
        "Summary / Objective": False,
        "Skills": False,
        "Work Experience": False,
        "Education": False,
        "Certifications": False,
        "Projects": False,
        "Languages": False
    }
    
    text_lower = resume_text.lower()
    
    # Contact Info - check for email and phone
    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text):
        sections["Contact Info"] = True
    
    # Summary/Objective
    summary_patterns = [r'\bsummary\b', r'\bobjective\b', r'\bprofile\b', r'\babout\s+me\b']
    if any(re.search(pattern, text_lower) for pattern in summary_patterns):
        sections["Summary / Objective"] = True
    
    # Skills
    skill_patterns = [r'\bskills\b', r'\btechnical\s+skills\b', r'\bcore\s+competencies\b', r'\bexpertise\b']
    if any(re.search(pattern, text_lower) for pattern in skill_patterns):
        sections["Skills"] = True
    
    # Work Experience
    exp_patterns = [r'\bexperience\b', r'\bemployment\b', r'\bwork\s+history\b', r'\bprofessional\s+experience\b']
    if any(re.search(pattern, text_lower) for pattern in exp_patterns):
        sections["Work Experience"] = True
    
    # Education
    edu_patterns = [r'\beducation\b', r'\bacademic\b', r'\bdegree\b', r'\buniversity\b', r'\bcollege\b']
    if any(re.search(pattern, text_lower) for pattern in edu_patterns):
        sections["Education"] = True
    
    # Certifications
    cert_patterns = [r'\bcertifications?\b', r'\bcertified\b', r'\blicenses?\b']
    if any(re.search(pattern, text_lower) for pattern in cert_patterns):
        sections["Certifications"] = True
    
    # Projects
    proj_patterns = [r'\bprojects?\b', r'\bportfolio\b']
    if any(re.search(pattern, text_lower) for pattern in proj_patterns):
        sections["Projects"] = True
    
    # Languages
    lang_patterns = [r'\blanguages?\b', r'\bmultilingual\b', r'\bfluent\s+in\b']
    if any(re.search(pattern, text_lower) for pattern in lang_patterns):
        sections["Languages"] = True
    
    return sections

def detect_formatting_issues(resume_text: str) -> List[str]:
    """Detect ATS-unfriendly formatting issues"""
    issues = []
    
    # Check for tables (multiple tabs)
    if re.search(r'\t{2,}', resume_text):
        issues.append("Contains table formatting which may not be ATS-friendly")
    
    # Check for image references
    if re.search(r'\.(jpg|png|svg|jpeg|gif|pdf)', resume_text, re.IGNORECASE):
        issues.append("Contains image/file references - ATS systems cannot read embedded images")
    
    # Check for special characters that might break parsing
    special_chars = ['•', '◦', '▪', '■', '●', '○']
    if any(char in resume_text for char in special_chars):
        issues.append("Uses special bullet characters - consider using standard hyphens (-) or asterisks (*)")
    
    # Check for multiple columns (indicated by excessive spaces)
    if re.search(r' {10,}', resume_text):
        issues.append("Possible multi-column layout detected - use single column format for better ATS compatibility")
    
    # Check contact information format
    if not re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text):
        issues.append("Missing or improperly formatted email address")
    
    if not re.search(r'[\+]?[1-9]?[\d\s\-\(\)]{10,}', resume_text):
        issues.append("Missing or improperly formatted phone number")
    
    # Check for inconsistent date formats
    date_formats = [
        r'\d{1,2}/\d{1,2}/\d{4}',  # MM/DD/YYYY
        r'\d{4}-\d{2}-\d{2}',       # YYYY-MM-DD
        r'\w+\s+\d{4}',             # Month YYYY
        r'\d{4}\s*-\s*\d{4}'        # YYYY - YYYY
    ]
    found_formats = sum(1 for fmt in date_formats if re.search(fmt, resume_text))
    if found_formats > 2:
        issues.append("Inconsistent date formats detected - use consistent format throughout")
    
    return issues

def generate_ai_analysis(resume_text: str, job_description: Optional[str] = None) -> Dict:
    """Use Gemini AI to perform sophisticated resume analysis"""
    
    # Check if API key is available
    if not os.getenv('GEMINI_API_KEY'):
        return {
            "ats_score": 70,
            "improvement_suggestions": [
                "Set up Gemini API key for advanced AI analysis",
                "Review resume formatting for ATS compatibility",
                "Include relevant keywords from job description",
                "Add quantified achievements with specific numbers",
                "Use strong action verbs to describe accomplishments"
            ],
            "error": "Gemini API key not configured. Using fallback analysis."
        }
    
    # Create the prompt based on whether job description is provided
    if job_description:
        prompt = f"""
You are a smart AI hiring assistant and ATS evaluator. Analyze this resume against the provided job description.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{job_description}

Provide analysis in this exact JSON format:
{{
    "ats_score": 85,
    "keyword_analysis": {{
        "matched_keywords": ["python", "machine learning", "sql"],
        "missing_keywords": ["docker", "aws", "kubernetes"],
        "keyword_match_percentage": 75
    }},
    "content_strength": {{
        "action_verbs_score": 8,
        "quantified_achievements": 6,
        "relevance_score": 9
    }},
    "improvement_suggestions": [
        "Add Docker and containerization experience",
        "Include more quantified achievements",
        "Strengthen technical skills section"
    ],
    "role_fit_analysis": "Strong match for the position with relevant experience in...",
    "critical_gaps": ["Missing cloud experience", "No DevOps background"]
}}
"""
    else:
        prompt = f"""
You are a smart AI hiring assistant and ATS evaluator. Analyze this resume for general ATS compatibility and professional quality.

RESUME TEXT:
{resume_text}

Since no job description is provided, infer the likely role/field from the resume content and evaluate accordingly.

Provide analysis in this exact JSON format:
{{
    "ats_score": 75,
    "inferred_role": "Software Developer",
    "keyword_analysis": {{
        "technical_keywords": ["python", "javascript", "react"],
        "soft_skills": ["leadership", "communication"],
        "industry_terms": ["agile", "scrum"]
    }},
    "content_strength": {{
        "action_verbs_score": 7,
        "quantified_achievements": 4,
        "professional_language_score": 8
    }},
    "improvement_suggestions": [
        "Add more quantified achievements",
        "Include relevant certifications",
        "Strengthen skills section with specific technologies"
    ],
    "general_feedback": "Resume shows good technical background but needs more specific metrics..."
}}
"""
    
    try:
        response = model.generate_content(prompt)
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Try to extract JSON from the response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start != -1 and json_end != -1:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            # Fallback if JSON extraction fails
            return {
                "ats_score": 70,
                "improvement_suggestions": ["Review resume format and content"],
                "error": "Could not parse AI response"
            }
    except Exception as e:
        print(f"Gemini API error: {e}")
        return {
            "ats_score": 60,
            "improvement_suggestions": ["Could not analyze with AI - check API connection"],
            "error": str(e)
        }

def calculate_comprehensive_score(
    ai_analysis: Dict,
    sections: Dict[str, bool],
    formatting_issues: List[str],
    resume_text: str
) -> Dict:
    """Calculate comprehensive ATS score based on multiple factors with realistic penalties"""
    
    # Base score from AI analysis - more conservative capping
    ai_score = ai_analysis.get("ats_score", 60)
    print(f"🔍 DEBUG - Raw AI score: {ai_score}")
    
    # More aggressive capping based on AI score range
    if ai_score > 90:
        ai_score = 75  # Very high AI scores are unrealistic
    elif ai_score > 80:
        ai_score = min(ai_score - 10, 70)  # Reduce high scores
    else:
        ai_score = min(ai_score, 65)  # Cap moderate scores lower
    
    print(f"🔍 DEBUG - Adjusted AI base score: {ai_score}")
    
    # Section completeness score (max 12 points, more conservative)
    essential_sections = ["Contact Info", "Work Experience", "Skills", "Education"]
    present_essential = sum(1 for section in essential_sections if sections.get(section, False))
    section_score = present_essential * 3  # 3 points per essential section
    print(f"🔍 DEBUG - Section score: {section_score} ({present_essential}/{len(essential_sections)} essential sections)")
    
    # Enhanced formatting penalty (max -25 points, more severe)
    formatting_penalty = min(len(formatting_issues) * 5, 25)
    print(f"🔍 DEBUG - Formatting penalty: {formatting_penalty} (issues: {len(formatting_issues)})")
    
    # Content quality bonus - more conservative (max 5 points)
    content_bonus = 0
    content_strength = ai_analysis.get("content_strength", {})
    if content_strength:
        # Award bonus only for truly exceptional content
        action_verb_score = content_strength.get("action_verbs_score", 0)
        achievements = content_strength.get("quantified_achievements", 0)
        if action_verb_score >= 8 and achievements >= 5:
            content_bonus = 5
        elif action_verb_score >= 7 or achievements >= 3:
            content_bonus = 2
    print(f"🔍 DEBUG - Content bonus: {content_bonus}")
    
    # Suggestions penalty - NEW: Penalize based on number of improvement suggestions
    suggestions = ai_analysis.get("improvement_suggestions", [])
    suggestion_penalty = 0
    if len(suggestions) > 6:
        suggestion_penalty = 15  # Many suggestions = significant issues
    elif len(suggestions) > 4:
        suggestion_penalty = 10  # Several suggestions = moderate issues
    elif len(suggestions) > 2:
        suggestion_penalty = 5   # Few suggestions = minor issues
    print(f"🔍 DEBUG - Suggestion penalty: {suggestion_penalty} (suggestions: {len(suggestions)})")
    
    # Missing sections penalty - NEW: More severe penalty for missing essential sections
    missing_essential = len(essential_sections) - present_essential
    missing_section_penalty = missing_essential * 8  # 8 points per missing essential section
    print(f"🔍 DEBUG - Missing section penalty: {missing_section_penalty} (missing: {missing_essential})")
    
    # Calculate final score with more realistic approach
    final_score = (ai_score + section_score + content_bonus - 
                  formatting_penalty - suggestion_penalty - missing_section_penalty)
    
    print(f"🔍 DEBUG - Calculation: {ai_score} + {section_score} + {content_bonus} - {formatting_penalty} - {suggestion_penalty} - {missing_section_penalty} = {final_score}")
    
    # More realistic score boundaries
    final_score = max(15, min(95, final_score))  # Minimum 15, maximum 95 (rarely perfect)
    print(f"🔍 DEBUG - Final score (bounded): {final_score}")
    
    return {
        "total_score": round(final_score),
        "ai_base_score": ai_score,
        "section_bonus": section_score,
        "formatting_penalty": formatting_penalty,
        "content_bonus": content_bonus,
        "suggestion_penalty": suggestion_penalty,
        "missing_section_penalty": missing_section_penalty
    }
def analyzeResume(resume_text: str, job_description: Optional[str] = None) -> Dict:
    """
    Enhanced ATS resume analysis using AI and comprehensive scoring
    """
    
    # 1. Detect resume sections
    sections = detect_resume_sections(resume_text)
    missing_sections = [section for section, present in sections.items() if not present]
    
    # 2. Detect formatting issues
    formatting_issues = detect_formatting_issues(resume_text)
    
    # 3. Get AI analysis
    ai_analysis = generate_ai_analysis(resume_text, job_description)
    
    # 4. Calculate comprehensive score
    scoring = calculate_comprehensive_score(ai_analysis, sections, formatting_issues, resume_text)
    
    # 5. Determine score category and emoji with more realistic thresholds
    total_score = scoring["total_score"]
    if total_score >= 80:
        score_category = "Excellent"
        score_emoji = "🟢"
    elif total_score >= 65:
        score_category = "Good"
        score_emoji = "🟡"
    elif total_score >= 45:
        score_category = "Fair"
        score_emoji = "🟠"
    else:
        score_category = "Needs Improvement"
        score_emoji = "🔴"
    
    # 6. Generate comprehensive suggestions
    suggestions = ai_analysis.get("improvement_suggestions", [])
    
    # Add section-based suggestions
    if not sections.get("Contact Info"):
        suggestions.insert(0, "Add complete contact information including email and phone number")
    if not sections.get("Skills"):
        suggestions.append("Include a dedicated Skills section with relevant technical and soft skills")
    if missing_sections:
        suggestions.append(f"Consider adding missing sections: {', '.join(missing_sections[:3])}")
    
    # Add formatting suggestions
    if formatting_issues:
        suggestions.append("Address formatting issues to improve ATS compatibility")
    
    # 7. Prepare skills analysis
    skills_analysis = ai_analysis.get("keyword_analysis", {})
    if job_description:
        matched_keywords = skills_analysis.get("matched_keywords", [])
        missing_keywords = skills_analysis.get("missing_keywords", [])
    else:
        matched_keywords = skills_analysis.get("technical_keywords", [])
        missing_keywords = []
    
    # 8. Build response
    result = {
        "totalScore": total_score,
        "scoreCategory": score_category,
        "scoreEmoji": score_emoji,
        "hasJobDescription": job_description is not None,
        
        # Section Analysis
        "detectedSections": {
            "present": [section for section, present in sections.items() if present],
            "missing": missing_sections
        },
        
        # Formatting Issues
        "formattingIssues": formatting_issues,
        
        # Skills/Keywords
        "skillsAnalysis": {
            "matchedKeywords": matched_keywords[:15],
            "missingKeywords": missing_keywords[:10],
            "keywordMatchPercentage": skills_analysis.get("keyword_match_percentage", 0) if job_description else None
        },
        
        # Content Strength
        "contentStrength": ai_analysis.get("content_strength", {}),
        
        # Suggestions
        "suggestions": suggestions[:10],  # Limit to top 10 suggestions
        
        # Additional Analysis
        "aiAnalysis": {
            "roleMatch": ai_analysis.get("role_fit_analysis", "") if job_description else ai_analysis.get("general_feedback", ""),
            "inferredRole": ai_analysis.get("inferred_role", "") if not job_description else None,
            "criticalGaps": ai_analysis.get("critical_gaps", [])
        },
        
        # Score Breakdown
        "scoreBreakdown": scoring,
        
        # Markdown Report
        "markdownReport": generate_markdown_report(
            total_score, score_emoji, sections, formatting_issues, 
            skills_analysis, ai_analysis, suggestions, job_description
        )
    }
    
    return result

def generate_markdown_report(
    total_score: int, 
    score_emoji: str, 
    sections: Dict[str, bool], 
    formatting_issues: List[str],
    skills_analysis: Dict,
    ai_analysis: Dict,
    suggestions: List[str],
    has_job_description: bool
) -> str:
    """Generate a formatted markdown report"""
    
    report = f"""# 🎯 ATS Resume Analysis Report

## {score_emoji} ATS Compatibility Score: **{total_score}/100**

---

## 🧾 Detected Resume Sections

### ✅ Present Sections:
"""
    
    present_sections = [section for section, present in sections.items() if present]
    for section in present_sections:
        report += f"- {section}\n"
    
    missing_sections = [section for section, present in sections.items() if not present]
    if missing_sections:
        report += "\n### ❌ Missing Sections:\n"
        for section in missing_sections:
            report += f"- {section}\n"
    
    report += "\n---\n\n## ❗ Formatting and Layout Issues\n\n"
    
    if formatting_issues:
        for issue in formatting_issues:
            report += f"- ⚠️ {issue}\n"
    else:
        report += "✅ No major formatting issues detected!\n"
    
    report += "\n---\n\n## 🔍 Skills and Keyword Analysis\n\n"
    
    if has_job_description:
        matched = skills_analysis.get("matched_keywords", [])
        missing = skills_analysis.get("missing_keywords", [])
        
        if matched:
            report += "### ✅ Matched Keywords:\n"
            report += ", ".join(matched[:10]) + "\n\n"
        
        if missing:
            report += "### ❌ Missing Keywords:\n"
            report += ", ".join(missing[:10]) + "\n"
    else:
        tech_keywords = skills_analysis.get("technical_keywords", [])
        if tech_keywords:
            report += "### 🔧 Technical Skills Found:\n"
            report += ", ".join(tech_keywords) + "\n"
    
    report += "\n---\n\n## 📈 Content Strength Evaluation\n\n"
    
    content_strength = ai_analysis.get("content_strength", {})
    if content_strength:
        action_score = content_strength.get("action_verbs_score", 0)
        achievements = content_strength.get("quantified_achievements", 0)
        
        report += f"- **Action Verbs Usage:** {action_score}/10\n"
        report += f"- **Quantified Achievements:** {achievements} found\n"
        
        if has_job_description:
            relevance = content_strength.get("relevance_score", 0)
            report += f"- **Job Relevance:** {relevance}/10\n"
    
    report += "\n---\n\n## 🛠 Suggestions to Improve\n\n"
    
    for i, suggestion in enumerate(suggestions, 1):
        report += f"{i}. {suggestion}\n"
    
    if has_job_description and ai_analysis.get("role_fit_analysis"):
        report += f"\n---\n\n## 💼 Role Fit Analysis\n\n{ai_analysis['role_fit_analysis']}\n"
    elif not has_job_description and ai_analysis.get("general_feedback"):
        report += f"\n---\n\n## 📝 General Assessment\n\n{ai_analysis['general_feedback']}\n"
    
    return report
# Legacy function for backward compatibility
def run_ats_check(resume_text, job_description=None):
    """Main function to run ATS analysis and return results."""
    return analyzeResume(resume_text, job_description)