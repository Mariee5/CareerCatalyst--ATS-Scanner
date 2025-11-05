import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">Career Catalyst</div>
      <ul className="navbar-links">
        <li><Link to="hero" smooth={true} duration={500}>Home</Link></li>
        <li><Link to="resume" smooth={true} duration={500}>Resume</Link></li>
        <li><Link to="search" smooth={true} duration={500}>Jobs</Link></li>
        <li><Link to="interview" smooth={true} duration={500}>Interview</Link></li>
        <li><Link to="success" smooth={true} duration={500}>Success</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
