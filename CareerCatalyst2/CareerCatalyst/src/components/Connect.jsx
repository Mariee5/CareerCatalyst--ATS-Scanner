import React from 'react';
import './Connect.css';

function Connect() {
  return (
    <section className="connect-section" id="connect">
      <div className="connect-container">
        <h2 className="connect-heading">Connect With Us</h2>
        <p className="connect-description">
          Whether you're looking for career advice, want to partner, or simply curious about our platform, we’d love to hear from you. Our team is here to help you grow your career every step of the way.
        </p>
        <div className="connect-grid">
          <div className="connect-card">
            <h3>Support & Queries</h3>
            <p>Email us at <a href="mailto:support@careercatalyst.com">support@careercatalyst.com</a> or use our contact form for any assistance.</p>
          </div>
          <div className="connect-card">
            <h3>Partnerships</h3>
            <p>Interested in collaborating? We’re open to working with job boards, universities, and recruiters.</p>
          </div>
          <div className="connect-card">
            <h3>Feedback</h3>
            <p>Help us improve! Share what you love and what could be better. We value every word.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Connect;
