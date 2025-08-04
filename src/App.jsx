import './App.css';

import Menu from './components/Menu';
import Gallery from './components/Gallery';

import { useState } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [interests, setInterests] = useState([]);

  return (
    <>
      <Menu isAdmin={isAdmin} onShowMessages={() => setShowMessages(true)} />
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
              <p>Aucun message reçu pour le moment.</p>
            ) : (
              interests.map((i, k) => (
                <div key={k} style={{marginBottom: '1.2rem', textAlign: 'left', background: '#f8f6f2', padding: '1rem', borderRadius: '1em'}}>
                  <strong>Œuvre :</strong> {i.artTitle}<br/>
                  <strong>Nom :</strong> {i.name}<br/>
                  <strong>Email :</strong> {i.email}<br/>
                  {i.message && (<><strong>Message :</strong> {i.message}<br/></>)}
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
