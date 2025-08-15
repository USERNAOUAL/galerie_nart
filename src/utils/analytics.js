// Configuration Google Analytics pour N'ART
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-74HV4SGR7P'; // ID Google Analytics de la galerie N'ART
export const GA_DEBUG = import.meta.env.VITE_GA_DEBUG === 'true';
export const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Galerie N'ART";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Initialiser Google Analytics
export const initGA = () => {
  if (!ANALYTICS_ENABLED) {
    console.log('📊 Analytics désactivées pour cet environnement');
    return;
  }

  // Charger le script Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialiser gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    // Configuration pour votre galerie d'art
    page_title: APP_NAME,
    app_name: APP_NAME,
    app_version: APP_VERSION,
    debug_mode: GA_DEBUG,
    custom_map: {
      'custom_parameter_1': 'artwork_category',
      'custom_parameter_2': 'user_interest',
      'custom_parameter_3': 'artwork_id',
      'custom_parameter_4': 'session_id'
    },
    // Configuration de confidentialité
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  console.log(`📊 Google Analytics initialisé pour ${APP_NAME} v${APP_VERSION}`);
};

// Suivre les pages vues
export const trackPageView = (url, title) => {
  if (!ANALYTICS_ENABLED) return;
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: url,
      page_title: title,
      app_name: APP_NAME,
      app_version: APP_VERSION
    });
    
    if (GA_DEBUG) {
      console.log('📊 Page View:', { url, title });
    }
  }
};

// Suivre les événements spécifiques à votre galerie
export const trackEvent = (eventName, parameters = {}) => {
  if (!ANALYTICS_ENABLED) return;
  
  if (typeof window.gtag !== 'undefined') {
    const eventData = {
      event_category: 'Gallery',
      event_label: APP_NAME,
      app_name: APP_NAME,
      app_version: APP_VERSION,
      ...parameters
    };
    
    // Log en mode debug
    if (GA_DEBUG) {
      console.log('📊 Analytics Event:', eventName, eventData);
    }
    
    window.gtag('event', eventName, eventData);
  }
};

// Événements spécifiques pour votre galerie d'art
export const trackArtworkView = (artworkId, artworkTitle) => {
  trackEvent('artwork_view', {
    event_category: 'Artwork',
    event_label: artworkTitle,
    artwork_id: artworkId,
    value: 1
  });
};

export const trackInterestClick = (artworkId, artworkTitle) => {
  trackEvent('artwork_interest', {
    event_category: 'User_Engagement',
    event_label: `Interest in ${artworkTitle}`,
    artwork_id: artworkId,
    value: 5
  });
};

export const trackContactFormSubmit = (formType = 'general') => {
  trackEvent('contact_form_submit', {
    event_category: 'Lead_Generation',
    event_label: `Contact Form - ${formType}`,
    value: 10
  });
};

export const trackGalleryNavigation = (section) => {
  trackEvent('gallery_navigation', {
    event_category: 'Navigation',
    event_label: `Gallery Section - ${section}`,
    section: section
  });
};

// Événements pour les nouvelles fonctionnalités demandées
export const trackCategoryFilter = (category) => {
  trackEvent('category_filter', {
    event_category: 'Gallery_Filter',
    event_label: `Filter by Category - ${category}`,
    category: category,
    value: 1
  });
};

export const trackSearchUsage = (searchTerm, resultsCount) => {
  trackEvent('search_artwork', {
    event_category: 'Search',
    event_label: `Search: ${searchTerm}`,
    search_term: searchTerm,
    results_count: resultsCount,
    value: 1
  });
};

export const trackArtworkDetailView = (artworkId, artworkTitle) => {
  trackEvent('artwork_detail_view', {
    event_category: 'Artwork_Detail',
    event_label: `Detail View - ${artworkTitle}`,
    artwork_id: artworkId,
    value: 2
  });
};

export const trackLikeAction = (artworkId, artworkTitle, action) => {
  trackEvent('artwork_like', {
    event_category: 'User_Engagement',
    event_label: `${action} - ${artworkTitle}`,
    artwork_id: artworkId,
    action: action, // 'like' ou 'unlike'
    value: action === 'like' ? 3 : -1
  });
};

export const trackContactInterest = (artworkId, artworkTitle) => {
  trackEvent('contact_interest', {
    event_category: 'Lead_Generation',
    event_label: `Contact Interest - ${artworkTitle}`,
    artwork_id: artworkId,
    value: 8
  });
};

export const trackModalOpen = (modalType, artworkId = null) => {
  trackEvent('modal_open', {
    event_category: 'UI_Interaction',
    event_label: `Modal - ${modalType}`,
    modal_type: modalType,
    artwork_id: artworkId,
    value: 1
  });
};

export const trackModalClose = (modalType, timeSpent = null) => {
  trackEvent('modal_close', {
    event_category: 'UI_Interaction',
    event_label: `Modal Close - ${modalType}`,
    modal_type: modalType,
    time_spent: timeSpent,
    value: 1
  });
};

export const trackUserSession = (sessionData) => {
  trackEvent('user_session', {
    event_category: 'User_Behavior',
    event_label: 'Session Analytics',
    ...sessionData
  });
};

export const trackPerformance = (metricName, value, unit = '') => {
  trackEvent('performance_metric', {
    event_category: 'Performance',
    event_label: `${metricName} - ${value}${unit}`,
    metric_name: metricName,
    metric_value: value,
    unit: unit
  });
};
