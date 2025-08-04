import React from "react";
import "../styles/Menu.css";

const Menu = ({ isAdmin, onShowMessages }) => {
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
          <li style={{cursor: 'pointer', fontWeight: 'bold', color: '#a13c2f'}} onClick={onShowMessages}>Messages</li>
        )}
      </ul>
      <div className="menu-contact">
        <button className="contact-btn">Nous contacter</button>
      </div>
    </nav>
  );
};

export default Menu;
