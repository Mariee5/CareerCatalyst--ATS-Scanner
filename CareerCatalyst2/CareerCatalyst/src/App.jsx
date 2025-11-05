import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Journey from './components/Journey';
import FeatureHighlights from './components/FeatureHighlights';
import BenefitsGrid from './components/BenefitsGrid';
import Connect from './components/Connect';
import JobSearch from './components/JobSearch';
import JobAggregator from './components/JobAggregator';
import ATSResume from './pages/ATSResume';
import ResumeBuilder from './pages/ResumeBuilder';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Journey />
      <FeatureHighlights />
      <BenefitsGrid />
      <Connect />
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Success Stories</h2>
        <p>Coming soon: Read how Career Catalyst helped users land their dream jobs.</p>
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobAggregator />} />
        <Route path="/ats" element={<ATSResume />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
