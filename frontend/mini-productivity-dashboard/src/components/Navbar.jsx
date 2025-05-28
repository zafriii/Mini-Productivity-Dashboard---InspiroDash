import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './styles/Navbar.css';
import { useAuth } from '../store/Auth';
import { ThemeContext } from '../App';

import { TbMoon } from "react-icons/tb";
import { FaRegSun } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedin, LogoutUser } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    LogoutUser();
    toggleMenu();
  };

  return (
    <nav className={`nav ${theme}`}>
      <div className="navlogo">
        <NavLink to="/">
          <img src="/images/logo.png" alt="Logo" className="navlogo-img" />
          InspiroDash
        </NavLink>
      </div>

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? (
            <span className="theme-icon"><TbMoon size={25}/></span>
          ) : (
            <span className="theme-icon"><FaRegSun size={25}/></span>
          )}
        </button>

        {isLoggedin ? (
          <NavLink to="/login">
            <button className="button" onClick={handleLogout}>
              <span>Logout</span>
            </button>
          </NavLink>
        ) : (
          <NavLink to="/login">
            <button className="button" onClick={toggleMenu}>
              <span>Login</span>
            </button>
          </NavLink>
        )}
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`bar-link ${isMenuOpen ? 'open' : ''}`} />
        <div className={`bar-link ${isMenuOpen ? 'open' : ''}`} />
        <div className={`bar-link ${isMenuOpen ? 'open' : ''}`} />
      </div>
    </nav>
  );
}

export default Navbar;