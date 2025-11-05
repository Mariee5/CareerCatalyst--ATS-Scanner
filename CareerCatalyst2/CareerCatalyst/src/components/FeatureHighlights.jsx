import React from 'react';
import './FeatureHighlights.css';

const features = [
  {
    title: 'Recruiter Outreach',
    desc: 'Auto-match your resume with 50+ recruiters each week. Let the right job come to you.',
  },
  {
    title: 'Interview Prep',
    desc: 'Practice common questions in real time with AI-driven feedback and performance tips.',
  },
  {
    title: 'Career Coaching',
    desc: 'Avoid costly mistakes. Get expert help to position your strengths better and negotiate offers.',
  },
];

function FeatureHighlights() {
  return (
    <section className="feature-section">
      <h2 className="feature-heading">This Resume Builder Actually Gets You the Job</h2>
      <div className="feature-cards">
        {features.map((f, index) => (
          <div className="feature-card" key={index}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureHighlights;
