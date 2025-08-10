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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showStorageData, setShowStorageData] = useState(false);

  // Fonction pour afficher les données du localStorage
  const viewLocalStorageData = () => {
    console.log('=== DEBUGGING LOCALSTORAGE ===');
    console.log('Artworks:', artworks);
    console.log('Interests:', interests);
    console.log('LocalStorage artworks:', localStorage.getItem('nart_artworks'));
    console.log('LocalStorage interests:', localStorage.getItem('nart_interests'));
    setShowStorageData(true);
  };

  // Filtrer les œuvres par recherche seulement
  const filteredArtworks = artworks.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         art.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Persistance artworks
  useEffect(() => {
    localStorage.setItem('nart_artworks', JSON.stringify(artworks));
  }, [artworks]);

  // Persistance interests
  useEffect(() => {
    localStorage.setItem('nart_interests', JSON.stringify(interests));
  }, [interests]);

  const handleAdd = e => {
    e.preventDefault();
    setArtworks([...artworks, { ...newArt, likes: 0, interested: 0 }]);
    setNewArt({ title: '', image: '', description: '' });
  };

  const handleDelete = idx => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      setArtworks(artworks.filter((_, i) => i !== idx));
    }
  };

  const handleLike = idx => {
    setArtworks(arts => arts.map((a, i) => i === idx ? { ...a, likes: a.likes + 1 } : a));
  };

  const handleInterest = (artIdx, name, email, message) => {
    const newInterest = {
      artIdx,
      artTitle: artworks[artIdx].title,
      name,
      email,
      message,
      timestamp: Date.now()
    };
    setInterests([...interests, newInterest]);
    setArtworks(arts => arts.map((a, i) => i === artIdx ? { ...a, interested: a.interested + 1 } : a));
    setShowFormIdx(null);
    setInterestForm({ name: '', email: '', message: '' });
  };

  const handleEdit = idx => {
    setEditIdx(idx);
    setEditArt({ ...artworks[idx] });
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    setArtworks(arts => arts.map((a, i) => i === editIdx ? { ...a, ...editArt } : a));
    setEditIdx(null);
    setEditArt({ title: '', image: '', description: '' });
  };

  return (
    <section style={{
      padding: '4rem 2rem 6rem',
      background: 'linear-gradient(135deg, #f8f6f2 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        
        {/* Barre de recherche élégante pour visiteurs */}
        {!isAdmin && (
          <div style={{
            marginBottom: '4rem', 
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(161, 60, 47, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '300',
                color: '#2c3e50',
                marginBottom: '1.5rem',
                letterSpacing: '0.05em'
              }}>
                Explorez notre 
                <span style={{
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}> collection</span>
              </h2>
              
              <div style={{position: 'relative'}}>
                <input
                  type="text"
                  placeholder="🎨 Rechercher une œuvre d'art..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    borderRadius: '20px',
                    border: '2px solid rgba(161, 60, 47, 0.2)',
                    fontSize: '1.1rem',
                    fontFamily: "'Montserrat', sans-serif",
                    background: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a13c2f';
                    e.target.style.boxShadow = '0 0 20px rgba(161, 60, 47, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(161, 60, 47, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <p style={{
                color: '#5a6c7d', 
                fontSize: '1rem',
                marginTop: '1rem',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '500'
              }}>
                ✨ {filteredArtworks.length} œuvre{filteredArtworks.length > 1 ? 's' : ''} disponible{filteredArtworks.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Interface admin moderne */}
        {isAdmin && (
          <div style={{
            marginBottom: '4rem', 
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '3rem',
              boxShadow: '0 12px 40px rgba(161, 60, 47, 0.15)',
              border: '1px solid rgba(161, 60, 47, 0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '300',
                color: '#2c3e50',
                marginBottom: '2rem',
                letterSpacing: '0.05em'
              }}>
                🔧 Gestion des 
                <span style={{
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}> œuvres</span>
              </h2>
              
              <form onSubmit={handleAdd} style={{marginBottom: '2rem'}}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <input
                    type="text"
                    placeholder="✨ Titre de l'œuvre"
                    value={newArt.title}
                    onChange={e => setNewArt({ ...newArt, title: e.target.value })}
                    required
                    style={{
                      padding: '1rem',
                      borderRadius: '15px',
                      border: '2px solid rgba(161, 60, 47, 0.2)',
                      fontSize: '1rem',
                      fontFamily: "'Montserrat', sans-serif",
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="🖼️ URL de l'image"
                    value={newArt.image}
                    onChange={e => setNewArt({ ...newArt, image: e.target.value })}
                    required
                    style={{
                      padding: '1rem',
                      borderRadius: '15px',
                      border: '2px solid rgba(161, 60, 47, 0.2)',
                      fontSize: '1rem',
                      fontFamily: "'Montserrat', sans-serif",
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="📝 Description (optionnelle)"
                  value={newArt.description}
                  onChange={e => setNewArt({ ...newArt, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(161, 60, 47, 0.2)',
                    fontSize: '1rem',
                    fontFamily: "'Montserrat', sans-serif",
                    background: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2rem',
                    transition: 'all 0.3s ease'
                  }}
                />
                
                <button 
                  type="submit" 
                  style={{
                    padding: '1rem 2.5rem',
                    borderRadius: '25px',
                    background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    fontFamily: "'Montserrat', sans-serif",
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(161, 60, 47, 0.3)',
                    transition: 'all 0.3s ease',
                    marginRight: '1rem'
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
                  ✨ Ajouter l'œuvre
                </button>
                
                <button 
                  type="button"
                  onClick={viewLocalStorageData} 
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '25px',
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    fontFamily: "'Montserrat', sans-serif",
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(44, 62, 80, 0.3)',
                    transition: 'all 0.3s ease'
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
                  📊 Données
                </button>
              </form>
            </div>
          </div>
        )}
        
        {/* Grille d'œuvres modernisée */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2.5rem',
          padding: '0 1rem'
        }}>
          {filteredArtworks.map((art, idx) => {
            const realIdx = artworks.findIndex(a => a === art);
            return (
              <div 
                key={realIdx}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '25px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s ease',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(161, 60, 47, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  height: '280px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  
                  {/* Badge corner pour admin */}
                  {isAdmin && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(161, 60, 47, 0.9)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)'
                    }}>
                      ❤️ {art.likes} | 👥 {art.interested}
                    </div>
                  )}
                </div>
                
                <div style={{padding: '2rem'}}>
                  {editIdx === realIdx ? (
                    <form onSubmit={handleEditSubmit} style={{marginBottom: '1rem'}}>
                      <input 
                        type="text" 
                        value={editArt.title} 
                        onChange={e => setEditArt({ ...editArt, title: e.target.value })} 
                        required 
                        style={{
                          width: '100%',
                          marginBottom: '1rem',
                          padding: '0.8rem',
                          borderRadius: '12px',
                          border: '2px solid rgba(161, 60, 47, 0.2)',
                          fontSize: '1rem',
                          fontFamily: "'Montserrat', sans-serif"
                        }} 
                        placeholder="Titre"
                      />
                      <input 
                        type="text" 
                        value={editArt.image} 
                        onChange={e => setEditArt({ ...editArt, image: e.target.value })} 
                        required 
                        style={{
                          width: '100%',
                          marginBottom: '1rem',
                          padding: '0.8rem',
                          borderRadius: '12px',
                          border: '2px solid rgba(161, 60, 47, 0.2)',
                          fontSize: '1rem',
                          fontFamily: "'Montserrat', sans-serif"
                        }} 
                        placeholder="URL de l'image"
                      />
                      <input 
                        type="text" 
                        value={editArt.description} 
                        onChange={e => setEditArt({ ...editArt, description: e.target.value })} 
                        style={{
                          width: '100%',
                          marginBottom: '1.5rem',
                          padding: '0.8rem',
                          borderRadius: '12px',
                          border: '2px solid rgba(161, 60, 47, 0.2)',
                          fontSize: '1rem',
                          fontFamily: "'Montserrat', sans-serif"
                        }} 
                        placeholder="Description"
                      />
                      
                      <button 
                        type="submit" 
                        style={{
                          padding: '0.8rem 1.5rem',
                          borderRadius: '15px',
                          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                          color: '#fff',
                          border: 'none',
                          fontWeight: '600',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ✅ Valider
                      </button>
                    </form>
                  ) : (
                    <>
                      <h3 style={{
                        fontSize: '1.4rem',
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '1.5rem',
                        lineHeight: '1.3'
                      }}>
                        {art.title}
                      </h3>
                    </>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.8rem',
                    marginTop: '1.5rem'
                  }}>
                    {!isAdmin && (
                      <>
                        <button 
                          onClick={() => handleLike(realIdx)} 
                          style={{
                            padding: '0.7rem 1.2rem',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(161, 60, 47, 0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(161, 60, 47, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(161, 60, 47, 0.3)';
                          }}
                        >
                          ❤️ {art.likes}
                        </button>
                        
                        <button 
                          onClick={() => setSelectedArtwork(art)} 
                          style={{
                            padding: '0.7rem 1.2rem',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(44, 62, 80, 0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(44, 62, 80, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(44, 62, 80, 0.3)';
                          }}
                        >
                          👁️ Détails
                        </button>
                      </>
                    )}
                    
                    {isAdmin && editIdx !== realIdx && (
                      <>
                        <button 
                          onClick={() => handleEdit(realIdx)} 
                          style={{
                            padding: '0.7rem 1.2rem',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(44, 62, 80, 0.3)'
                          }}
                        >
                          ✏️ Modifier
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(realIdx)} 
                          style={{
                            padding: '0.7rem 1.2rem',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
                          }}
                        >
                          🗑️ Supprimer
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Messages d'intérêt pour admin */}
                  {isAdmin && interests.filter(i => i.artIdx === realIdx).length > 0 && (
                    <div style={{
                      marginTop: '1.5rem',
                      background: 'rgba(161, 60, 47, 0.05)',
                      padding: '1.5rem',
                      borderRadius: '15px',
                      border: '1px solid rgba(161, 60, 47, 0.1)'
                    }}>
                      <h4 style={{
                        marginBottom: '1rem',
                        color: '#a13c2f',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.2rem'
                      }}>
                        💌 Messages reçus :
                      </h4>
                      {interests.filter(i => i.artIdx === realIdx).map((i, k) => (
                        <div key={k} style={{
                          marginBottom: '1rem',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          fontSize: '0.9rem'
                        }}>
                          <strong style={{color: '#a13c2f'}}>👤 {i.name}</strong><br/>
                          <strong style={{color: '#a13c2f'}}>📧 {i.email}</strong><br/>
                          {i.message && (<><strong style={{color: '#a13c2f'}}>💬 </strong> <span style={{color: '#333'}}>{i.message}</span><br/></>)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal pour voir les détails d'une œuvre */}
        {selectedArtwork && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '25px',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <button 
                onClick={() => setSelectedArtwork(null)} 
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(161, 60, 47, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
              
              <img 
                src={selectedArtwork.image} 
                alt={selectedArtwork.title} 
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '25px 25px 0 0'
                }}
              />
              
              <div style={{padding: '2rem'}}>
                <h2 style={{
                  fontSize: '2rem',
                  fontFamily: "'Playfair Display', serif",
                  color: '#2c3e50',
                  marginBottom: '1rem'
                }}>
                  {selectedArtwork.title}
                </h2>
                
                {selectedArtwork.description && (
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#5a6c7d',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                  }}>
                    {selectedArtwork.description}
                  </p>
                )}
                
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    background: 'rgba(161, 60, 47, 0.1)',
                    padding: '1rem',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <span style={{fontSize: '1.5rem'}}>❤️</span>
                    <p style={{margin: '0.5rem 0 0', color: '#a13c2f', fontWeight: '600'}}>
                      {selectedArtwork.likes} J'adore
                    </p>
                  </div>
                  
                  <div style={{
                    background: 'rgba(161, 60, 47, 0.1)',
                    padding: '1rem',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <span style={{fontSize: '1.5rem'}}>👥</span>
                    <p style={{margin: '0.5rem 0 0', color: '#a13c2f', fontWeight: '600'}}>
                      {selectedArtwork.interested} Intéressés
                    </p>
                  </div>
                </div>
                
                {/* Formulaire d'intérêt */}
                {showFormIdx === artworks.findIndex(a => a === selectedArtwork) ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleInterest(artworks.findIndex(a => a === selectedArtwork), interestForm.name, interestForm.email, interestForm.message);
                  }} style={{
                    background: 'rgba(161, 60, 47, 0.05)',
                    padding: '2rem',
                    borderRadius: '15px',
                    marginTop: '1rem'
                  }}>
                    <h3 style={{color: '#a13c2f', marginBottom: '1rem'}}>💌 Montrer votre intérêt</h3>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={interestForm.name}
                      onChange={e => setInterestForm({...interestForm, name: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        marginBottom: '1rem',
                        borderRadius: '10px',
                        border: '2px solid rgba(161, 60, 47, 0.2)',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Votre email"
                      value={interestForm.email}
                      onChange={e => setInterestForm({...interestForm, email: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        marginBottom: '1rem',
                        borderRadius: '10px',
                        border: '2px solid rgba(161, 60, 47, 0.2)',
                        fontSize: '1rem'
                      }}
                    />
                    <textarea
                      placeholder="Message (optionnel)"
                      value={interestForm.message}
                      onChange={e => setInterestForm({...interestForm, message: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        marginBottom: '1rem',
                        borderRadius: '10px',
                        border: '2px solid rgba(161, 60, 47, 0.2)',
                        fontSize: '1rem',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <button 
                        type="submit" 
                        style={{
                          padding: '0.8rem 1.5rem',
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                          color: '#fff',
                          border: 'none',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ✉️ Envoyer
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowFormIdx(null)}
                        style={{
                          padding: '0.8rem 1.5rem',
                          borderRadius: '20px',
                          background: '#ddd',
                          color: '#333',
                          border: 'none',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setShowFormIdx(artworks.findIndex(a => a === selectedArtwork))}
                    style={{
                      padding: '1rem 2rem',
                      borderRadius: '25px',
                      background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(161, 60, 47, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    💌 Ça m'intéresse !
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal debug localStorage */}
        {showStorageData && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem'
          }}>
            <div style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '25px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              <button 
                onClick={() => setShowStorageData(false)} 
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#a13c2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
              
              <h2 style={{color: '#a13c2f', marginBottom: '1rem'}}>📊 Données localStorage</h2>
              <div style={{marginBottom: '2rem'}}>
                <h3>🎨 Œuvres ({artworks.length})</h3>
                <pre style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {JSON.stringify(artworks, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3>💌 Messages d'intérêt ({interests.length})</h3>
                <pre style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {JSON.stringify(interests, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
