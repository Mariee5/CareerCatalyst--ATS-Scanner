import React from 'react';
import resumeImg from '../assets/resume.png';
import searchImg from '../assets/search.png';
import interviewImg from '../assets/Interview.png';
import dealImg from '../assets/deal.png';
import './Journey.css';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    img: resumeImg,
    title: 'Build a Winning Resume',
    desc: 'Craft a visually appealing and ATS-optimized resume using our AI-driven builder. Choose from modern templates, get real-time suggestions, and highlight your strengths to stand out in today\'s competitive job market - all with zero hassle.',
    btnText: 'Build Your ATS Resume',
    btnLink: 'resume',
    isExternal: false,
  },
  {
    img: searchImg,
    title: 'Find the Right Opportunities',
    desc: 'Discover jobs tailored to your skills and interests. Our intelligent aggregator pulls listings from top platforms, filters duplicates, and matches you with roles that truly fit - saving you time and improving your chances of landing interviews.',
    btnText: 'Start Job Hunting',
    btnLink: 'search',
    isExternal: false,
  },
  {
    img: interviewImg,
    title: 'Practice for Interviews',
    desc: 'Sharpen your interview skills with our AI-powered mock interview simulator. Get instant feedback on your tone, confidence, and clarity while practicing real questions - so you can walk into interviews prepared, polished, and ready to impress.',
    btnText: 'Train with AI',
    btnLink: 'interview',
    isExternal: false,
  },
  {
    img: dealImg,
    title: 'Land Your Dream Job',
    desc: 'Celebrate your success with confidence. From the first resume draft to the final handshake, Career Catalyst supports you at every stage of the journey - ensuring you don\'t just find a job, but the right one for you.',
    btnText: 'View Success Stories',
    btnLink: 'success',
    isExternal: false,
  },
];

function Journey() {
  const navigate = useNavigate();

  return (
    <section className="journey-section">
      <h2 className="journey-heading">Your Journey with Career Catalyst</h2>
      {steps.map((step, index) => (
        <div
          className={`journey-step ${index % 2 === 0 ? 'left' : 'right'}`}
          key={index}
        >
          <img src={step.img} alt={step.title} />
          <div className="journey-text">
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            {step.title === 'Find the Right Opportunities' ? (
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => navigate('/jobs')}
                  className="btn black"
                  style={{
                    display: 'inline-block',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  Open Job Aggregator
                </button>
              </div>
            ) : step.title === 'Build a Winning Resume' ? (
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => navigate('/ats')}
                  className="btn black"
                  style={{
                    display: 'inline-block',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  Build Your ATS Resume
                </button>
              </div>
            ) : (
              <Link
                to={step.btnLink}
                smooth={true}
                duration={600}
                className="btn primary"
                style={{
                  marginTop: '1rem',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}
              >
                {step.btnText}
              </Link>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Journey;
