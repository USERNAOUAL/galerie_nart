import './App.css';

import Menu from './components/Menu';
import Gallery from './components/Gallery';

import { useState } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [interests, setInterests] = useState([]);
  const [readMessages, setReadMessages] = useState(() => {
    const saved = localStorage.getItem('nart_read_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculer le nombre de messages non lus
  const unreadCount = interests.filter(interest => 
    !readMessages.includes(interest.artIdx + '_' + interest.name + '_' + interest.email)
  ).length;

  // Marquer tous les messages comme lus quand on ouvre la modal
  const handleShowMessages = () => {
    const newReadMessages = interests.map(interest => 
      interest.artIdx + '_' + interest.name + '_' + interest.email
    );
    setReadMessages(newReadMessages);
    localStorage.setItem('nart_read_messages', JSON.stringify(newReadMessages));
    setShowMessages(true);
  };

  return (
    <>
      <Menu isAdmin={isAdmin} onShowMessages={handleShowMessages} unreadCount={unreadCount} />
      
      {/* Section Hero inspirée - Style artistique */}
      <div style={{
        position: 'relative',
        height: '70vh',
        minHeight: '500px',
        width: '100%',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.35)), url("/art-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: '0',
        borderRadius: '0 0 40px 40px',
        overflow: 'hidden'
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
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          padding: '2.5rem',
          marginBottom: '2rem',
          marginTop: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 2
        }}>
          <img 
            src="/nart-logo.png" 
            alt="Logo N'ART" 
            style={{
              height: '140px',
              width: '140px',
              filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 4px 20px rgba(255, 255, 255, 0.3))',
              transition: 'transform 0.4s ease',
              objectFit: 'contain'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.1) rotate(5deg)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
          />
        </div>
        
        {/* Message principal inspirant */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontFamily: "'Playfair Display', serif",
          fontWeight: '300',
          color: '#ffffff',
          marginBottom: '1rem',
          letterSpacing: '0.15em',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 2,
          lineHeight: '1.2'
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
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: '300',
          letterSpacing: '0.05em',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          Découvrez l'authenticité de l'art véritable
        </p>
        
        {/* Flèche descendante animée */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '2rem',
          animation: 'bounce 2s infinite',
          cursor: 'pointer',
          zIndex: 2
        }}>
          ↓
        </div>
      </div>

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
      `}</style>

      <div style={{ textAlign: 'center', margin: '4rem 0' }}>
        <button
          onClick={() => setIsAdmin((prev) => !prev)}
          style={{
            padding: '1rem 3rem',
            borderRadius: '50px',
            background: isAdmin ? 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)' : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: '#fff',
            fontWeight: '500',
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '0.05em'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
          }}
        >
          {isAdmin ? '👤 Passer en mode visiteur' : '🔧 Passer en mode admin'}
        </button>
      </div>
      <Gallery isAdmin={isAdmin} interests={interests} setInterests={setInterests} />
      {/* Modal Messages admin */}
      {isAdmin && showMessages && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '1.5em',
            boxShadow: '0 4px 32px #a13c2f33',
            minWidth: '320px',
            maxWidth: '90vw',
            textAlign: 'center',
            position: 'relative'
          }}>
            <h2 style={{marginBottom: '1.2rem', color: '#a13c2f'}}>Messages d'intérêt reçus</h2>
            {interests.length === 0 ? (
              <p style={{color: '#333'}}>Aucun message reçu pour le moment.</p>
            ) : (
              interests.map((i, k) => (
                <div key={k} style={{marginBottom: '1.2rem', textAlign: 'left', background: '#f8f6f2', padding: '1rem', borderRadius: '1em', color: '#2c2c2c', border: '1px solid #e0ddd6'}}>
                  <strong style={{color: '#a13c2f'}}>Œuvre :</strong> <span style={{color: '#333'}}>{i.artTitle}</span><br/>
                  <strong style={{color: '#a13c2f'}}>Nom :</strong> <span style={{color: '#333'}}>{i.name}</span><br/>
                  <strong style={{color: '#a13c2f'}}>Email :</strong> <span style={{color: '#333'}}>{i.email}</span><br/>
                  {i.message && (<><strong style={{color: '#a13c2f'}}>Message :</strong> <span style={{color: '#333'}}>{i.message}</span><br/></>)}
                </div>
              ))
            )}
            <button type="button" onClick={() => setShowMessages(false)} style={{position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5em', color: '#a13c2f', cursor: 'pointer'}}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App
