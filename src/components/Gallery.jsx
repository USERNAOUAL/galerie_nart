import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/emailConfig';
import { getAssetPath } from '../utils/assetUtils';
import "../styles/Gallery.css";

// Fonction pour charger les interactions depuis le fichier YAML
const loadInteractionsFromConfig = async () => {
  try {
    const response = await fetch(getAssetPath('artworks/interactions.yaml'));
    if (!response.ok) {
      console.log('Fichier interactions.yaml non trouvé, utilisation des valeurs par défaut');
      return {};
    }
    const yamlText = await response.text();
    
    // Parser YAML simple pour les interactions
    const lines = yamlText.split('\n');
    const interactions = {};
    let currentArtworkId = null;
    let currentMessage = null;
    let inMessages = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.includes(':') && !trimmed.startsWith('-') && !trimmed.startsWith('#')) {
        const parts = trimmed.split(':');
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        
        // Nouvelle œuvre
        if (line.indexOf(key) === 2) { // Indentation de 2 espaces = nouvelle œuvre
          currentArtworkId = key;
          interactions[currentArtworkId] = { likes: 0, messages: [] };
          inMessages = false;
        }
        // Propriétés de l'œuvre
        else if (currentArtworkId && line.indexOf(key) === 4) { // Indentation de 4 espaces
          if (key === 'likes') {
            interactions[currentArtworkId].likes = parseInt(value) || 0;
          } else if (key === 'messages') {
            inMessages = true;
          }
        }
        // Propriétés du message
        else if (currentMessage && inMessages && line.indexOf(key) === 8) { // Indentation de 8 espaces
          if (key === 'name') {
            currentMessage.name = value.replace(/['"]/g, '');
          } else if (key === 'email') {
            currentMessage.email = value.replace(/['"]/g, '');
          } else if (key === 'message') {
            currentMessage.message = value.replace(/['"]/g, '');
          } else if (key === 'timestamp') {
            currentMessage.timestamp = parseInt(value) || Date.now();
          }
        }
      }
      // Nouveau message
      else if (trimmed.startsWith('- name:') && inMessages && currentArtworkId) {
        if (currentMessage) {
          interactions[currentArtworkId].messages.push(currentMessage);
        }
        currentMessage = { name: trimmed.split(':')[1].trim().replace(/['"]/g, '') };
      }
    }
    
    // Ajouter le dernier message s'il existe
    if (currentMessage && currentArtworkId) {
      interactions[currentArtworkId].messages.push(currentMessage);
    }
    
    return interactions;
  } catch (error) {
    console.error('Erreur lors du chargement des interactions:', error);
    return {};
  }
};

// Fonction pour sauvegarder les interactions (simulation - en réalité nécessiterait un backend)
const saveInteractionsToConfig = async (interactions) => {
  try {
    // En mode développement, on affiche la structure à sauvegarder
    console.log('=== INTERACTIONS À SAUVEGARDER ===');
    
    let yamlOutput = '# Configuration des interactions utilisateurs\n';
    yamlOutput += '# Ce fichier stocke les likes et messages d\'intérêt pour chaque œuvre d\'art\n\n';
    yamlOutput += 'artwork_interactions:\n';
    
    for (const [artworkId, data] of Object.entries(interactions)) {
      yamlOutput += `  ${artworkId}:\n`;
      yamlOutput += `    likes: ${data.likes || 0}\n`;
      yamlOutput += `    messages:\n`;
      
      if (data.messages && data.messages.length > 0) {
        for (const message of data.messages) {
          yamlOutput += `      - name: "${message.name}"\n`;
          yamlOutput += `        email: "${message.email}"\n`;
          yamlOutput += `        message: "${message.message}"\n`;
          yamlOutput += `        timestamp: ${message.timestamp}\n`;
        }
      }
      yamlOutput += '\n';
    }
    
    console.log(yamlOutput);
    console.log('=== FIN INTERACTIONS À SAUVEGARDER ===');
    
    // Dans un vrai projet, il faudrait un endpoint backend pour sauvegarder
    // Pour l'instant, on stocke temporairement dans localStorage comme fallback
    localStorage.setItem('nart_interactions_backup', JSON.stringify(interactions));
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des interactions:', error);
    return false;
  }
};

// Fonction pour charger la configuration des œuvres depuis le fichier YAML
const loadArtworksFromConfig = async () => {
  try {
    const response = await fetch(getAssetPath('artworks/config.yaml'));
    if (!response.ok) {
      throw new Error('Impossible de charger le fichier de configuration');
    }
    const yamlText = await response.text();
    
    // Parser YAML simple (sans dépendance externe pour commencer)
    const lines = yamlText.split('\n');
    const artworks = [];
    let currentArtwork = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- id:')) {
        if (currentArtwork) artworks.push(currentArtwork);
        currentArtwork = { 
          id: trimmed.split(':')[1].trim().replace(/['"]/g, ''),
          likes: 0,
          interested: 0
        };
      } else if (currentArtwork) {
        if (trimmed.startsWith('title:')) {
          currentArtwork.title = trimmed.split(':')[1].trim().replace(/['"]/g, '');
        } else if (trimmed.startsWith('description:')) {
          currentArtwork.description = trimmed.split(':')[1].trim().replace(/['"]/g, '');
        } else if (trimmed.startsWith('dimensions:')) {
          currentArtwork.dimensions = trimmed.split(':')[1].trim().replace(/['"]/g, '');
        } else if (trimmed.startsWith('image:')) {
          currentArtwork.image = getAssetPath(`artworks/${trimmed.split(':')[1].trim().replace(/['"]/g, '')}`);
        }
      }
    }
    if (currentArtwork) artworks.push(currentArtwork);
    
    // Charger les interactions et les appliquer aux œuvres
    const interactions = await loadInteractionsFromConfig();
    const artworksWithInteractions = artworks.map(artwork => ({
      ...artwork,
      likes: interactions[artwork.id]?.likes || 0,
      interested: interactions[artwork.id]?.messages?.length || 0
    }));
    
    return artworksWithInteractions;
  } catch (error) {
    console.error('Erreur lors du chargement des œuvres:', error);
    // Fallback vers les œuvres par défaut
    return [
      {
        id: "default-1",
        title: "Exemple d'œuvre",
        image: "https://via.placeholder.com/400x300/a13c2f/ffffff?text=Votre+Oeuvre",
        description: "Ajoutez vos propres œuvres via le fichier config.yaml",
        dimensions: "50x70 cm",
        likes: 0,
        interested: 0
      }
    ];
  }
};

const Gallery = () => {
  
  // Charger les œuvres depuis le fichier de configuration
  const [artworks, setArtworks] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormIdx, setShowFormIdx] = useState(null);
  const [interestForm, setInterestForm] = useState({ name: '', email: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null); // 'sending', 'success', 'error'

  // Charger les œuvres et interactions au montage du composant
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Charger les œuvres et interactions en parallèle
      const [configArtworks, loadedInteractions] = await Promise.all([
        loadArtworksFromConfig(),
        loadInteractionsFromConfig()
      ]);
      
      setArtworks(configArtworks);
      setInteractions(loadedInteractions);
      
      // Mettre à jour les interests depuis les interactions chargées
      const allMessages = [];
      for (const [artworkId, data] of Object.entries(loadedInteractions)) {
        if (data.messages && Array.isArray(data.messages)) {
          data.messages.forEach(message => {
            allMessages.push({
              ...message,
              artworkId,
              artTitle: configArtworks.find(art => art.id === artworkId)?.title || 'Œuvre inconnue'
            });
          });
        }
      }
      setInterests(allMessages);
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Filtrer les œuvres par recherche seulement
  const filteredArtworks = artworks.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         art.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Fonction pour envoyer un email avec EmailJS
  const sendEmail = async (artworkTitle, userName, userEmail, userMessage) => {
    try {
      const templateParams = {
        to_name: 'Galerie NArt', // Votre nom
        from_name: userName,
        from_email: userEmail,
        artwork_title: artworkTitle,
        message: userMessage || 'Aucun message spécifique.',
        reply_to: userEmail
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log('Email envoyé avec succès:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return { success: false, error };
    }
  };

  // Gestion des likes avec système de fichiers
  const handleLike = async (artworkId) => {
    // Mettre à jour les interactions localement
    const newInteractions = { ...interactions };
    if (!newInteractions[artworkId]) {
      newInteractions[artworkId] = { likes: 0, messages: [] };
    }
    newInteractions[artworkId].likes = (newInteractions[artworkId].likes || 0) + 1;
    
    // Mettre à jour l'état local
    setInteractions(newInteractions);
    
    // Mettre à jour les œuvres pour refléter le nouveau nombre de likes
    setArtworks(prevArtworks => 
      prevArtworks.map(art => 
        art.id === artworkId 
          ? { ...art, likes: newInteractions[artworkId].likes }
          : art
      )
    );
    
    // Sauvegarder les interactions
    await saveInteractionsToConfig(newInteractions);
  };

  // Gestion des messages d'intérêt avec système de fichiers et envoi d'email
  const handleInterest = async (artworkId, name, email, message) => {
    setEmailStatus('sending');
    
    const artwork = artworks.find(art => art.id === artworkId);
    const newMessage = {
      name,
      email,
      message,
      timestamp: Date.now()
    };
    
    try {
      // Envoyer l'email d'abord
      const emailResult = await sendEmail(artwork.title, name, email, message);
      
      if (!emailResult.success) {
        setEmailStatus('error');
        setTimeout(() => setEmailStatus(null), 5000);
        return;
      }

      // Si l'email est envoyé avec succès, sauvegarder dans les interactions
      const newInteractions = { ...interactions };
      if (!newInteractions[artworkId]) {
        newInteractions[artworkId] = { likes: 0, messages: [] };
      }
      newInteractions[artworkId].messages.push(newMessage);
      
      // Mettre à jour l'état local des interactions
      setInteractions(newInteractions);
      
      // Mettre à jour les interests pour la liste des messages
      const newInterest = {
        ...newMessage,
        artworkId,
        artTitle: artwork.title
      };
      setInterests([...interests, newInterest]);
      
      // Mettre à jour les œuvres pour refléter le nouveau nombre d'intéressés
      setArtworks(prevArtworks => 
        prevArtworks.map(art => 
          art.id === artworkId 
            ? { ...art, interested: newInteractions[artworkId].messages.length }
            : art
        )
      );
      
      // Sauvegarder les interactions
      await saveInteractionsToConfig(newInteractions);
      
      setEmailStatus('success');
      setShowFormIdx(null);
      setInterestForm({ name: '', email: '', message: '' });
      
      // Réinitialiser le status après 5 secondes
      setTimeout(() => setEmailStatus(null), 5000);
      
    } catch (error) {
      console.error('Erreur lors du traitement de l\'intérêt:', error);
      setEmailStatus('error');
      setTimeout(() => setEmailStatus(null), 5000);
    }
  };

  return (
    <>
      {/* Styles pour les animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
      
      <section 
      id="gallery-section"
      className="gallery-container"
      style={{
        padding: '4rem 2rem 6rem',
        background: `
          linear-gradient(135deg, rgba(248, 246, 242, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%),
          radial-gradient(circle at 15% 20%, rgba(161, 60, 47, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 85% 80%, rgba(161, 60, 47, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 45% 60%, rgba(44, 62, 80, 0.04) 0%, transparent 40%),
          linear-gradient(45deg, #f8f6f2 0%, #ffffff 50%, #f0ede7 100%)
        `,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* Notification d'envoi d'email */}
        {emailStatus && (
          <div style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: '15px',
            background: emailStatus === 'success' 
              ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
              : emailStatus === 'error'
              ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
              : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.9rem',
            zIndex: 10000,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            animation: 'slideInRight 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {emailStatus === 'success' && '✅ Email envoyé avec succès !'}
            {emailStatus === 'error' && '❌ Erreur lors de l\'envoi de l\'email'}
            {emailStatus === 'sending' && '📧 Envoi de l\'email en cours...'}
          </div>
        )}

        {/* Effet décoratif en arrière-plan */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(161, 60, 47, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 1
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '100px',
          right: '-30px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(44, 62, 80, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          zIndex: 1
        }}></div>

        {/* Indicateur de chargement */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            fontSize: '1.2rem',
            color: '#a13c2f'
          }}>
            🎨 Chargement de la galerie...
          </div>
        )}
        
        {/* Barre de recherche élégante pour visiteurs */}
        {!loading && (
          <div style={{
            marginBottom: '4rem', 
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(15px)',
              borderRadius: '30px',
              padding: '2.5rem',
              boxShadow: '0 20px 60px rgba(161, 60, 47, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              maxWidth: '650px',
              width: '100%',
              margin: '0 auto',
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
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
              
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
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
                    fontFamily: "'Roboto', sans-serif",
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#2c3e50',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left'
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
                fontFamily: "'Roboto', sans-serif",
                fontWeight: '500'
              }}>
                ✨ {filteredArtworks.length} œuvre{filteredArtworks.length > 1 ? 's' : ''} disponible{filteredArtworks.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Grille d'œuvres modernisée */}
        {!loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2.5rem',
            padding: '0 1rem'
          }}>
            {filteredArtworks.map((art) => {
            return (
              <div 
                key={art.id}
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
                    onClick={() => setSelectedImageModal(art)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  
                  {/* Badge corner avec stats */}
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
                </div>
                
                <div style={{padding: '2rem'}}>
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '1rem',
                    lineHeight: '1.3'
                  }}>
                    {art.title}
                  </h3>
                  
                  {art.description && (
                    <p style={{
                      fontSize: '1rem',
                      color: '#5a6c7d',
                      lineHeight: '1.5',
                      marginBottom: '1.5rem',
                      fontFamily: "'Roboto', sans-serif"
                    }}>
                      {art.description}
                    </p>
                  )}
                  
                  {/* Formulaire d'intérêt intégré dans la carte */}
                  {showFormIdx === art.id ? (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleInterest(art.id, interestForm.name, interestForm.email, interestForm.message);
                    }} style={{
                      background: 'rgba(161, 60, 47, 0.05)',
                      padding: '1.5rem',
                      borderRadius: '15px',
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{color: '#a13c2f', marginBottom: '1rem', fontSize: '1.1rem'}}>💌 Montrer votre intérêt</h4>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        value={interestForm.name}
                        onChange={e => setInterestForm({...interestForm, name: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          marginBottom: '0.8rem',
                          borderRadius: '10px',
                          border: '2px solid rgba(161, 60, 47, 0.2)',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
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
                          padding: '0.7rem',
                          marginBottom: '0.8rem',
                          borderRadius: '10px',
                          border: '2px solid rgba(161, 60, 47, 0.2)',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                      <textarea
                        placeholder="Message (optionnel)"
                        value={interestForm.message}
                        onChange={e => setInterestForm({...interestForm, message: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          marginBottom: '1rem',
                          borderRadius: '10px',
                          border: '2px solid rgba(161, 60, 47, 0.2)',
                          fontSize: '0.9rem',
                          minHeight: '80px',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{
                        display: 'flex', 
                        gap: '0.8rem',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <button 
                          type="submit" 
                          disabled={emailStatus === 'sending'}
                          style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '15px',
                            background: emailStatus === 'sending' 
                              ? 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)'
                              : 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            cursor: emailStatus === 'sending' ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            opacity: emailStatus === 'sending' ? 0.7 : 1
                          }}
                        >
                          {emailStatus === 'sending' ? '📧 Envoi...' : '✉️ Envoyer'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowFormIdx(null)}
                          style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '15px',
                            background: '#ddd',
                            color: '#333',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : null}
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.8rem',
                    marginTop: '1.5rem',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                        <button 
                          onClick={() => handleLike(art.id)} 
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
                          ❤️ J'adore ({art.likes})
                        </button>
                        
                        <button 
                          onClick={() => setShowFormIdx(art.id)}
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
                          💌 Ça m'intéresse
                        </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Modal pour affichage image en grand */}
        {selectedImageModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setSelectedImageModal(null)}
          >
            <div style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton fermer */}
              <button 
                onClick={() => setSelectedImageModal(null)} 
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '0',
                  background: 'rgba(161, 60, 47, 0.9)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  zIndex: 10001,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(161, 60, 47, 1)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(161, 60, 47, 0.9)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
              
              {/* Image principale */}
              <img 
                src={selectedImageModal.image} 
                alt={selectedImageModal.title} 
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  borderRadius: '15px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
              />
              
              {/* Titre discret */}
              <h3 style={{
                color: '#2c3e50',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                fontWeight: '600',
                marginTop: '1.5rem',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(255, 255, 255, 0.8)',
                letterSpacing: '0.05em',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(161, 60, 47, 0.2)'
              }}>
                {selectedImageModal.title}
              </h3>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default Gallery;
