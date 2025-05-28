import React from 'react';
import { NavLink } from 'react-router-dom';
import './styles/HeroSection.css';
import MotivationalQuote from './MotivationalQuote';
import { useAuth } from '../store/Auth';

const HeroSection = () => {


  const { isLoggedin } = useAuth();


  return (
    <>
      <section className="hero-container">
        <div className="hero-text">
          <h1>
            Welcome to <span>InspiroDash</span>
          </h1>
          <p>
            Your personal dashboard to manage tasks, set goals, and get daily inspiration.
          </p>
        </div>

        <div className="get-started">
        <NavLink to={isLoggedin ? "/tasks" : "/login"}>
          <button className="get-started-btn">Get Started</button>
        </NavLink>
      </div>


      <MotivationalQuote />

      <section className="appshow-container">
      <div className="appshow-text">
        <h1 className="appshow-title"> Stay Focused with InspiroDash</h1>
        <p className="appshow-subtitle">
          Track your daily progress with ease — manage tasks, monitor goals, and stay productive every day.
        </p>
       
      </div>
  
      <div className="appshow-image-wrapper">
      <div className="image-stack">
        <img
          src="/images/app2.png"
          alt="Main App"
          className="image-main"
        />
        <img
          src="/images/app.png"
          alt="Overlay App"
          className="image-overlay"
        />
      </div>
    </div>

    </section>





        <div className="features-intro">
          <h2>✨ Features of InspiroDash</h2>
          <p>Empower your daily routine with these helpful tools built just for you.</p>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>📋 Daily Tasks</h3>
            <p>Stay organized and focused by managing your daily to-dos efficiently.</p>
          </div>
          <div className="feature-card">
            <h3>🎯 Goal Setting</h3>
            <p>Define weekly/monthly goals and track your personal growth consistently.</p>
          </div>
          <div className="feature-card">
            <h3>💡 Daily Motivation</h3>
            <p>Start each day with a powerful motivational quote from real APIs.</p>
          </div>
        </div>

        <div className="glance-section">
            <h2>Let’s take a look at what you can do with InspiroDash</h2>
            <div className="glance-buttons">
                <button className="glance-btn tasks">Manage Your Daily Tasks</button>
                <button className="glance-btn goals">Complete Weekly & Monthly Goals</button>
                <button className="glance-btn motivation">Get Daily Motivation</button>
            </div>
        </div>



        <div className="why-section">
        <div className="why-left">
          <h2>🌟 Why InspiroDash?</h2>
          <p>
            We understand how overwhelming life can be. InspiroDash is built to help you stay
            positive, productive, and in control. With a simple interface and inspiring design,
            you'll find the motivation to take on each day.
          </p>

        {isLoggedin && (
        <NavLink to="/tasks">
          <button className="button-dashboard">
            <span>Go to Dashboard</span>
          </button>
        </NavLink>
      )}

        </div>
      
        <div className="why-right">
        <div className="step">
          <div className="circle">1</div>
          <div className="step-text">Boost your focus and energy</div>
        </div>
        <div className="step">
          <div className="circle">2</div>
          <div className="step-text">Stay accountable with your goals</div>
        </div>
        <div className="step">
          <div className="circle">3</div>
          <div className="step-text">Feel inspired every single day</div>
        </div>
      </div>

        </div>


        
      </section>
    </>
  );
};

export default HeroSection;
