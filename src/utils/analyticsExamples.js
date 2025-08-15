// Exemples d'intégration Google Analytics dans votre galerie N'ART

// 1. Dans Gallery.jsx - Tracking des vues d'œuvres
/*
const handleArtworkClick = (artwork) => {
  // Tracker la vue de l'œuvre
  trackArtworkView(artwork.id, artwork.title);
  
  // Votre logique existante
  setSelectedArtwork(artwork);
};
*/

// 2. Dans Gallery.jsx - Tracking des "J'adore" 
/*
const handleLoveClick = (artwork) => {
  // Tracker l'intérêt pour l'œuvre
  trackInterestClick(artwork.id, artwork.title);
  
  // Votre logique existante pour les likes
  handleToggleInterest(artwork);
};
*/

// 3. Dans Contact.jsx - Tracking des soumissions de formulaire
/*
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Envoyer l'email
    await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, formData, EMAIL_CONFIG.PUBLIC_KEY);
    
    // Tracker la soumission du formulaire
    trackContactFormSubmit(formData.subject || 'general');
    
    setStatus('success');
  } catch (error) {
    setStatus('error');
  }
};
*/

// 4. Dans Menu.jsx - Tracking de la navigation
/*
const handleMenuClick = (section) => {
  // Tracker la navigation
  trackGalleryNavigation(section);
  
  // Votre logique de navigation
  navigate(section);
};
*/

import { trackEvent } from './analytics';

// 5. Événements personnalisés supplémentaires que vous pouvez ajouter

// Tracking du temps passé sur une œuvre
export const trackArtworkTimeSpent = (artworkId, timeInSeconds) => {
  trackEvent('artwork_time_spent', {
    event_category: 'Engagement',
    event_label: `Time on artwork ${artworkId}`,
    value: timeInSeconds
  });
};

// Tracking des recherches dans la galerie
export const trackGallerySearch = (searchTerm, resultsCount) => {
  trackEvent('gallery_search', {
    event_category: 'Search',
    event_label: searchTerm,
    search_term: searchTerm,
    results_count: resultsCount
  });
};

// Tracking des téléchargements (si vous proposez des catalogues)
export const trackDownload = (fileName, category) => {
  trackEvent('file_download', {
    event_category: 'Download',
    event_label: fileName,
    file_name: fileName,
    file_category: category
  });
};

// Tracking du partage social
export const trackSocialShare = (platform, artworkId) => {
  trackEvent('social_share', {
    event_category: 'Social',
    event_label: `Share on ${platform}`,
    platform: platform,
    artwork_id: artworkId
  });
};
