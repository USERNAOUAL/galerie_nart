import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { getAssetPath } from '../utils/assetUtils';
import "../styles/Menu.css";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="menu inspired-menu">
      <div 
        className="logo-container" 
        onClick={() => navigate('/')} 
        style={{ 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          visibility: 'visible',
          opacity: 1
        }}
      >
        <img 
          src={getAssetPath('nart-logo.png')} 
          alt="Nart Logo" 
          className="logo small-logo"
          style={{
            height: '80px',
            width: 'auto',
            display: 'block',
            visibility: 'visible',
            opacity: 1
          }}
        />
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
          onClick={() => {
            navigate('/');
            // Scroll vers la section galerie après un petit délai pour s'assurer que la page est chargée
            setTimeout(() => {
              const gallerySection = document.querySelector('.gallery-container');
              if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }} 
          style={{ 
            cursor: 'pointer',
            color: location.pathname === '/' ? '#a13c2f' : '#222'
          }}
        >
          Galerie
        </li>
        <li 
          onClick={() => navigate('/about')} 
          style={{ 
            cursor: 'pointer',
            color: location.pathname === '/about' ? '#a13c2f' : '#222',
            fontWeight: location.pathname === '/about' ? 'bold' : 'normal'
          }}
        >
          À propos
        </li>
      </ul>
      <div className="menu-contact">
        <button className="contact-btn">Nous contacter</button>
      </div>
    </nav>
  );
};

export default Menu;
