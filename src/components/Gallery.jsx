import React, { useState, useEffect } from "react";
import "../styles/Gallery.css";

const initialArtworks = [
  {
    title: "Exemple d'œuvre",
    image: "https://via.placeholder.com/400x300/a13c2f/ffffff?text=Votre+Oeuvre",
    description: "Ajoutez vos propres œuvres via le mode admin.",
    likes: 0,
    interested: 0
  }
];

const Gallery = ({ isAdmin, interests, setInterests }) => {
  const [artworks, setArtworks] = useState(() => {
    const saved = localStorage.getItem('nart_artworks');
    console.log('Données sauvegardées dans localStorage:', saved);
    return saved ? JSON.parse(saved) : initialArtworks;
  });
  const [newArt, setNewArt] = useState({ title: '', image: '', description: '' });
  const [editIdx, setEditIdx] = useState(null);
  const [editArt, setEditArt] = useState({ title: '', image: '', description: '' });
  const [showFormIdx, setShowFormIdx] = useState(null);
  const [interestForm, setInterestForm] = useState({ name: '', email: '', message: '' });

  // Fonction pour nettoyer le localStorage (utile pour le débogage)
  const clearLocalStorage = () => {
    localStorage.removeItem('nart_artworks');
    localStorage.removeItem('nart_interests');
    setArtworks(initialArtworks);
    setInterests([]);
    console.log('LocalStorage nettoyé');
  };

  // Persistance artworks
  useEffect(() => {
    localStorage.setItem('nart_artworks', JSON.stringify(artworks));
  }, [artworks]);

  // Persistance interests
  useEffect(() => {
    localStorage.setItem('nart_interests', JSON.stringify(interests));
  }, [interests]);

  useEffect(() => {
    const savedInterests = localStorage.getItem('nart_interests');
    if (savedInterests) setInterests(JSON.parse(savedInterests));
    // eslint-disable-next-line
  }, []);

  // Visiteur actions
  const handleLike = idx => {
    setArtworks(arts => arts.map((a, i) => i === idx ? { ...a, likes: a.likes + 1 } : a));
  };
  const handleInterested = idx => {
    setShowFormIdx(idx);
    setInterestForm(form => ({
      ...form,
      message: `Je suis intéressé par l'œuvre ${artworks[idx].title}`
    }));
  };
  const handleInterestSubmit = e => {
    e.preventDefault();
    setInterests(arr => [...arr, { artIdx: showFormIdx, artTitle: artworks[showFormIdx].title, ...interestForm }]);
    setArtworks(arts => arts.map((a, i) => i === showFormIdx ? { ...a, interested: a.interested + 1 } : a));
    setShowFormIdx(null);
    setInterestForm({ name: '', email: '', message: '' });
  };

  // Admin actions
  const handleDelete = idx => {
    setArtworks(arts => arts.filter((_, i) => i !== idx));
  };
  const handleAdd = e => {
    e.preventDefault();
    if (!newArt.title || !newArt.image) return;
    setArtworks([...artworks, { ...newArt, likes: 0, interested: 0 }]);
    setNewArt({ title: '', image: '', description: '' });
  };
  const handleEdit = idx => {
    setEditIdx(idx);
    setEditArt({
      title: artworks[idx].title,
      image: artworks[idx].image,
      description: artworks[idx].description
    });
  };
  const handleEditSubmit = e => {
    e.preventDefault();
    setArtworks(arts => arts.map((a, i) => i === editIdx ? { ...a, ...editArt } : a));
    setEditIdx(null);
    setEditArt({ title: '', image: '', description: '' });
  };

  return (
    <section className="gallery-section">
      <h2 className="gallery-title">Galerie d'œuvres</h2>
      {isAdmin && (
        <div style={{marginBottom: '2rem', textAlign: 'center'}}>
          <form className="admin-form" onSubmit={handleAdd} style={{marginBottom: '1rem'}}>
            <input
              type="text"
              placeholder="Titre"
              value={newArt.title}
              onChange={e => setNewArt({ ...newArt, title: e.target.value })}
              required
              style={{marginRight: '1rem'}}
            />
            <input
              type="text"
              placeholder="URL de l'image"
              value={newArt.image}
              onChange={e => setNewArt({ ...newArt, image: e.target.value })}
              required
              style={{marginRight: '1rem'}}
            />
            <input
              type="text"
              placeholder="Description"
              value={newArt.description}
              onChange={e => setNewArt({ ...newArt, description: e.target.value })}
              style={{marginRight: '1rem'}}
            />
            <button type="submit" style={{padding: '0.5em 1.5em', borderRadius: '1em', background: '#a13c2f', color: '#fff', border: 'none', fontWeight: 'bold'}}>Ajouter</button>
          </form>
          <button 
            onClick={clearLocalStorage} 
            style={{padding: '0.5em 1.5em', borderRadius: '1em', background: '#666', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '0.9em'}}
          >
            🗑️ Nettoyer les données (Debug)
          </button>
        </div>
      )}
      <div className="gallery-grid">
        {artworks.map((art, idx) => (
          <div className="art-card" key={idx}>
            <img src={art.image} alt={art.title} className="art-image" />
            {editIdx === idx ? (
              <form onSubmit={handleEditSubmit} style={{marginBottom: '1rem'}}>
                <input type="text" value={editArt.title} onChange={e => setEditArt({ ...editArt, title: e.target.value })} required style={{marginRight: '0.5rem'}} />
                <input type="text" value={editArt.image} onChange={e => setEditArt({ ...editArt, image: e.target.value })} required style={{marginRight: '0.5rem'}} />
                <input type="text" value={editArt.description} onChange={e => setEditArt({ ...editArt, description: e.target.value })} style={{marginRight: '0.5rem'}} />
                <button type="submit" style={{padding: '0.3em 1em', borderRadius: '1em', background: '#222', color: '#fff', border: 'none', fontWeight: 'bold'}}>Valider</button>
              </form>
            ) : (
              <>
                <h3 className="art-title">{art.title}</h3>
                <p className="art-desc">{art.description}</p>
              </>
            )}
            <div style={{marginTop: '1rem'}}>
              {!isAdmin && (
                <>
                  <button onClick={() => handleLike(idx)} style={{marginRight: '1rem', padding: '0.3em 1em', borderRadius: '1em', background: '#a13c2f', color: '#fff', border: 'none', fontWeight: 'bold'}}>❤️ {art.likes}</button>
                  <button onClick={() => handleInterested(idx)} style={{padding: '0.3em 1em', borderRadius: '1em', background: '#222', color: '#fff', border: 'none', fontWeight: 'bold'}}>Intéressé ({art.interested})</button>
                </>
              )}
              {isAdmin && editIdx !== idx && (
                <>
                  <div style={{marginBottom: '0.7rem', color: '#a13c2f', fontWeight: 'bold'}}>
                    ❤️ {art.likes} &nbsp;|&nbsp; Intéressés : {art.interested}
                  </div>
                  <button onClick={() => handleEdit(idx)} style={{marginRight: '1rem', padding: '0.3em 1em', borderRadius: '1em', background: '#222', color: '#fff', border: 'none', fontWeight: 'bold'}}>Modifier</button>
                  <button onClick={() => handleDelete(idx)} style={{padding: '0.3em 1em', borderRadius: '1em', background: '#a13c2f', color: '#fff', border: 'none', fontWeight: 'bold'}}>Supprimer</button>
                  {/* Affichage des intérêts reçus pour cette œuvre */}
                  {interests.filter(i => i.artIdx === idx).length > 0 && (
                    <div style={{marginTop: '1rem', background: '#f8f6f2', padding: '1rem', borderRadius: '1em', border: '1px solid #e0ddd6'}}>
                      <h4 style={{marginBottom: '0.7rem', color: '#a13c2f'}}>Intéressés :</h4>
                      {interests.filter(i => i.artIdx === idx).map((i, k) => (
                        <div key={k} style={{marginBottom: '0.5rem', textAlign: 'left', color: '#2c2c2c'}}>
                          <strong style={{color: '#a13c2f'}}>Nom :</strong> <span style={{color: '#333'}}>{i.name}</span><br/>
                          <strong style={{color: '#a13c2f'}}>Email :</strong> <span style={{color: '#333'}}>{i.email}</span><br/>
                          {i.message && (<><strong style={{color: '#a13c2f'}}>Message :</strong> <span style={{color: '#333'}}>{i.message}</span><br/></>)}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Modal du formulaire Intéressé */}
      {showFormIdx !== null && (
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
          <form onSubmit={handleInterestSubmit} style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '1.5em',
            boxShadow: '0 4px 32px #a13c2f33',
            minWidth: '320px',
            maxWidth: '90vw',
            textAlign: 'center',
            position: 'relative'
          }}>
            <h3 style={{marginBottom: '1.2rem', color: '#a13c2f'}}>Intéressé par cette œuvre ?</h3>
            <input type="text" placeholder="Nom" value={interestForm.name} onChange={e => setInterestForm({ ...interestForm, name: e.target.value })} required style={{marginBottom: '1rem', width: '90%'}} />
            <br/>
            <input type="email" placeholder="Email" value={interestForm.email} onChange={e => setInterestForm({ ...interestForm, email: e.target.value })} required style={{marginBottom: '1rem', width: '90%'}} />
            <br/>
            <input type="text" placeholder="Message" value={interestForm.message} onChange={e => setInterestForm({ ...interestForm, message: e.target.value })} style={{marginBottom: '1rem', width: '90%'}} />
            <br/>
            <button type="submit" style={{padding: '0.6em 2em', borderRadius: '1em', background: '#a13c2f', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '1.1em'}}>Envoyer</button>
            <button type="button" onClick={() => setShowFormIdx(null)} style={{position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5em', color: '#a13c2f', cursor: 'pointer'}}>&times;</button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Gallery;


// this is a basic comment to remove later