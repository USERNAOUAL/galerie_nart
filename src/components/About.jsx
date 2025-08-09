import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../utils/assetUtils';

const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      background: `
        linear-gradient(135deg, rgba(248, 246, 242, 0.85) 0%, rgba(255, 255, 255, 0.8) 100%),
        linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)),
        url("${getAssetPath('art-background.jpg')}")
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      padding: '2rem 0'
    }}>
      {/* Effet de particules artistiques */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 25% 35%, rgba(161, 60, 47, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 75% 65%, rgba(161, 60, 47, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(44, 62, 80, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 20% 80%, rgba(161, 60, 47, 0.05) 0%, transparent 45%)
        `,
        pointerEvents: 'none',
        zIndex: 1
      }}></div>
      
      {/* Contenu principal avec z-index supérieur */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Bouton retour */}
        <div style={{ padding: '2rem', position: 'relative', zIndex: 3 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(161, 60, 47, 0.3)',
              borderRadius: '20px',
              padding: '0.8rem 1.5rem',
              color: '#2c3e50',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: '500',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(161, 60, 47, 0.15)';
              e.target.style.borderColor = '#a13c2f';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(161, 60, 47, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.95)';
              e.target.style.borderColor = 'rgba(161, 60, 47, 0.3)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
          >
            ← Retour à l'accueil
          </button>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 3
        }}>
          {/* En-tête de la page À propos */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '3rem',
            boxShadow: '0 25px 70px rgba(161, 60, 47, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            {/* Logo N'ART */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'rgba(161, 60, 47, 0.1)',
                borderRadius: '50%',
                padding: '1.5rem',
                border: '2px solid rgba(161, 60, 47, 0.2)',
                boxShadow: '0 10px 30px rgba(161, 60, 47, 0.15)',
                transition: 'all 0.3s ease'
              }}>
                <img 
                  src={getAssetPath('nart-logo.png')} 
                  alt="Logo N'ART" 
                  style={{
                    height: '80px',
                    width: '80px',
                    objectFit: 'contain',
                    filter: 'brightness(1.1) contrast(1.05)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1) rotate(5deg)';
                    e.target.parentElement.style.background = 'rgba(161, 60, 47, 0.15)';
                    e.target.parentElement.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1) rotate(0deg)';
                    e.target.parentElement.style.background = 'rgba(161, 60, 47, 0.1)';
                    e.target.parentElement.style.transform = 'translateY(0)';
                  }}
                />
              </div>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '300',
              color: '#2c3e50',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em'
            }}>
              À propos de 
              <span style={{
                fontWeight: '700',
                background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}> N'ART</span>
            </h1>
            
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#5a6c7d',
              lineHeight: '1.8',
              maxWidth: '800px',
              margin: '0 auto',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: '300'
            }}>
              Mon univers artistique personnel où je partage mes créations, principalement mes tableaux, avec le monde entier.
            </p>
          </div>

          {/* Section principale - Notre Histoire et Mission */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: '25px',
              padding: '2.5rem',
              boxShadow: '0 15px 45px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(161, 60, 47, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '1.5rem'
              }}>
                🎨 Mon Histoire
              </h2>
              <p style={{
                color: '#5a6c7d',
                lineHeight: '1.7',
                fontSize: '1.1rem',
                fontFamily: "'Roboto', sans-serif"
              }}>
                N'ART est né de ma passion pour la peinture et la création artistique. C'est mon espace personnel où je partage mes œuvres, mes émotions et ma vision du monde à travers mes tableaux. Chaque création raconte une histoire, exprime un sentiment ou capture un moment d'inspiration.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: '25px',
              padding: '2.5rem',
              boxShadow: '0 15px 45px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(161, 60, 47, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '1.5rem'
              }}>
                🌟 Ma Mission
              </h2>
              <p style={{
                color: '#5a6c7d',
                lineHeight: '1.7',
                fontSize: '1.1rem',
                fontFamily: "'Roboto', sans-serif"
              }}>
                Partager mes créations artistiques avec le monde et toucher les cœurs à travers mes tableaux. Mon objectif est de créer des œuvres qui éveillent des émotions, racontent des histoires et offrent une fenêtre sur mon univers créatif personnel.
              </p>
            </div>
          </div>

          {/* Section Valeurs */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '3rem',
            boxShadow: '0 25px 70px rgba(161, 60, 47, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '600',
              color: '#2c3e50',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              Mes Valeurs Artistiques
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '1.5rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>✨</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  color: '#a13c2f',
                  marginBottom: '1rem'
                }}>Authenticité</h3>
                <p style={{
                  color: '#5a6c7d',
                  lineHeight: '1.6',
                  fontFamily: "'Roboto', sans-serif"
                }}>
                  Mes œuvres reflètent ma passion sincère pour l'art. Certaines sont des créations entièrement personnelles, d'autres s'inspirent d'œuvres qui m'ont touché, réinterprétées avec ma propre sensibilité artistique.
                </p>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '1.5rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>🤝</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  color: '#a13c2f',
                  marginBottom: '1rem'
                }}>Partage</h3>
                <p style={{
                  color: '#5a6c7d',
                  lineHeight: '1.6',
                  fontFamily: "'Roboto', sans-serif"
                }}>
                  Je crois que l'art doit être partagé. Cette galerie me permet de faire découvrir mes créations au monde entier et de toucher un public varié.
                </p>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '1.5rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>💡</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  color: '#a13c2f',
                  marginBottom: '1rem'
                }}>Passion</h3>
                <p style={{
                  color: '#5a6c7d',
                  lineHeight: '1.6',
                  fontFamily: "'Roboto', sans-serif"
                }}>
                  La passion pour la peinture guide chacune de mes créations. C'est cette énergie créative que je souhaite transmettre à travers mes œuvres.
                </p>
              </div>
            </div>
          </div>

          {/* Section Contact */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            borderRadius: '25px',
            padding: '3rem',
            boxShadow: '0 15px 45px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(161, 60, 47, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '1.5rem'
            }}>
              Découvrez mon univers artistique
            </h2>
            <p style={{
              color: '#5a6c7d',
              lineHeight: '1.7',
              fontSize: '1.1rem',
              fontFamily: "'Roboto', sans-serif",
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Plongez dans mon monde créatif à travers mes tableaux. Chaque œuvre raconte une histoire, exprime une émоtion ou capture un moment d'inspiration. J'espère que mes créations vous toucheront autant qu'elles me passionnent.
            </p>
            
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                fontFamily: "'Roboto', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(161, 60, 47, 0.3)',
                transition: 'all 0.3s ease'
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
              Découvrir mes œuvres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
