import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';
import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section about">
          <h3>InspiroDash</h3>
          <p>Track your tasks, set meaningful goals, and stay inspired every day with InspiroDash.</p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} InspiroDash. All Rights Reserved | Designed by Niha 
      </div>
    </footer>
  );
};

export default Footer;
