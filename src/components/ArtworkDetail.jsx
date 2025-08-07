import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Gallery.css';

const ArtworkDetail = ({ artworks, interests, setInterests }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [interestForm, setInterestForm] = useState({ name: '', email: '', message: '' });

  // Trouver l'œuvre par ID
  const artwork = artworks.find((art, index) => index.toString() === id);
  const artworkIndex = artworks.findIndex((art, index) => index.toString() === id);

  if (!artwork) {
    return (
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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

  const handleLike = () => {
    const updatedArtworks = [...artworks];
    updatedArtworks[artworkIndex] = {
      ...updatedArtworks[artworkIndex],
      likes: (updatedArtworks[artworkIndex].likes || 0) + 1
    };
    localStorage.setItem('nart_artworks', JSON.stringify(updatedArtworks));
    
    // Recharger la page pour voir le changement
    window.location.reload();
  };

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    
    const newInterest = {
      artIdx: artworkIndex,
      artTitle: artwork.title,
      name: interestForm.name,
      email: interestForm.email,
      message: interestForm.message,
      timestamp: new Date().toISOString()
    };
    
    const updatedInterests = [...interests, newInterest];
    setInterests(updatedInterests);
    localStorage.setItem('nart_interests', JSON.stringify(updatedInterests));
    
    // Aussi sauvegarder les œuvres mises à jour si nécessaire
    const updatedArtworks = [...artworks];
    localStorage.setItem('nart_artworks', JSON.stringify(updatedArtworks));
    
    setShowInterestForm(false);
    setInterestForm({ name: '', email: '', message: '' });
    alert('✅ Merci pour votre intérêt ! L\'artiste sera contacté.');
  };

  return (
    <div style={{
      background: `
        linear-gradient(135deg, rgba(248, 246, 242, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%),
        radial-gradient(circle at 15% 20%, rgba(161, 60, 47, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 85% 80%, rgba(161, 60, 47, 0.06) 0%, transparent 50%),
        linear-gradient(45deg, #f8f6f2 0%, #ffffff 50%, #f0ede7 100%)
      `,
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Bouton retour */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '0.8rem 1.5rem',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Retour à la galerie
        </button>
      </div>

      {/* Contenu principal */}
      <div 
        className="artwork-detail-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)',
          gap: '3rem',
          alignItems: 'start'
        }}
      >
        {/* Image de l'œuvre */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(161, 60, 47, 0.12)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <img 
            src={artwork.image} 
            alt={artwork.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: '15px',
              boxShadow: '0 15px 40px rgba(161, 60, 47, 0.15)'
            }}
          />
        </div>

        {/* Informations de l'œuvre */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(161, 60, 47, 0.12)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            color: '#2c2c2c',
            marginBottom: '1.5rem',
            letterSpacing: '0.02em',
            lineHeight: '1.2'
          }}>
            {artwork.title}
          </h1>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.7',
            color: '#555',
            marginBottom: '2rem',
            fontFamily: "'Roboto', sans-serif"
          }}>
            {artwork.description}
          </p>

          {/* Statistiques */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #a13c2f10 0%, #a13c2f20 100%)',
              padding: '1rem 1.5rem',
              borderRadius: '15px',
              textAlign: 'center',
              border: '1px solid rgba(161, 60, 47, 0.2)'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a13c2f' }}>
                ❤️ {artwork.likes || 0}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
                J'adore
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleLike}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '1rem 1.5rem',
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(161, 60, 47, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ❤️ J'adore
            </button>

            <button
              onClick={() => setShowInterestForm(true)}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '1rem 1.5rem',
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(44, 62, 80, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              💌 Intéressé(e)
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire d'intérêt */}
      {showInterestForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
            minWidth: '400px',
            maxWidth: '90vw',
            position: 'relative'
          }}>
            <h3 style={{
              marginBottom: '1.5rem',
              color: '#a13c2f',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem'
            }}>
              Exprimer votre intérêt
            </h3>
            
            <form onSubmit={handleInterestSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={interestForm.name}
                  onChange={(e) => setInterestForm({...interestForm, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '2px solid #e0ddd6',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.2rem' }}>
                <input
                  type="email"
                  placeholder="Votre email"
                  value={interestForm.email}
                  onChange={(e) => setInterestForm({...interestForm, email: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '2px solid #e0ddd6',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Message (optionnel)"
                  value={interestForm.message}
                  onChange={(e) => setInterestForm({...interestForm, message: e.target.value})}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '2px solid #e0ddd6',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Envoyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowInterestForm(false)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '10px',
                    background: '#f0f0f0',
                    color: '#666',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          .artwork-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ArtworkDetail;
