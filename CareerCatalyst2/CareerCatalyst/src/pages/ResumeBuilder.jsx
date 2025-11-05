import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Brain,
  Bot,
  Palette,
  User,
  Target,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Trash2,
  Plus,
  Eye,
  Save,
  Loader,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  FileText
} from 'lucide-react';

function AIAssistant({ resumeData, onSuggestion, isVisible, setIsVisible }) {
  const [messages, setMessages] = useState([
    { 
      type: 'ai', 
      content: "Hi! I'm your AI resume assistant. I'll help you create an ATS-friendly resume with live feedback. What would you like to work on first?" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      // Call the AI assistant API
      const response = await fetch('http://localhost:8000/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          resume_data: resumeData
        })
      });
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'ai', content: data.response }]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      setMessages(prev => [...prev, { type: 'ai', content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '500px',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '1rem 1rem 0 0',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>AI Resume Assistant</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>
      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '0.75rem',
              borderRadius: '1rem',
              background: message.type === 'user' ? '#10b981' : '#f3f4f6',
              color: message.type === 'user' ? 'white' : '#374151',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-line'
            }}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: '1rem',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Loader size={16} className="animate-spin" />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>AI is thinking...</span>
            </div>
          </div>
        )}
      </div>
      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask for resume help..."
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          style={{
            padding: '0.75rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            opacity: (!inputMessage.trim() || isLoading) ? 0.5 : 1
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}


// Template Selection Component
function TemplateSelector({ selectedTemplate, onTemplateSelect }) {
  const templates = [
    { id: 'modern', name: 'Modern Professional', preview: 'Sleek, ATS-optimized, clean sections' },
    { id: 'classic', name: 'Classic Format', preview: 'Traditional, serif fonts, clear lines' },
    { id: 'creative', name: 'Creative Design', preview: 'Stylish header, color accents, icons' }
  ];

  // Clean, professional template previews with proper spacing
  const templateVisuals = {
    modern: (
      <div style={{
        background: '#fff',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        padding: '1.25rem',
        minHeight: '180px',
        width: '100%',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#1f2937',
        fontSize: '0.875rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontWeight: '700', 
          fontSize: '1.1rem', 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>
          John Smith
        </div>
        <div style={{ 
          color: '#6b7280', 
          fontSize: '0.875rem', 
          marginBottom: '1rem',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '0.75rem'
        }}>
          Software Engineer | john@email.com | (555) 123-4567
        </div>
        
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            fontWeight: '600', 
            color: '#374151', 
            fontSize: '0.875rem',
            marginBottom: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Experience
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: '1.4' }}>
            Senior Developer at TechCorp<br />
            Built scalable web applications
          </div>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            fontWeight: '600', 
            color: '#374151', 
            fontSize: '0.875rem',
            marginBottom: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Skills
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
            React, Node.js, Python, AWS
          </div>
        </div>
      </div>
    ),
    classic: (
      <div style={{
        background: '#fafafa',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        padding: '1.25rem',
        minHeight: '180px',
        width: '100%',
        fontFamily: 'Times New Roman, serif',
        color: '#1f2937',
        fontSize: '0.875rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '1.1rem', 
          color: '#1f2937', 
          marginBottom: '0.25rem',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Sarah Johnson
        </div>
        <div style={{ 
          color: '#6b7280', 
          fontSize: '0.875rem', 
          marginBottom: '1rem',
          textAlign: 'center',
          borderBottom: '1px solid #d1d5db',
          paddingBottom: '0.75rem'
        }}>
          Business Analyst | sarah@email.com | (555) 987-6543
        </div>
        
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            fontWeight: 'bold', 
            color: '#1f2937', 
            fontSize: '0.875rem',
            marginBottom: '0.25rem'
          }}>
            Professional Summary
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: '1.4' }}>
            Experienced analyst with expertise in data-driven insights and process optimization.
          </div>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            fontWeight: 'bold', 
            color: '#1f2937', 
            fontSize: '0.875rem',
            marginBottom: '0.25rem'
          }}>
            Experience
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: '1.4' }}>
            Senior Analyst at DataCorp (2020-Present)<br />
            Led analytics initiatives and reporting
          </div>
        </div>
      </div>
    ),
    creative: (
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '0.5rem',
        border: '1px solid #cbd5e1',
        padding: '1.25rem',
        minHeight: '180px',
        width: '100%',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#1e293b',
        fontSize: '0.875rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '0.75rem',
          paddingBottom: '0.5rem',
          borderBottom: '2px solid #3b82f6'
        }}>
          <div style={{ 
            fontWeight: '700', 
            fontSize: '1.1rem', 
            color: '#1e293b',
            marginRight: '0.5rem'
          }}>
            Alex Chen
          </div>
          <div style={{ 
            background: '#3b82f6', 
            color: '#fff', 
            borderRadius: '0.25rem', 
            padding: '0.2rem 0.5rem', 
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            Designer
          </div>
        </div>
        
        <div style={{ 
          color: '#64748b', 
          fontSize: '0.875rem', 
          marginBottom: '1rem'
        }}>
          alex@email.com | (555) 456-7890 | Portfolio: alexchen.design
        </div>
        
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            fontWeight: '600', 
            color: '#1e293b', 
            fontSize: '0.875rem',
            marginBottom: '0.25rem'
          }}>
            Creative Focus
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: '1.4' }}>
            UI/UX Designer specializing in modern web interfaces and user experience optimization.
          </div>
        </div>

        <div>
          <div style={{ 
            fontWeight: '600', 
            color: '#1e293b', 
            fontSize: '0.875rem',
            marginBottom: '0.25rem'
          }}>
            Tools & Skills
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
            Figma, Adobe Creative Suite, Prototyping
          </div>
        </div>
      </div>
    )
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
        Choose Template
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            style={{
              padding: '1rem',
              border: selectedTemplate === template.id ? '2px solid #10b981' : '1px solid #d1d5db',
              borderRadius: '1rem',
              background: selectedTemplate === template.id ? '#f0fdf4' : '#fff',
              cursor: 'pointer',
              boxShadow: selectedTemplate === template.id ? '0 4px 12px rgba(16,185,129,0.08)' : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileText size={32} color={selectedTemplate === template.id ? '#10b981' : '#d1d5db'} />
            <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1rem' }}>{template.name}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{template.preview}</div>
            {/* Visual preview */}
            {templateVisuals[template.id]}
          </div>
        ))}
      </div>
      {/* Show large preview of selected template below */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem' }}>Selected Template Preview</h4>
        {templateVisuals[selectedTemplate]}
      </div>
    </div>
  );
}

function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [atsScore, setAtsScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  
  // Resume form data
  const [resumeData, setResumeData] = useState({
    header: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      location: ''
    },
    summary: '',
    education: [{
      degree: '',
      institution: '',
      duration: '',
      gpa: '',
      coursework: ''
    }],
    experience: [{
      title: '',
      company: '',
      duration: '',
      description: '',
      achievements: ['']
    }],
    skills: {
      technical: [],
      soft: [],
      newTechnical: '',
      newSoft: ''
    },
    projects: [{
      title: '',
      description: '',
      technologies: '',
      link: '',
      duration: ''
    }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    }]
  });

  useEffect(() => {
    calculateLiveScore();
  }, [resumeData]);

  const calculateLiveScore = () => {
    let score = 0;
    let newFeedback = [];

    // Header completeness (20 points)
    const headerFields = Object.values(resumeData.header).filter(field => field.trim() !== '');
    score += Math.min(20, (headerFields.length / 6) * 20);
    
    if (headerFields.length < 4) {
      newFeedback.push({ type: 'warning', message: 'Complete your contact information for better ATS compatibility' });
    }

    // Summary (15 points)
    if (resumeData.summary.trim().length > 100) {
      score += 15;
    } else if (resumeData.summary.trim().length > 50) {
      score += 10;
      newFeedback.push({ type: 'info', message: 'Good summary! Consider adding more specific achievements' });
    } else if (resumeData.summary.trim().length > 0) {
      score += 5;
      newFeedback.push({ type: 'warning', message: 'Expand your summary to 2-3 sentences for better impact' });
    } else {
      newFeedback.push({ type: 'warning', message: 'Add a professional summary to introduce yourself' });
    }

    // Experience (30 points)
    const validExperience = resumeData.experience.filter(exp => 
      exp.title.trim() && exp.company.trim() && exp.description.trim()
    );
    score += Math.min(30, validExperience.length * 15);
    
    if (validExperience.length === 0) {
      newFeedback.push({ type: 'warning', message: 'Add at least one work experience with detailed descriptions' });
    }

    // Skills (15 points)
    const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length;
    score += Math.min(15, totalSkills * 1.5);
    
    if (totalSkills < 8) {
      newFeedback.push({ type: 'info', message: 'Add more relevant skills to increase keyword matching' });
    }

    // Education (10 points)
    const validEducation = resumeData.education.filter(edu => 
      edu.degree.trim() && edu.institution.trim()
    );
    score += Math.min(10, validEducation.length * 10);

    // Projects (10 points)
    const validProjects = resumeData.projects.filter(proj => 
      proj.title.trim() && proj.description.trim()
    );
    score += Math.min(10, validProjects.length * 5);

    setAtsScore(Math.round(score));
    setFeedback(newFeedback);
  };

  const handleDownloadPDF = () => {
    // Simple PDF generation using browser's print functionality
    const resumeContent = generateResumeHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeData.header.fullName || 'Resume'}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .contact { color: #666; margin-bottom: 5px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #333; margin-bottom: 10px; padding-bottom: 5px; }
            .experience-item, .education-item, .project-item { margin-bottom: 15px; }
            .item-title { font-weight: bold; }
            .item-subtitle { color: #666; font-style: italic; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${resumeContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generateResumeHTML = () => {
    let html = `
      <div class="header">
        <div class="name">${resumeData.header.fullName || 'Your Name'}</div>
        <div class="contact">${resumeData.header.email || 'your.email@example.com'}</div>
        <div class="contact">${resumeData.header.phone || '(555) 123-4567'}</div>
        ${resumeData.header.location ? `<div class="contact">${resumeData.header.location}</div>` : ''}
        ${resumeData.header.linkedin ? `<div class="contact">${resumeData.header.linkedin}</div>` : ''}
        ${resumeData.header.github ? `<div class="contact">${resumeData.header.github}</div>` : ''}
      </div>
    `;

    if (resumeData.summary) {
      html += `
        <div class="section">
          <div class="section-title">PROFESSIONAL SUMMARY</div>
          <p>${resumeData.summary}</p>
        </div>
      `;
    }

    if (resumeData.experience.some(exp => exp.title && exp.company)) {
      html += `<div class="section"><div class="section-title">EXPERIENCE</div>`;
      resumeData.experience.forEach(exp => {
        if (exp.title && exp.company) {
          html += `
            <div class="experience-item">
              <div class="item-title">${exp.title}</div>
              <div class="item-subtitle">${exp.company} | ${exp.duration}</div>
              ${exp.description ? `<p>${exp.description}</p>` : ''}
            </div>
          `;
        }
      });
      html += `</div>`;
    }

    if (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) {
      html += `<div class="section"><div class="section-title">SKILLS</div>`;
      if (resumeData.skills.technical.length > 0) {
        html += `<p><strong>Technical:</strong> ${resumeData.skills.technical.join(', ')}</p>`;
      }
      if (resumeData.skills.soft.length > 0) {
        html += `<p><strong>Soft Skills:</strong> ${resumeData.skills.soft.join(', ')}</p>`;
      }
      html += `</div>`;
    }

    if (resumeData.education.some(edu => edu.degree && edu.institution)) {
      html += `<div class="section"><div class="section-title">EDUCATION</div>`;
      resumeData.education.forEach(edu => {
        if (edu.degree && edu.institution) {
          html += `
            <div class="education-item">
              <div class="item-title">${edu.degree}</div>
              <div class="item-subtitle">${edu.institution} | ${edu.duration}</div>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          `;
        }
      });
      html += `</div>`;
    }

    if (resumeData.projects.some(proj => proj.title && proj.description)) {
      html += `<div class="section"><div class="section-title">PROJECTS</div>`;
      resumeData.projects.forEach(proj => {
        if (proj.title && proj.description) {
          html += `
            <div class="project-item">
              <div class="item-title">${proj.title}</div>
              ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
              <p>${proj.description}</p>
              ${proj.link ? `<p>Link: ${proj.link}</p>` : ''}
            </div>
          `;
        }
      });
      html += `</div>`;
    }

    if (resumeData.certifications.some(cert => cert.name)) {
      html += `<div class="section"><div class="section-title">CERTIFICATIONS</div>`;
      resumeData.certifications.forEach(cert => {
        if (cert.name) {
          html += `
            <div class="certification-item">
              <div class="item-title">${cert.name}</div>
              ${cert.issuer ? `<div class="item-subtitle">${cert.issuer} | ${cert.date}</div>` : ''}
            </div>
          `;
        }
      });
      html += `</div>`;
    }

    return html;
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const addArrayItem = (section) => {
    const templates = {
      education: { degree: '', institution: '', duration: '', gpa: '', coursework: '' },
      experience: { title: '', company: '', duration: '', description: '', achievements: [''] },
      projects: { title: '', description: '', technologies: '', link: '', duration: '' },
      certifications: { name: '', issuer: '', date: '', credentialId: '' }
    };
    
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const addSkill = (type) => {
    const skill = resumeData.skills[`new${type.charAt(0).toUpperCase() + type.slice(1)}`].trim();
    if (skill) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [type]: [...prev.skills[type], skill],
          [`new${type.charAt(0).toUpperCase() + type.slice(1)}`]: ''
        }
      }));
    }
  };

  const removeSkill = (type, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index)
      }
    }));
  };

  const sections = [
    { id: 'template', label: 'Template', icon: <Palette size={20} /> },
    { id: 'header', label: 'Contact Info', icon: <User size={20} /> },
    { id: 'summary', label: 'Summary', icon: <Target size={20} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={20} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={20} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Code size={20} /> },
    { id: 'certifications', label: 'Certifications', icon: <Award size={20} /> }
  ];

  // Render form content based on active section
  const renderFormContent = () => {
    switch (activeSection) {
      case 'template':
        return (
          <TemplateSelector 
            selectedTemplate={selectedTemplate} 
            onTemplateSelect={setSelectedTemplate} 
          />
        );

      case 'header':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={resumeData.header.fullName}
                  onChange={(e) => updateResumeData('header', { ...resumeData.header, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={resumeData.header.email}
                  onChange={(e) => updateResumeData('header', { ...resumeData.header, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="john.doe@email.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={resumeData.header.phone}
                  onChange={(e) => updateResumeData('header', { ...resumeData.header, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={resumeData.header.location}
                  onChange={(e) => updateResumeData('header', { ...resumeData.header, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="City, State"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={resumeData.header.linkedin}
                  onChange={(e) => updateResumeData('header', { ...resumeData.header, linkedin: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={resumeData.header.github}
                  onChange={(e) => updateResumeData('header', { ...resumeData.header, github: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="github.com/johndoe"
                />
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Professional Summary *
            </label>
            <textarea
              value={resumeData.summary}
              onChange={(e) => updateResumeData('summary', e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              placeholder="Write a compelling 2-3 sentence summary that highlights your key strengths, experience, and career objectives..."
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Character count: {resumeData.summary.length} | Recommended: 100-200 characters
            </p>
          </div>
        );

      case 'experience':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {resumeData.experience.map((exp, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Experience {index + 1}
                  </h4>
                  {resumeData.experience.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('experience', index)}
                      style={{
                        padding: '0.5rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const newExperience = [...resumeData.experience];
                        newExperience[index].title = e.target.value;
                        updateResumeData('experience', newExperience);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExperience = [...resumeData.experience];
                        newExperience[index].company = e.target.value;
                        updateResumeData('experience', newExperience);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Tech Company Inc."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => {
                        const newExperience = [...resumeData.experience];
                        newExperience[index].duration = e.target.value;
                        updateResumeData('experience', newExperience);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Jan 2022 - Present"
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Job Description *
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...resumeData.experience];
                      newExperience[index].description = e.target.value;
                      updateResumeData('experience', newExperience);
                    }}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Describe your role, responsibilities, and key achievements with quantifiable results..."
                  />
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem('experience')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#10b981',
                border: '2px dashed #10b981',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}
            >
              <Plus size={16} />
              Add Another Experience
            </button>
          </div>
        );

      case 'skills':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Technical Skills */}
            <div>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                Technical Skills
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {resumeData.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: '#10b981',
                      color: 'white',
                      borderRadius: '1.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill('technical', index)}
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={resumeData.skills.newTechnical}
                  onChange={(e) => updateResumeData('skills', { ...resumeData.skills, newTechnical: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill('technical');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Add technical skill (e.g., React, Python, AWS)"
                />
                <button
                  onClick={() => addSkill('technical')}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                Soft Skills
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {resumeData.skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: '#6366f1',
                      color: 'white',
                      borderRadius: '1.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill('soft', index)}
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={resumeData.skills.newSoft}
                  onChange={(e) => updateResumeData('skills', { ...resumeData.skills, newSoft: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill('soft');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Add soft skill (e.g., Leadership, Communication)"
                />
                <button
                  onClick={() => addSkill('soft')}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {resumeData.education.map((edu, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Education {index + 1}
                  </h4>
                  {resumeData.education.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('education', index)}
                      style={{
                        padding: '0.5rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...resumeData.education];
                        newEducation[index].degree = e.target.value;
                        updateResumeData('education', newEducation);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Bachelor of Science in Computer Science"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = [...resumeData.education];
                        newEducation[index].institution = e.target.value;
                        updateResumeData('education', newEducation);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Duration
                    </label>
                    <input
                      type="text"
                      value={edu.duration}
                      onChange={(e) => {
                        const newEducation = [...resumeData.education];
                        newEducation[index].duration = e.target.value;
                        updateResumeData('education', newEducation);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="2020 - 2024"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      GPA (optional)
                    </label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => {
                        const newEducation = [...resumeData.education];
                        newEducation[index].gpa = e.target.value;
                        updateResumeData('education', newEducation);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem('education')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#10b981',
                border: '2px dashed #10b981',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}
            >
              <Plus size={16} />
              Add Another Education
            </button>
          </div>
        );

      case 'projects':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {resumeData.projects.map((project, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Project {index + 1}
                  </h4>
                  {resumeData.projects.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('projects', index)}
                      style={{
                        padding: '0.5rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[index].title = e.target.value;
                        updateResumeData('projects', newProjects);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="E-commerce Web Application"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={(e) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[index].technologies = e.target.value;
                        updateResumeData('projects', newProjects);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Project Link
                    </label>
                    <input
                      type="url"
                      value={project.link}
                      onChange={(e) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[index].link = e.target.value;
                        updateResumeData('projects', newProjects);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Project Description *
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...resumeData.projects];
                      newProjects[index].description = e.target.value;
                      updateResumeData('projects', newProjects);
                    }}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Describe the project, your role, key features, and impact..."
                  />
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem('projects')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#10b981',
                border: '2px dashed #10b981',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}
            >
              <Plus size={16} />
              Add Another Project
            </button>
          </div>
        );

      case 'certifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Certification {index + 1}
                  </h4>
                  {resumeData.certifications.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('certifications', index)}
                      style={{
                        padding: '0.5rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newCertifications = [...resumeData.certifications];
                        newCertifications[index].name = e.target.value;
                        updateResumeData('certifications', newCertifications);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const newCertifications = [...resumeData.certifications];
                        newCertifications[index].issuer = e.target.value;
                        updateResumeData('certifications', newCertifications);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Date Obtained
                    </label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => {
                        const newCertifications = [...resumeData.certifications];
                        newCertifications[index].date = e.target.value;
                        updateResumeData('certifications', newCertifications);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="March 2024"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem('certifications')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#10b981',
                border: '2px dashed #10b981',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}
            >
              <Plus size={16} />
              Add Certification
            </button>
          </div>
        );

      default:
        return <div>Select a section to edit</div>;
    }
  };

  // Inline styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #ecfdf5 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  };

  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 400px',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '1600px',
    margin: '0 auto',
    minHeight: 'calc(100vh - 80px)'
  };

  const sidebarStyle = {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
    height: 'fit-content',
    position: 'sticky',
    top: '100px'
  };

  const formSectionStyle = {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
    minHeight: '600px'
  };

  const previewSectionStyle = {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
    height: 'fit-content',
    position: 'sticky',
    top: '100px'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'white',
    color: '#374151',
    border: '1px solid #d1d5db'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/ats')}
            style={secondaryButtonStyle}
          >
            <ArrowLeft size={16} />
            Back to ATS Analyzer
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            AI Resume Builder
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* ATS Score Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: atsScore >= 75 ? '#f0fdf4' : atsScore >= 50 ? '#fffbeb' : '#fef2f2',
            borderRadius: '2rem',
            border: `1px solid ${atsScore >= 75 ? '#bbf7d0' : atsScore >= 50 ? '#fde68a' : '#fecaca'}`
          }}>
            <Brain size={16} color={atsScore >= 75 ? '#059669' : atsScore >= 50 ? '#d97706' : '#dc2626'} />
            <span style={{ 
              fontWeight: '600',
              color: atsScore >= 75 ? '#059669' : atsScore >= 50 ? '#d97706' : '#dc2626'
            }}>
              ATS Score: {atsScore}/100
            </span>
          </div>
          
          <button
            onClick={() => setAiAssistantVisible(true)}
            style={{
              ...primaryButtonStyle,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
            }}
          >
            <Bot size={16} />
            AI Assistant
          </button>
          
          <button style={secondaryButtonStyle}>
            <Save size={16} />
            Save Draft
          </button>
          
          <button 
              onClick={handleDownloadPDF}
              style={primaryButtonStyle}
            >
              <Download size={16} />
              Download PDF
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Left Sidebar - Navigation */}
        <div style={sidebarStyle}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
            Resume Sections
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  ...buttonStyle,
                  justifyContent: 'flex-start',
                  background: activeSection === section.id ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                  color: activeSection === section.id ? 'white' : '#6b7280',
                  border: 'none'
                }}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>

          {/* Live Feedback */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Live Feedback
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {feedback.slice(0, 3).map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: item.type === 'warning' ? '#fef3c7' : '#dbeafe',
                  borderRadius: '0.5rem',
                  border: `1px solid ${item.type === 'warning' ? '#fcd34d' : '#93c5fd'}`
                }}>
                  {item.type === 'warning' ? 
                    <AlertCircle size={16} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} /> : 
                    <CheckCircle size={16} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
                  }
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: item.type === 'warning' ? '#92400e' : '#1e40af',
                    lineHeight: 1.4
                  }}>
                    {item.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Form Section */}
        <div style={formSectionStyle}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              {sections.find(s => s.id === activeSection)?.label}
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              {activeSection === 'template' ? 
                'Choose a professional template that suits your industry' :
                `Fill in your ${activeSection} information below`
              }
            </p>
          </div>

          {/* Dynamic Form Content */}
          <div>
            {renderFormContent()}
          </div>
        </div>

        {/* Right Sidebar - Preview & Analysis */}
        <div style={previewSectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Eye size={20} color="#6b7280" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Live Preview
            </h3>
          </div>

          {/* Mini Resume Preview */}
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            background: '#fafafa',
            minHeight: '400px',
            fontSize: '0.875rem',
            lineHeight: 1.4
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {resumeData.header.fullName || 'Your Name'}
              </h4>
              <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>
                {resumeData.header.email || 'your.email@example.com'}
              </p>
              <p style={{ color: '#6b7280', margin: 0 }}>
                {resumeData.header.phone || '(555) 123-4567'}
              </p>
              {resumeData.header.location && (
                <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>
                  {resumeData.header.location}
                </p>
              )}
            </div>

            {resumeData.summary && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  PROFESSIONAL SUMMARY
                </h5>
                <p style={{ color: '#374151', margin: 0, fontSize: '0.75rem' }}>
                  {resumeData.summary}
                </p>
              </div>
            )}

            {resumeData.skills.technical.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  TECHNICAL SKILLS
                </h5>
                <p style={{ color: '#374151', margin: 0, fontSize: '0.75rem' }}>
                  {resumeData.skills.technical.join(', ')}
                </p>
              </div>
            )}

            {resumeData.experience[0].title && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  EXPERIENCE
                </h5>
                <div style={{ fontSize: '0.75rem' }}>
                  <p style={{ fontWeight: '600', color: '#374151', margin: '0 0 0.25rem 0' }}>
                    {resumeData.experience[0].title}
                  </p>
                  <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                    {resumeData.experience[0].company} | {resumeData.experience[0].duration}
                  </p>
                </div>
              </div>
            )}

            <div style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem' }}>
              Fill in sections to see live preview
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              style={primaryButtonStyle}
              onClick={() => navigate('/ats')}
            >
              <Send size={16} />
              Analyze with ATS
            </button>
            <button 
              onClick={handleDownloadPDF}
              style={secondaryButtonStyle}
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        resumeData={resumeData}
        onSuggestion={(suggestion) => {
          // Handle AI suggestions
          console.log('AI Suggestion:', suggestion);
        }}
        isVisible={aiAssistantVisible}
        setIsVisible={setAiAssistantVisible}
      />

      {/* AI Assistant Floating Button */}
      {!aiAssistantVisible && (
        <button
          onClick={() => setAiAssistantVisible(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 999,
            animation: 'pulse 2s infinite'
          }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default ResumeBuilder;
