import React from 'react';
import './BenefitsGrid.css';

const features = [
  {
    title: 'AI Resume Builder',
    desc: 'Generate ATS-optimized resumes instantly with real-time suggestions and modern templates.',
  },
  {
    title: 'Smart Job Aggregator',
    desc: 'Fetch job listings from multiple trusted sources and match them based on your profile.',
  },
  {
    title: 'Mock Interviews',
    desc: 'Practice interviews with our AI avatar, get detailed feedback on your performance.',
  },
  {
    title: 'Behavioral Insights',
    desc: 'Get guidance on how you present yourself and improve confidence through body language feedback.',
  },
  {
    title: 'Track Job Progress',
    desc: 'Manage applied jobs, interview schedules, and follow-ups in one dashboard.',
  },
  {
    title: 'Real Recruiter Outreach',
    desc: 'Automatically match and send resumes to a network of recruiters weekly.',
  },
];

function BenefitsGrid() {
  return (
    <section className="benefits-section">
      <h2 className="benefits-heading">This resume builder actually gets you the job</h2>
      <div className="benefits-grid">
        {features.map((feature, index) => (
          <div className="benefit-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsGrid;
