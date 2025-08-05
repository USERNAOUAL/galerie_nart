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
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button
          onClick={() => setIsAdmin((prev) => !prev)}
          style={{
            padding: '0.7em 2em',
            borderRadius: '2em',
            background: isAdmin ? '#a13c2f' : '#222',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1em',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          {isAdmin ? 'Passer en mode visiteur' : 'Passer en mode admin'}
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
