import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArtworkImage = ({ artworks }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Trouver l'œuvre par ID
  const artwork = artworks.find((art, index) => index.toString() === id);

  if (!artwork) {
    return (
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f8f6f2'
      }}>
        <h2 style={{ color: '#a13c2f', marginBottom: '1rem' }}>Œuvre non trouvée</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '1rem 2rem',
            borderRadius: '25px',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ← Retour à la galerie
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '2rem'
      }}
      onClick={() => navigate('/')}
    >
      {/* Bouton retour discret */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigate('/');
        }}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          padding: '0.8rem 1.2rem',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '0.9rem',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 1)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.9)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        ← Retour
      </button>

      {/* Titre discret */}
      <h1 style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: '300',
        textAlign: 'center',
        margin: 0,
        padding: '1rem 2rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        {artwork.title}
      </h1>

      {/* Image principale - centrée et optimisée */}
      <img 
        src={artwork.image} 
        alt={artwork.title}
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
      />

      {/* Instruction discrète */}
      <p style={{
        position: 'fixed',
        top: '50%',
        right: '2rem',
        transform: 'translateY(-50%)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.9rem',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '300'
      }}>
        Cliquer pour retourner
      </p>
    </div>
  );
};

export default ArtworkImage;
