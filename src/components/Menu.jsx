import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/Menu.css";

const Menu = ({ isAdmin, onShowMessages, unreadCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="menu inspired-menu">
      <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src="/nart-logo.png" alt="Nart Logo" className="logo small-logo" />
      </div>
      <ul className="menu-links horizontal-links">
        <li 
          onClick={() => navigate('/')} 
          style={{ 
            cursor: 'pointer',
            color: location.pathname === '/' ? '#a13c2f' : '#222',
            fontWeight: location.pathname === '/' ? 'bold' : 'normal'
          }}
        >
          Accueil
        </li>
        <li 
          onClick={() => navigate('/')} 
          style={{ 
            cursor: 'pointer',
            color: location.pathname === '/' ? '#a13c2f' : '#222'
          }}
        >
          Galerie
        </li>
        <li 
          style={{ 
            cursor: 'pointer', 
            color: '#a13c2f'
          }}
        >
          À propos
        </li>
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
