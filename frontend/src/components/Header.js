import React from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-top">
        {user && (
          <div className="user-info">
            <span className="user-greeting">Hello, {user.firstName}!</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
      
      {/* Costco Logo SVG */}
      <svg className="costco-logo" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="280" height="60" rx="8" fill="#0051BA" stroke="#003D8F" strokeWidth="2"/>
        <text x="150" y="52" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">
          COSTCO
        </text>
      </svg>
      
      <h1>Food Court Nutrition Tracker</h1>

      <nav className="navbar">
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Find Food
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Cart
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;