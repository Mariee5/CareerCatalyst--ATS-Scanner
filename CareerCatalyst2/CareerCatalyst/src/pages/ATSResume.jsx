import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Target, Sparkles, ArrowRight, Zap, Brain, BarChart3, Edit3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hiringGif from '../assets/Hiring.gif';
import axios from 'axios';

function ATSResume() {
  const navigate = useNavigate();
  const resumeFileInput = useRef();
  const jdFileInput = useRef();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);
  const [uploadedJdFile, setUploadedJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [analysisMode, setAnalysisMode] = useState('with-jd'); // 'with-jd' or 'quick'
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, inputRef, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      inputRef.current.files = e.dataTransfer.files;
    }
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Function to clean and format markdown report
  const cleanMarkdownReport = (markdown) => {
    if (!markdown) return '';
    
    // Split into sections and clean up
    const sections = markdown.split(/(?=\n[A-Z][^a-z]*:|\n#{1,6}\s+)/);
    
    return sections.map((section, index) => {
      let cleanSection = section
        .replace(/#{1,6}\s*/g, '') // Remove # headers
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic markers
        .replace(/[📊🎯💡⚠️🔍📋✅❌]/g, '') // Remove emojis
        .replace(/^\s*[-*+]\s+/gm, '• ') // Convert markdown bullets to bullets
        .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
        .trim();
      
      // Identify section headers (lines ending with colon)
      const lines = cleanSection.split('\n');
      const formattedLines = lines.map(line => {
        if (line.endsWith(':') && line.length < 50 && !line.startsWith('•')) {
          return `HEADER:${line}`;
        }
        return line;
      });
      
      return formattedLines.join('\n');
    }).join('\n\n');
  };

  // Function to render formatted report
  const renderFormattedReport = (reportText) => {
    const lines = reportText.split('\n');
    let currentSection = '';
    const sections = [];
    
    lines.forEach(line => {
      if (line.startsWith('HEADER:')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = line.replace('HEADER:', '') + '\n';
      } else if (line.trim()) {
        currentSection += line + '\n';
      }
    });
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const header = lines[0];
      const content = lines.slice(1).join('\n');
      
      return (
        <div key={index} style={{
          marginBottom: '2rem',
          background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          {header && (
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #059669',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {header.replace(':', '')}
            </h4>
          )}
          <div style={{
            fontSize: '0.925rem',
            lineHeight: 1.7,
            color: '#374151',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            {content.split('\n').map((line, lineIndex) => {
              if (line.startsWith('•')) {
                return (
                  <div key={lineIndex} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                    paddingLeft: '0.5rem'
                  }}>
                    <span style={{
                      color: '#059669',
                      fontWeight: '600',
                      marginRight: '0.75rem',
                      marginTop: '0.125rem',
                      fontSize: '1rem'
                    }}>
                      •
                    </span>
                    <span style={{ flex: 1 }}>
                      {line.substring(1).trim()}
                    </span>
                  </div>
                );
              } else if (line.trim()) {
                return (
                  <p key={lineIndex} style={{
                    marginBottom: '1rem',
                    textAlign: 'justify'
                  }}>
                    {line.trim()}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    });
  };

  const handleAnalyzeResume = async () => {
    if (!uploadedResumeFile) {
      setError('Please upload a resume file first.');
      return;
    }

    if (analysisMode === 'with-jd' && !jdText.trim() && !uploadedJdFile) {
      setError('Please provide a job description (text or file) for comparison analysis.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume_file', uploadedResumeFile);

      let endpoint = 'http://localhost:8000/analyze-resume-file';

      if (analysisMode === 'with-jd') {
        // Analysis with job description
        if (uploadedJdFile) {
          formData.append('job_description_file', uploadedJdFile);
        } else if (jdText.trim()) {
          formData.append('job_description_text', jdText);
        }
      } else {
        // Quick analysis without job description
        endpoint = 'http://localhost:8000/analyze-resume-quick';
      }

      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
      setShowResultsModal(true); // Auto-open modal
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.detail || 'An error occurred while analyzing your resume.');
      } else if (err.request) {
        setError('Could not reach backend. Is it running? (CORS/network error)');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #ecfdf5 100%)',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const backgroundElementStyle1 = {
    position: 'fixed',
    top: '-160px',
    right: '-160px',
    width: '320px',
    height: '320px',
    background: '#bbf7d0',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.3,
    animation: 'pulse 4s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0
  };

  const backgroundElementStyle2 = {
    position: 'fixed',
    bottom: '-160px',
    left: '-160px',
    width: '320px',
    height: '320px',
    background: '#a7f3d0',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.3,
    animation: 'pulse 4s ease-in-out infinite 2s',
    pointerEvents: 'none',
    zIndex: 0
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '4rem',
    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 1s ease-out'
  };

  const iconContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const iconBackgroundStyle = {
    padding: '1rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
    lineHeight: 1.2
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
    alignItems: 'center',
    marginBottom: '5rem'
  };

  const leftSectionStyle = {
    transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 1s ease-out 0.3s'
  };

  const rightSectionStyle = {
    transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 1s ease-out 0.5s'
  };

  const visualCardStyle = {
    position: 'relative',
    margin: '0 auto',
    maxWidth: '400px'
  };

  const visualCardGlowStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '1.5rem',
    filter: 'blur(20px)',
    opacity: 0.2
  };

  const visualCardContentStyle = {
    position: 'relative',
    background: 'white',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #f3f4f6'
  };

  const visualCardInnerStyle = {
    textAlign: 'center'
  };

  const visualIconStyle = {
    width: '6rem',
    height: '6rem',
    margin: '0 auto 1.5rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
    marginBottom: '2rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const cardHoverStyle = {
    ...cardStyle,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-4px)'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const cardIconStyle = {
    padding: '0.75rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem'
  };

  const dropZoneStyle = {
    border: '2px dashed #d1d5db',
    borderRadius: '0.75rem',
    padding: '2rem',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backgroundColor: '#f9fafb'
  };

  const dropZoneActiveStyle = {
    ...dropZoneStyle,
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4'
  };

  const dropZoneSuccessStyle = {
    ...dropZoneStyle,
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    fontWeight: '600',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    marginTop: '1.5rem',
    fontSize: '1rem'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.02)'
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none'
  };

  const textareaStyle = {
    width: '100%',
    padding: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.75rem',
    resize: 'none',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    marginBottom: '1rem'
  };

  const textareaFocusStyle = {
    outline: 'none',
    borderColor: '#10b981',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
  };

  const featuresStyle = {
    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 1s ease-out 0.7s'
  };

  const featuresHeaderStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  };

  const featureCardStyle = {
    textAlign: 'center',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const featureCardHoverStyle = {
    ...featureCardStyle,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-8px)'
  };

  const featureIconStyle = {
    width: '4rem',
    height: '4rem',
    margin: '0 auto 1rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const FileDropZone = ({ inputRef, uploadedFile, setUploadedFile, id }) => (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:bg-gray-50 ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${uploadedFile ? 'border-green-500 bg-green-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={(e) => handleDrop(e, inputRef, setUploadedFile)}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        accept=".pdf,.docx"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, setUploadedFile)}
      />
      {uploadedFile ? (
        <div className="flex flex-col items-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <p className="font-semibold text-green-700">{uploadedFile.name}</p>
          <p className="text-sm text-green-600">File uploaded successfully!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <Upload className="w-12 h-12 text-gray-400" />
          <p className="font-semibold text-gray-700">Drop your resume here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
          <p className="text-xs text-gray-400">Supports PDF, DOCX</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Animated background elements */}
      <div style={backgroundElementStyle1}></div>
      <div style={backgroundElementStyle2}></div>

      <div style={contentStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <div style={iconBackgroundStyle}>
              <Brain size={32} color="white" />
            </div>
          </div>
          <h1 style={titleStyle}>
            Smart ATS Resume Analyzer
          </h1>
          <p style={subtitleStyle}>
            AI-powered resume analysis that thinks like a recruiter and beats the bots
          </p>
        </div>

        {/* Analysis Mode Selection */}
        <div style={{ ...headerStyle, marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setAnalysisMode('quick')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                border: analysisMode === 'quick' ? 'none' : '2px solid #d1d5db',
                background: analysisMode === 'quick' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                color: analysisMode === 'quick' ? 'white' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Zap size={18} />
              Quick ATS Check
            </button>
            <button
              onClick={() => setAnalysisMode('with-jd')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                border: analysisMode === 'with-jd' ? 'none' : '2px solid #d1d5db',
                background: analysisMode === 'with-jd' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                color: analysisMode === 'with-jd' ? 'white' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Target size={18} />
              Job Match Analysis
            </button>

          </div>
        </div>

        {/* Resume Builder CTA Banner */}
        <div style={{
          margin: '2rem auto',
          maxWidth: '1200px',
          padding: '0 1rem',
          animation: isVisible ? 'slideInUp 0.6s ease-out 0.2s both' : 'none'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)',
            borderRadius: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Subtle animated background */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'linear-gradient(45deg, transparent 30%, rgba(16, 185, 129, 0.03) 50%, transparent 70%)',
              animation: 'shimmer 3s ease-in-out infinite'
            }}></div>
            
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              {/* Left side - Icon and text */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem',
                flex: '1',
                minWidth: '300px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                  animation: 'pulse 2s infinite'
                }}>
                  <Edit3 size={28} color="white" />
                </div>
                
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 0.5rem 0',
                    fontFamily: 'Poppins, system-ui, -apple-system, sans-serif'
                  }}>
                    Don't Have a Resume?
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#6b7280',
                    margin: 0,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    Create an ATS-optimized resume with our AI-powered builder
                  </p>
                </div>
              </div>

              {/* Right side - Button */}
              <button
                onClick={() => navigate('/resume-builder')}
                style={{
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                  transform: 'translateY(0)',
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
                }}
              >
                <Plus size={18} />
                Create Resume
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={gridStyle}>
          {/* Left Side - Visual */}
          <div style={leftSectionStyle}>
            <img src={hiringGif} alt="Hiring" className="w-64 h-auto mb-8 rounded-2xl shadow-xl object-contain" style={{maxWidth:'100%'}} />
            <div style={visualCardStyle}>
              <div style={visualCardGlowStyle}></div>
              <div style={visualCardContentStyle}>
                <div style={visualCardInnerStyle}>
                  <div style={visualIconStyle}>
                    {analysisMode === 'quick' ? <Zap size={48} color="white" /> : <Target size={48} color="white" />}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                    {analysisMode === 'quick' ? 'Quick ATS Analysis' : 'Job Match Analysis'}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {analysisMode === 'quick' 
                      ? 'Get instant ATS compatibility score and formatting feedback' 
                      : 'Compare your resume against specific job requirements for better matching'
                    }
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <Brain size={16} />
                      <span>AI-Powered Analysis</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <BarChart3 size={16} />
                      <span>Detailed Scoring</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <Sparkles size={16} />
                      <span>Actionable Suggestions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Upload and Analysis */}
          <div style={rightSectionStyle}>
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ 
                  ...cardIconStyle, 
                  background: analysisMode === 'quick' ? 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)' : 'linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%)'
                }}>
                  {analysisMode === 'quick' ? <Zap size={24} color="#1d4ed8" /> : <Target size={24} color="#059669" />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {analysisMode === 'quick' ? 'Resume Upload' : 'Resume & Job Description'}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    {analysisMode === 'quick' 
                      ? 'Upload your resume for instant ATS analysis' 
                      : 'Upload resume and provide job description for detailed matching'
                    }
                  </p>
                </div>
              </div>
              
              {/* Resume Upload */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Resume File
                </label>
                <FileDropZone 
                  inputRef={resumeFileInput}
                  uploadedFile={uploadedResumeFile}
                  setUploadedFile={setUploadedResumeFile}
                  id="resume"
                />
              </div>

              {/* Job Description Section (only for with-jd mode) */}
              {analysisMode === 'with-jd' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Job Description
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Text input option */}
                    <div>
                      <textarea
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        placeholder="Paste the job description here..."
                        rows={4}
                        style={{
                          ...textareaStyle,
                          borderColor: jdText.trim() ? '#10b981' : '#d1d5db'
                        }}
                      />
                    </div>
                    
                    {/* OR divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>OR</span>
                      <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                    </div>
                    
                    {/* File upload option */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        Upload Job Description File
                      </label>
                      <FileDropZone 
                        inputRef={jdFileInput}
                        uploadedFile={uploadedJdFile}
                        setUploadedFile={setUploadedJdFile}
                        id="job-description"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Analysis Button */}
              <button
                onClick={handleAnalyzeResume}
                disabled={
                  !uploadedResumeFile || 
                  loading || 
                  (analysisMode === 'with-jd' && !jdText.trim() && !uploadedJdFile)
                }
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  opacity: (!uploadedResumeFile || loading || (analysisMode === 'with-jd' && !jdText.trim() && !uploadedJdFile)) ? 0.5 : 1,
                  cursor: (!uploadedResumeFile || loading || (analysisMode === 'with-jd' && !jdText.trim() && !uploadedJdFile)) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      border: '2px solid #ffffff40', 
                      borderTop: '2px solid #ffffff', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    <span>Analyzing with AI...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Brain size={20} />
                    <span>
                      {analysisMode === 'quick' ? 'Analyze Resume' : 'Get Job Match Score'}
                    </span>
                    <ArrowRight size={16} />
                  </div>
                )}
              </button>



              {/* Error Display */}
              {error && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  background: '#fef3c7', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #fcd34d' 
                }}>
                  <p style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: 1.6, margin: 0 }}>
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={featuresStyle}>
          <div style={featuresHeaderStyle}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Why Choose Our AI ATS Analyzer?
            </h2>
            <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Powered by advanced AI technology and insights from real ATS systems
            </p>
          </div>
          
          <div style={featuresGridStyle}>
            {[
              {
                icon: <Brain size={32} color="white" />,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning models analyze your resume like a human recruiter"
              },
              {
                icon: <Target size={32} color="white" />,
                title: "Two Analysis Modes",
                description: "Quick ATS check or detailed job matching - choose what works for you"
              },
              {
                icon: <BarChart3 size={32} color="white" />,
                title: "Comprehensive Scoring",
                description: "Multi-factor scoring system covering format, content, and keyword optimization"
              },
              {
                icon: <Sparkles size={32} color="white" />,
                title: "Actionable Insights",
                description: "Get specific, practical suggestions to improve your ATS compatibility"
              }
            ].map((feature, index) => (
              <div key={index} style={featureCardStyle}>
                <div style={featureIconStyle}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Builder CTA Section */}
        <div style={{
          ...featuresStyle,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '2rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginTop: '4rem',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Edit3 size={32} color="white" />
            </div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              Don't Have a Resume Yet?
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              Create an ATS-optimized resume from scratch with our intelligent resume builder. 
              Get live feedback as you build and ensure maximum compatibility.
            </p>
            <button
              onClick={() => navigate('/resume-builder')}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Plus size={20} />
              Create Your Resume
              <ArrowRight size={20} />
            </button>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              marginTop: '1rem' 
            }}>
              Build → Preview → Analyze → Download in minutes
            </p>
          </div>
        </div>
      </div>

      {/* Modal Overlay for Results */}
      {result && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem',
          backdropFilter: 'blur(8px)'
        }}>
          {/* Modal Card */}
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #f3f4f6',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setResult(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: '#6b7280',
                zIndex: 10,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#374151';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.color = '#6b7280';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>

            {/* Card Header */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              padding: '2rem 2rem 1.5rem 2rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                   Resume Analysis Results
                </h3>
                {result.aiAnalysis?.inferredRole && (
                  <p style={{ fontSize: '1rem', color: '#059669', margin: 0, fontWeight: '500' }}>
                    Detected Role: {result.aiAnalysis.inferredRole}
                  </p>
                )}
              </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="results-grid" style={{ padding: '2rem' }}>
              
              {/* Left Side - Score Section */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center'
              }}>
                {/* Main Score Display */}
                {result.hasJobDescription && result.skillsAnalysis?.keywordMatchPercentage !== undefined ? (
                  // Job Match Analysis - Show Match Percentage
                  <>
                    <div style={{
                      fontSize: '5rem',
                      fontWeight: 'bold',
                      background: `linear-gradient(135deg, ${
                        result.skillsAnalysis.keywordMatchPercentage >= 80 ? '#059669, #10b981' :
                        result.skillsAnalysis.keywordMatchPercentage >= 60 ? '#0891b2, #06b6d4' :
                        result.skillsAnalysis.keywordMatchPercentage >= 40 ? '#ea580c, #f97316' : '#dc2626, #ef4444'
                      })`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '1rem',
                      lineHeight: 1
                    }}>
                      {Math.round(result.skillsAnalysis.keywordMatchPercentage)}%
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}>
                      Job Match Score
                    </div>
                    <div style={{ 
                      fontSize: '1.125rem', 
                      color: '#6b7280', 
                      padding: '0.75rem 1.5rem',
                      background: 'white',
                      borderRadius: '2rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      ATS Score: {result.totalScore}/100 ({result.scoreCategory})
                    </div>
                  </>
                ) : (
                  // Quick Analysis - Show ATS Score
                  <>
                    <div style={{
                      fontSize: '5rem',
                      fontWeight: 'bold',
                      background: `linear-gradient(135deg, ${
                        result.totalScore >= 80 ? '#059669, #10b981' :
                        result.totalScore >= 65 ? '#0891b2, #06b6d4' :
                        result.totalScore >= 45 ? '#ea580c, #f97316' : '#dc2626, #ef4444'
                      })`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '1rem',
                      lineHeight: 1
                    }}>
                      {result.totalScore}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}>
                      ATS Compatibility Score
                    </div>
                    <div style={{ 
                      fontSize: '1.125rem', 
                      color: '#6b7280',
                      padding: '0.75rem 1.5rem',
                      background: 'white',
                      borderRadius: '2rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      {result.scoreEmoji} {result.scoreCategory}
                    </div>
                  </>
                )}

                {/* Score Breakdown */}
                {result.scoreBreakdown && (
                  <div style={{
                    marginTop: '2rem',
                    width: '100%',
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h5 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem', textAlign: 'center' }}>
                      📊 Score Breakdown
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>AI Base</div>
                        <div style={{ color: '#6b7280', fontSize: '1.25rem', fontWeight: 'bold' }}>{result.scoreBreakdown.ai_base_score}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>Sections</div>
                        <div style={{ color: '#059669', fontSize: '1.25rem', fontWeight: 'bold' }}>+{result.scoreBreakdown.section_bonus}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>Content</div>
                        <div style={{ color: '#059669', fontSize: '1.25rem', fontWeight: 'bold' }}>+{result.scoreBreakdown.content_bonus}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>Format</div>
                        <div style={{ color: '#dc2626', fontSize: '1.25rem', fontWeight: 'bold' }}>-{result.scoreBreakdown.formatting_penalty}</div>
                      </div>
                      {result.scoreBreakdown.suggestion_penalty > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>Issues</div>
                          <div style={{ color: '#dc2626', fontSize: '1.25rem', fontWeight: 'bold' }}>-{result.scoreBreakdown.suggestion_penalty}</div>
                        </div>
                      )}
                      {result.scoreBreakdown.missing_section_penalty > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>Missing</div>
                          <div style={{ color: '#dc2626', fontSize: '1.25rem', fontWeight: 'bold' }}>-{result.scoreBreakdown.missing_section_penalty}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Analysis & Suggestions */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                
                {/* Resume Sections */}
                {result.detectedSections && (
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        📋
                      </div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        Resume Sections
                      </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                      {result.detectedSections.present.map((section, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#059669', fontWeight: '500', fontSize: '1.125rem' }}>✓</span>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>{section}</span>
                        </div>
                      ))}
                      {result.detectedSections.missing.map((section, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#dc2626', fontWeight: '500', fontSize: '1.125rem' }}>✗</span>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords Card */}
                {result.skillsAnalysis && result.skillsAnalysis.matchedKeywords.length > 0 && (
                  <div style={{
                    background: '#f0fdf4',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #dcfce7'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                          {result.hasJobDescription ? 'Keyword Match' : 'Skills Found'}
                        </h4>
                        {result.skillsAnalysis.keywordMatchPercentage && (
                          <p style={{ fontSize: '0.875rem', color: '#059669', margin: 0 }}>
                            {Math.round(result.skillsAnalysis.keywordMatchPercentage)}% match rate
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {result.skillsAnalysis.matchedKeywords.slice(0, 10).map((keyword, index) => (
                        <span key={index} style={{
                          padding: '0.5rem 1rem',
                          background: '#f0f9ff',
                          color: '#0369a1',
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          border: '1px solid #e0f2fe'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div style={{
                    background: '#fffbeb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #fde68a',
                    flex: 1
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        💡
                      </div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        Key Improvements ({result.suggestions.length})
                      </h4>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {result.suggestions.slice(0, 8).map((suggestion, index) => (
                        <div key={index} style={{
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '0.5rem',
                          marginBottom: '0.75rem',
                          borderLeft: '3px solid #f59e0b'
                        }}>
                          <p style={{ 
                            fontSize: '0.875rem', 
                            color: '#374151', 
                            margin: 0,
                            lineHeight: 1.5
                          }}>
                            {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer - Action Buttons */}
            <div style={{
              background: '#f9fafb',
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              {result.markdownReport && (
                <button
                  onClick={() => setShowDetailedReport(!showDetailedReport)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <FileText size={16} />
                  {showDetailedReport ? 'Hide' : 'Show'} Detailed Report
                </button>
              )}
              <button
                onClick={() => setResult(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                Close Results
              </button>
            </div>

            {/* Detailed Report Modal */}
            {showDetailedReport && result.markdownReport && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                overflowY: 'auto',
                padding: '2rem',
                zIndex: 20
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setShowDetailedReport(false)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      color: '#6b7280'
                    }}
                  >
                    ×
                  </button>
                  <div style={{
                    borderBottom: '2px solid #f3f4f6',
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.75rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: 0,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      📄 Detailed Analysis Report
                    </h3>
                  </div>
                  <div className="report-content" style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    {renderFormattedReport(cleanMarkdownReport(result.markdownReport))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add CSS for animations and responsive design */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          min-height: 400px;
        }
        
        @media (max-width: 1024px) {
          .results-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            min-height: auto;
          }
        }

        @media (max-width: 768px) {
          .resume-banner {
            flex-direction: column !important;
            text-align: center !important;
          }
          .resume-banner h3 {
            font-size: 1.25rem !important;
          }
          .resume-banner p {
            font-size: 0.875rem !important;
          }
          .resume-banner button {
            padding: 0.75rem 1.5rem !important;
            font-size: 0.925rem !important;
          }
        }
        
        /* Modal scrollbar styling */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }
        
        .modal-content::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        .modal-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Report content scrollbar styling */
        .report-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .report-content::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        
        .report-content::-webkit-scrollbar-thumb {
          background: #059669;
          border-radius: 3px;
        }
        
        .report-content::-webkit-scrollbar-thumb:hover {
          background: #047857;
        }
        
        /* Text selection styling */
        .report-content ::selection {
          background: rgba(5, 150, 105, 0.2);
          color: inherit;
        }
      `}</style>
    </div>
  );
}

export default ATSResume;