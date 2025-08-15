import './App.css';
import './styles/responsive.css';

import Menu from './components/Menu';
import Gallery from './components/Gallery';
import ArtworkDetail from './components/ArtworkDetail';
import ArtworkImage from './components/ArtworkImage';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnalyticsTest from './components/AnalyticsTest';
import { getAssetPath } from './utils/assetUtils';
import { initGA, trackPageView } from './utils/analytics';
import { 
  useSessionTracking, 
  usePerformanceTracking, 
  useErrorTracking 
} from './hooks/useAnalytics';
import { AnalyticsProvider } from './contexts/AnalyticsContext';

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import des polices Google Fonts.
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;600;700&family=Roboto:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

// Composant pour tracker les changements de page
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Tracker chaque changement de page
    trackPageView(window.location.href, document.title);
  }, [location]);

  return null;
}

function App() {
  const [showMessages, setShowMessages] = useState(false);
  const [interests, setInterests] = useState([]);
  const [artworks, setArtworks] = useState([]);

  // Hooks Analytics
  const { incrementPageView, incrementInteraction } = useSessionTracking();
  usePerformanceTracking();
  useErrorTracking();

  // Initialiser Google Analytics au chargement de l'app
  useEffect(() => {
    initGA();
  }, []);

  // Get basename from Vite config for consistency
  const basename = '/';

  return (
    <AnalyticsProvider>
      <Router basename={basename}>
        <div>
          <AnalyticsTracker />
          <Menu />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                {/* Section Hero inspirée - Style artistique */}
                <div className="hero-section" style={{
                  position: 'relative',
                  height: '80vh',
                  minHeight: '400px',
                  maxHeight: '800px',
                  width: '100%',
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url("${getAssetPath('art-background.jpg')}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'fixed',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  margin: '0',
                  borderRadius: '0 0 50px 50px',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  paddingTop: '1rem',
                  paddingBottom: '3rem'
                }}>
                  {/* Effet de particules artistiques */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 30%, rgba(161, 60, 47, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(161, 60, 47, 0.08) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }}></div>
                  
                  {/* Logo centré avec effet glassmorphism */}
                  <div className="hero-logo" style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '50%',
                    padding: window.innerWidth <= 768 ? '1.5rem' : '2.5rem',
                    marginBottom: '1rem',
                    marginTop: '0rem',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={getAssetPath('nart-logo.png')} 
                      alt="Logo N'ART" 
                      style={{
                        height: window.innerWidth <= 768 ? '80px' : '140px',
                        width: window.innerWidth <= 768 ? '80px' : '140px',
                        filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 4px 20px rgba(255, 255, 255, 0.3))',
                        transition: 'transform 0.4s ease',
                        objectFit: 'contain'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.1) rotate(5deg)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
                    />
                  </div>
                  
                  {/* Message principal inspirant */}
                  <div className="hero-content" style={{
                    maxWidth: '900px',
                    width: '100%',
                    padding: window.innerWidth <= 768 ? '0 1rem' : '0 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 3
                  }}>
                    <h1 style={{
                      fontSize: window.innerWidth <= 768 ? 'clamp(1.8rem, 5vw, 3rem)' : 'clamp(2.5rem, 6vw, 4.5rem)',
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: '300',
                      color: '#ffffff',
                      marginBottom: window.innerWidth <= 768 ? '0.5rem' : '1rem',
                      marginTop: window.innerWidth <= 768 ? '0' : '-1rem',
                      letterSpacing: '0.15em',
                      textShadow: '0 4px 25px rgba(0, 0, 0, 0.6)',
                      lineHeight: '1.2',
                      textAlign: 'center'
                    }}>
                      Créer des émotions
                      <br />
                      <span style={{
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        à travers l'art
                      </span>
                    </h1>
                    
                    {/* Sous-titre élégant */}
                    <p style={{
                      fontSize: window.innerWidth <= 768 ? 'clamp(1rem, 2.5vw, 1.3rem)' : 'clamp(1.2rem, 3vw, 1.6rem)',
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: '300',
                      letterSpacing: '0.05em',
                      textShadow: '0 3px 15px rgba(0, 0, 0, 0.4)',
                      maxWidth: '700px',
                      margin: window.innerWidth <= 768 ? '0 auto' : '-0.5rem auto 0 auto',
                      textAlign: 'center',
                      lineHeight: '1.4'
                    }}>
                      Découvrez l'authenticité de l'art véritable
                    </p>
                  </div>
                  
                  {/* Flèche descendante animée */}
                  <div style={{
                    position: 'absolute',
                    bottom: window.innerWidth <= 768 ? '1.5rem' : '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem',
                    animation: 'bounce 2s infinite',
                    cursor: 'pointer',
                    zIndex: 3,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                  }}>
                    ↓
                  </div>
                </div>

                <Gallery 
                  interests={interests} 
                  setInterests={setInterests}
                  artworks={artworks}
                  setArtworks={setArtworks}
                />
              </>
            } 
          />
          
          <Route 
            path="/artwork/:id" 
            element={
              <ArtworkDetail 
                artworks={artworks}
                interests={interests}
                setInterests={setInterests}
              />
            } 
          />
          
          <Route 
            path="/artwork-image/:id" 
            element={
              <ArtworkImage 
                artworks={artworks}
              />
            } 
          />
          
          <Route 
            path="/about" 
            element={<About />} 
          />
          
          <Route 
            path="/contact" 
            element={<Contact />} 
          />
          
          <Route 
            path="/analytics-test" 
            element={<AnalyticsTest />} 
          />
        </Routes>
        
        <Footer />
        {/* Style CSS pour l'animation */}
        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
          
          /* Force l'utilisation de Roboto pour tous les éléments */
          * {
            font-family: 'Roboto', sans-serif !important;
          }
          
          /* Exception pour les titres qui gardent Playfair Display */
          h1, h2, h3, .title {
            font-family: 'Playfair Display', serif !important;
          }
          
          /* Responsive pour la section hero */
          @media (max-width: 768px) {
            .hero-section {
              height: 70vh !important;
              min-height: 500px !important;
              border-radius: 0 0 30px 30px !important;
            }
            
            .hero-logo {
              padding: 2rem !important;
              margin-bottom: 2rem !important;
            }
            
            .hero-content {
              padding: 0 1.5rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .hero-section {
              height: 60vh !important;
              min-height: 450px !important;
            }
            
            .hero-logo {
              padding: 1.5rem !important;
            }
            
            .hero-logo img {
              height: 100px !important;
              width: 100px !important;
            }
          }
        `}</style>
      </div>
    </Router>
    </AnalyticsProvider>
  );
}

export default App
