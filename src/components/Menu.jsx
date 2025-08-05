import React from "react";
import "../styles/Menu.css";

const Menu = ({ isAdmin, onShowMessages, unreadCount = 0 }) => {
  return (
    <nav className="menu inspired-menu">
      <div className="logo-container">
        <img src="/nart-logo.png" alt="Nart Logo" className="logo small-logo" />
      </div>
      <ul className="menu-links horizontal-links">
        <li>Accueil</li>
        <li>Galerie</li>
        <li>À propos</li>
        {isAdmin && (
          <li style={{cursor: 'pointer', fontWeight: 'bold', color: '#a13c2f', position: 'relative'}} onClick={onShowMessages}>
            Messages
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </li>
        )}
      </ul>
      <div className="menu-contact">
        <button className="contact-btn">Nous contacter</button>
      </div>
    </nav>
  );
};

export default Menu;
