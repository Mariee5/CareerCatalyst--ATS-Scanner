import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Career Catalyst</h1>
      <p>Welcome to your AI-powered job-seeking assistant.</p>
      <button onClick={() => navigate('/ats')}>Build your ATS resume</button>
    </div>

    
    
  );
}

export default Home;
