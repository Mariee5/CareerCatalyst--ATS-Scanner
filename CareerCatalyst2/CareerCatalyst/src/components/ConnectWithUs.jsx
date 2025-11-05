import React from 'react';
import './ConnectWithUs.css';
import connectImg from '../assets/connect.svg';

function ConnectWithUs() {
  return (
    <section className="connect-section" id="connect">
      <div className="connect-container">
        <div className="connect-text">
          <h2>Connect With Us</h2>
          <p>
            Whether you're a job seeker, recruiter, university partner, or just someone with questions —
            we're here to talk. Reach out for collaborations, career support, or platform queries.
          </p>
          <div className="connect-details">
            <div>
              <h4>📩 General Inquiries</h4>
              <p>For questions or support, email us at <strong>hello@careercatalyst.ai</strong></p>
            </div>
            <div>
              <h4>🤝 Business Collaborations</h4>
              <p>Partner with us for outreach, workshops, and employer-institute bridges. Whether you're an HR head or a campus coordinator, we're open to creative synergies.</p>
            </div>
            <div>
              <h4>💬 Chat With Support</h4>
              <p>Our support desk is available Mon–Sat, 10 AM to 6 PM IST, ready to answer your questions in real-time via live chat or email follow-ups.</p>
            </div>
          </div>
          <button className="connect-btn">Send Us a Message</button>
        </div>
        <div className="connect-graphic">
          <img src={connectImg} alt="Connect Illustration" />
        </div>
      </div>
    </section>
  );
}

export default ConnectWithUs;
