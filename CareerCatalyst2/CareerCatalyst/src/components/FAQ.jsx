import React from 'react';
import './FAQ.css';

const faqs = [
  {
    question: 'How does Career Catalyst improve my job search?',
    answer:
      'Career Catalyst streamlines your entire job-seeking process. It helps you build an ATS-optimized resume, discovers relevant job openings from across the internet, prepares you for interviews using AI, and keeps everything organized in one dashboard — making your journey seamless.',
  },
  {
    question: 'Is the resume builder ATS-friendly?',
    answer:
      'Yes, Career Catalyst’s resume builder is fully ATS-compliant. It uses structured templates, clean formatting, and relevant keywords to ensure your resume can be read by applicant tracking systems — increasing your chances of getting shortlisted by employers significantly.',
  },
  {
    question: 'Can I track my job applications on the platform?',
    answer:
      'Absolutely. Our job tracker allows you to manage all your applications in one place. You can view applied roles, interview schedules, follow-up statuses, and recruiter interactions — keeping you informed and organized throughout your job search journey.',
  },
  {
    question: 'What is the AI interview simulator?',
    answer:
      'The AI-powered simulator mimics real interview settings using a virtual interviewer. It evaluates your speech clarity, confidence, tone, and body language. You get instant feedback and tips — helping you build confidence and perform better in actual interviews.',
  },
  {
    question: 'Is Career Catalyst free to use?',
    answer:
      'Career Catalyst offers both free and premium plans. The free tier includes resume building and job search features. Premium plans unlock recruiter outreach, interview analytics, priority support, and more — making it ideal for users seeking advanced career tools.',
  },
];

function FAQ() {
  return (
    <section className="faq-section" id="faq">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
