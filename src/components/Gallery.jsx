import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/emailConfig';
import firebaseService from '../services/firebaseService';
import { getAssetPath } from '../utils/assetUtils';
import { trackArtworkView, trackInterestClick, trackGalleryNavigation, trackLikeAction, trackSearchUsage, trackContactInterest } from '../utils/analytics';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { usePageTimeTracking, useInteractionTracking } from '../hooks/useAnalytics';
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
        } else if (trimmed.startsWith('category:')) {
          currentArtwork.category = trimmed.split(':')[1].trim().replace(/['"]/g, '');
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
    // Fallback vers les œuvres basées sur votre config.yaml
    const fallbackArtworks = [
      {
        id: "abstrait",
        title: "Abstraction Moderne",
        image: getAssetPath('artworks/abstrait.jpg'),
        description: "Une œuvre abstraite exprimant les émotions à travers les formes et les couleurs.",
        dimensions: "50x70 cm",
        likes: 0,
        interested: 0
      },
      {
        id: "bateau",
        title: "Navigation",
        image: getAssetPath('artworks/bateau.jpg'),
        description: "Une peinture maritime capturant l'essence de la navigation et des horizons infinis.",
        dimensions: "60x80 cm",
        likes: 0,
        interested: 0
      },
      {
        id: "beach",
        title: "Plage Sereine",
        image: getAssetPath('artworks/beach.jpg'),
        description: "Un paysage côtier paisible évoquant la tranquillité des bords de mer.",
        dimensions: "50x70 cm",
        likes: 0,
        interested: 0
      },
      {
        id: "boujie",
        title: "Élégance",
        image: getAssetPath('artworks/boujie.jpg'),
        description: "Une œuvre sophistiquée reflétant le raffinement et l'élégance artistique.",
        dimensions: "40x60 cm",
        likes: 0,
        interested: 0
      },
      {
        id: "collection",
        title: "Collection Privée",
        image: getAssetPath('artworks/collection.jpg'),
        description: "Une pièce unique faisant partie d'une collection artistique personnelle.",
        dimensions: "55x75 cm",
        likes: 0,
        interested: 0
      },
      {
        id: "oiseaux",
        title: "Envol",
        image: getAssetPath('artworks/oiseaux.jpg'),
        description: "Représentation artistique des oiseaux symbolisant la liberté et l'évasion.",
        dimensions: "45x65 cm",
        likes: 0,
        interested: 0
      },
      {
        id: "vase",
        title: "Nature Morte",
        image: getAssetPath('artworks/vase.jpg'),
        description: "Étude contemplative d'objets du quotidien transformés en art.",
        dimensions: "40x50 cm",
        likes: 0,
        interested: 0
      }
    ];
    
    console.log('Utilisation des œuvres de fallback');
    return fallbackArtworks;
  }
};

const Gallery = () => {
  
  // Hooks Analytics
  const analytics = useAnalytics();
  usePageTimeTracking('Gallery');
  const { trackClick, trackScroll } = useInteractionTracking();
  
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
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Charger les œuvres et interactions au montage du composant
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        console.log('🔄 Début du chargement des données...');
        
        // Charger les œuvres depuis config.yaml
        const configArtworks = await loadArtworksFromConfig();
        console.log('📁 Œuvres chargées:', configArtworks.length);
        
        // Charger les statistiques depuis Firebase
        await firebaseService.loadInteractions();
        const firebaseStats = firebaseService.getInteractions();
        console.log('📊 Statistiques Firebase chargées:', firebaseStats);
        
        // Fusionner les œuvres avec leurs statistiques Firebase
        const artworksWithStats = configArtworks.map(artwork => {
          const likes = firebaseService.getLikes(artwork.id);
          const interested = firebaseService.getInterests(artwork.id);
          console.log(`🎨 ${artwork.id}: likes=${likes}, interested=${interested}`);
          return {
            ...artwork,
            likes,
            interested
          };
        });
        
        console.log('✅ Données finales:', artworksWithStats);
        setArtworks(artworksWithStats);
        setInteractions(firebaseStats);
        
        // Écouter les changements en temps réel
        const unsubscribe = firebaseService.subscribeToInteractions((newInteractions) => {
          console.log('🔄 Mise à jour en temps réel:', newInteractions);
          setInteractions(newInteractions);
          
          // Mettre à jour les œuvres avec les nouvelles données
          setArtworks(prevArtworks => 
            prevArtworks.map(artwork => ({
              ...artwork,
              likes: firebaseService.getLikes(artwork.id),
              interested: firebaseService.getInterests(artwork.id)
            }))
          );
        });
        
        // Nettoyer l'abonnement au démontage
        return () => unsubscribe();
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Suivi du défilement pour Analytics
  useEffect(() => {
    let scrollTimeout;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = new Set();

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;

        // Tracker les seuils de défilement
        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
            trackedThresholds.add(threshold);
            trackScroll(threshold, 'Gallery');
          }
        });
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackScroll]);

  // Nettoyer les abonnements Firebase au démontage du composant
  useEffect(() => {
    return () => {
      firebaseService.unsubscribeAll();
    };
  }, []);  // Fonctions pour gérer les modales avec tracking
  const handleImageModalOpen = (artwork) => {
    setSelectedImageModal(artwork);
    
    // Tracker l'ouverture de la modale et la vue détaillée de l'œuvre
    analytics.trackArtwork('detail', artwork.id, artwork.title);
    analytics.trackModal('open', 'artwork_image', artwork.id);
    trackClick('artwork_image', artwork.id, { artwork_title: artwork.title });
  };

  const handleImageModalClose = () => {
    if (selectedImageModal) {
      analytics.trackModal('close', 'artwork_image');
    }
    setSelectedImageModal(null);
  };
  const handleSearchChange = (searchValue) => {
    setSearchTerm(searchValue);
    
    // Tracker la recherche si elle contient au moins 2 caractères
    if (searchValue.length >= 2) {
      const resultsCount = artworks.filter(art => 
        art.title.toLowerCase().includes(searchValue.toLowerCase()) || 
        art.description.toLowerCase().includes(searchValue.toLowerCase())
      ).length;
      
      analytics.trackSearch(searchValue, resultsCount);
      trackClick('search_input', 'gallery_search', { 
        search_term: searchValue,
        results_count: resultsCount 
      });
    }
  };

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

  // Gestion des likes avec Firebase
  const handleLike = async (artworkId) => {
    try {
      const artwork = artworks.find(art => art.id === artworkId);
      
      // Tracker l'action de like
      if (artwork) {
        analytics.trackArtwork('like', artworkId, artwork.title);
        trackClick('like_button', artworkId, { artwork_title: artwork.title });
      }
      
      // Incrémenter les likes via Firebase
      const success = await firebaseService.addLike(artworkId);
      
      if (success) {
        console.log(`✅ Like ajouté pour ${artworkId}`);
        // Firebase mettra à jour automatiquement via la subscription temps réel
        // Pas besoin de mettre à jour manuellement l'état local
      } else {
        console.error('❌ Échec de l\'ajout du like');
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  // Gestion des messages d'intérêt avec système de fichiers et envoi d'email
  const handleInterest = async (artworkId, name, email, message) => {
    setEmailStatus('sending');
    
    const artwork = artworks.find(art => art.id === artworkId);
    
    // Tracker l'action d'intérêt
    if (artwork) {
      analytics.trackArtwork('interest', artworkId, artwork.title);
      analytics.trackArtwork('contact', artworkId, artwork.title);
      trackClick('interest_button', artworkId, { 
        artwork_title: artwork.title,
        user_email: email 
      });
    }
    
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

      // Si l'email est envoyé avec succès, sauvegarder dans les interactions avec Firebase
      try {
        const success = await firebaseService.addInterest(artworkId);
        
        if (success) {
          console.log(`✅ Intérêt ajouté pour ${artworkId}`);
          
          // Ajouter le message à la liste locale des interests pour l'affichage
          const newInterest = {
            ...newMessage,
            artworkId,
            artTitle: artwork.title
          };
          setInterests([...interests, newInterest]);
          
          // Firebase mettra à jour automatiquement via la subscription temps réel
          // Pas besoin de mettre à jour manuellement les œuvres
        } else {
          console.error('❌ Échec de l\'ajout de l\'intérêt');
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des interactions:', error);
      }
      
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
        minHeight: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(248, 246, 242, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
      }}>
      
      {/* Contenu principal */}
      <div style={{ position: 'relative', zIndex: 2 }}>
      <div style={{
        maxWidth: isMobile ? '100%' : '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 3,
        padding: isMobile ? '0' : '0 2rem'
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
                  onChange={e => handleSearchChange(e.target.value)}
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
          <div 
            className="gallery-grid-responsive"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: isMobile ? '1rem' : '2.5rem',
              padding: isMobile ? '0' : '0 1rem',
              margin: isMobile ? '0' : 'auto',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
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
                    onClick={() => handleImageModalOpen(art)}
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
                          boxSizing: 'border-box',
                          color: '#2c3e50',
                          background: 'rgba(255, 255, 255, 0.9)'
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
                          boxSizing: 'border-box',
                          color: '#2c3e50',
                          background: 'rgba(255, 255, 255, 0.9)'
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
                          boxSizing: 'border-box',
                          color: '#2c3e50',
                          background: 'rgba(255, 255, 255, 0.9)'
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
          onClick={handleImageModalClose}
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
                onClick={handleImageModalClose} 
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
      </div>
    </section>
    </>
  );
};

export default Gallery;
