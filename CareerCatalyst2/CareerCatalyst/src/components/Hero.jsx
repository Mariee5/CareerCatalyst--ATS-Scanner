import React from 'react';
import { useNavigate } from 'react-router-dom';
import frontpageImage from '../assets/frontpage.png';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="hero-container" id="hero">
      <div className="hero-background">
        <img src={frontpageImage} alt="Career Background" className="hero-bg-image" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-box">
          <h1>Unlock Your Potential with <span>Career Catalyst</span></h1>
          <p>
            Your journey to professional success starts here. Explore AI-powered resources,
            connect with experts, and discover opportunities that align with your
            career aspirations.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn primary"
              onClick={() => navigate('/ats')}
            >
              Start ATS Analysis
            </button>
            <button 
              className="btn secondary"
              onClick={() => navigate('/jobs')}
            >
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
