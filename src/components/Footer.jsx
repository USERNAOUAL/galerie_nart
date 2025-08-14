import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #8b2f23 100%)',
      color: 'white',
      padding: '3rem 2rem',
      marginTop: '4rem',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Effet décoratif d'arrière-plan subtil */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(139, 119, 78, 0.1)',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Section principale du footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 
            ? '1fr' 
            : 'repeat(3, 1fr)',
          gap: window.innerWidth <= 768 ? '2rem' : '3rem',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          
          {/* Section À propos */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
              justifyContent: 'center'
            }}>

              <h3 style={{
                fontSize: '1.5rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '400',
                margin: 0,
                color: 'rgba(255, 255, 255, 0.95)',
                letterSpacing: '0.05em'
              }}>
              </h3>
            </div>
            
            {/* Titre et symbole au-dessus de la citation */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '1.5rem',
                marginBottom: '0.5rem'
              }}>
                ✨
              </div>
              <h4 style={{
                fontSize: '1.1rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '400',
                margin: 0,
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                L'âme de l'art
              </h4>
            </div>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.5',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1rem',
              fontWeight: '300',
              margin: '1rem 0 0 0',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              "L’art lave notre âme de la poussière du quotidien."
              <span style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontStyle: 'normal',
                marginTop: '0.5rem',
                display: 'block'
              }}>
                — Pablo Picasso
              </span>
            </p>
            
            {/* Ornement décoratif */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '2rem 0 1rem 0'
            }}>
              <div style={{
                width: '40px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
              }}></div>
              <div style={{
                margin: '0 1rem',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '1.2rem'
              }}>
                ✦
              </div>
              <div style={{
                width: '40px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
              }}></div>
            </div>
          </div>

          {/* Section Navigation */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: '400',
              marginBottom: '1.5rem',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.02em'
            }}>
              Navigation
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              {[
                { label: 'Accueil', path: '/' },
                { label: 'Galerie', path: '/' },
                { label: 'À propos', path: '/about' },
                { label: 'Contact', path: '/contact' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: '300',
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: '0.3rem 0',
                    transition: 'all 0.3s ease',
                    borderBottom: '1px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Contact */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: '400',
              marginBottom: '1.5rem',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.02em'
            }}>
              Contact
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1rem', opacity: '0.8' }}>📧</span>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: '300'
                }}>
                  contact@naoual.art
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1rem', opacity: '0.8' }}>🎨</span>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: '300'
                }}>
                  Galerie N'ART Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div style={{
          height: '1px',
          background: 'rgba(255, 255, 255, 0.2)',
          marginBottom: '2rem'
        }}></div>

        {/* Section copyright centrée */}
        <div style={{
          textAlign: 'center'
        }}>
          <p style={{
            margin: '0 0 0.5rem 0',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: "'Roboto', sans-serif",
            fontSize: '0.85rem',
            fontWeight: '300'
          }}>
            © 2025 N'ART - Galerie d'Art en Ligne. Tous droits réservés.
          </p>
          <p style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: "'Roboto', sans-serif",
            fontSize: '0.75rem',
            fontStyle: 'italic',
            fontWeight: '300'
          }}>
            Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
