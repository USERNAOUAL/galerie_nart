import React, { createContext, useContext, useCallback } from 'react';
import { 
  trackArtworkView,
  trackInterestClick,
  trackGalleryNavigation,
  trackCategoryFilter,
  trackSearchUsage,
  trackArtworkDetailView,
  trackLikeAction,
  trackContactInterest,
  trackModalOpen,
  trackModalClose
} from '../utils/analytics';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  // Méthodes de tracking encapsulées avec validation
  const trackArtwork = useCallback((action, artworkId, artworkTitle, additionalData = {}) => {
    if (!artworkId || !artworkTitle) return;
    
    switch (action) {
      case 'view':
        trackArtworkView(artworkId, artworkTitle);
        break;
      case 'detail':
        trackArtworkDetailView(artworkId, artworkTitle);
        break;
      case 'like':
        trackLikeAction(artworkId, artworkTitle, 'like');
        break;
      case 'unlike':
        trackLikeAction(artworkId, artworkTitle, 'unlike');
        break;
      case 'interest':
        trackInterestClick(artworkId, artworkTitle);
        break;
      case 'contact':
        trackContactInterest(artworkId, artworkTitle);
        break;
      default:
        console.warn(`Action de tracking non reconnue: ${action}`);
    }
  }, []);

  const trackNavigation = useCallback((section) => {
    if (!section) return;
    trackGalleryNavigation(section);
  }, []);

  const trackFilter = useCallback((category) => {
    if (!category) return;
    trackCategoryFilter(category);
  }, []);

  const trackSearch = useCallback((searchTerm, resultsCount = 0) => {
    if (!searchTerm) return;
    trackSearchUsage(searchTerm, resultsCount);
  }, []);

  const trackModal = useCallback((action, modalType, artworkId = null, timeSpent = null) => {
    if (!modalType) return;
    
    switch (action) {
      case 'open':
        trackModalOpen(modalType, artworkId);
        break;
      case 'close':
        trackModalClose(modalType, timeSpent);
        break;
      default:
        console.warn(`Action de modal non reconnue: ${action}`);
    }
  }, []);

  // Méthode générique pour tracker des événements personnalisés
  const trackCustomEvent = useCallback((eventName, eventData = {}) => {
    if (!eventName) return;
    
    // Ajouter un timestamp automatiquement
    const enrichedData = {
      ...eventData,
      timestamp: Date.now(),
      page_url: window.location.href,
      page_title: document.title
    };

    // Log pour le debug en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, enrichedData);
    }
  }, []);

  const value = {
    trackArtwork,
    trackNavigation,
    trackFilter,
    trackSearch,
    trackModal,
    trackCustomEvent
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
