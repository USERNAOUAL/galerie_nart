import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f6f2 0%, #ffffff 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '25px',
        padding: '3rem',
        boxShadow: '0 25px 70px rgba(161, 60, 47, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <img 
            src="/nart-logo.png" 
            alt="N'ART Logo" 
            style={{ 
              height: '80px', 
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          />
          <h1 style={{
            fontSize: '2.5rem',
            fontFamily: "'Playfair Display', serif",
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '0.5rem'
          }}>
            Administration N'ART
          </h1>
          <p style={{
            color: '#5a6c7d',
            fontSize: '1.1rem',
            fontFamily: "'Roboto', sans-serif"
          }}>
            Gestion des œuvres et des messages d'intérêt
          </p>
        </div>

        {/* Instructions pour le système de fichiers */}
        <div style={{
          background: 'rgba(161, 60, 47, 0.05)',
          padding: '2rem',
          borderRadius: '15px',
          border: '1px solid rgba(161, 60, 47, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#a13c2f',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            marginBottom: '1rem'
          }}>
            📁 Système de Gestion par Fichiers
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>🎨 Gestion des Œuvres</h3>
            <p style={{ color: '#5a6c7d', lineHeight: '1.6' }}>
              Pour ajouter/modifier des œuvres, éditez le fichier : 
              <code style={{ 
                background: '#f5f5f5', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                /public/artworks/config.yaml
              </code>
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>💌 Messages d'Intérêt</h3>
            <p style={{ color: '#5a6c7d', lineHeight: '1.6' }}>
              Les messages sont automatiquement sauvegardés dans : 
              <code style={{ 
                background: '#f5f5f5', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                /public/artworks/interactions.yaml
              </code>
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>🔧 Console Développeur</h3>
            <p style={{ color: '#5a6c7d', lineHeight: '1.6' }}>
              Ouvrez la console du navigateur (F12) pour voir les interactions en format YAML à copier/coller.
            </p>
          </div>
        </div>

        {/* Actions disponibles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate('/?mode=admin')}
            style={{
              padding: '1.5rem',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(161, 60, 47, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(161, 60, 47, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(161, 60, 47, 0.3)';
            }}
          >
            🎨 Voir la Galerie en Mode Admin
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              padding: '1.5rem',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(44, 62, 80, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(44, 62, 80, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(44, 62, 80, 0.3)';
            }}
          >
            👁️ Voir la Galerie Publique
          </button>
        </div>

        {/* Informations importantes */}
        <div style={{
          background: 'rgba(44, 62, 80, 0.05)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(44, 62, 80, 0.1)'
        }}>
          <h3 style={{
            color: '#2c3e50',
            marginBottom: '1rem',
            fontFamily: "'Playfair Display', serif"
          }}>
            ℹ️ Informations Importantes
          </h3>
          <ul style={{
            color: '#5a6c7d',
            lineHeight: '1.8',
            paddingLeft: '1.5rem'
          }}>
            <li>Les images doivent être placées dans <code>/public/artworks/</code></li>
            <li>Les interactions sont sauvegardées automatiquement</li>
            <li>Le mode admin est accessible via l'URL : <code>/admin</code></li>
            <li>Consultez la console pour le format YAML des interactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
