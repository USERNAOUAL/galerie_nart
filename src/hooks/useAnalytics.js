import { useEffect, useRef, useState } from 'react';
import { 
  trackUserSession, 
  trackPerformance, 
  trackPageView,
  trackEvent 
} from '../utils/analytics';

// Hook pour suivre les sessions utilisateur
export const useSessionTracking = () => {
  const sessionStartTime = useRef(Date.now());
  const pageViews = useRef(0);
  const interactions = useRef(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Incrémenter les vues de page
  const incrementPageView = () => {
    pageViews.current += 1;
  };

  // Incrémenter les interactions
  const incrementInteraction = () => {
    interactions.current += 1;
  };

  // Envoyer les données de session à la fin
  const endSession = () => {
    const sessionDuration = Date.now() - sessionStartTime.current;
    const sessionData = {
      session_id: sessionId,
      duration: Math.round(sessionDuration / 1000), // en secondes
      page_views: pageViews.current,
      interactions: interactions.current,
      timestamp: sessionStartTime.current
    };
    
    trackUserSession(sessionData);
  };

  // Nettoyer à la fermeture de la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endSession();
    };
  }, []);

  return {
    sessionId,
    incrementPageView,
    incrementInteraction,
    endSession
  };
};

// Hook pour suivre les performances
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Mesurer le temps de chargement initial
    const measureLoadTime = () => {
      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        if (loadTime > 0) {
          trackPerformance('page_load_time', Math.round(loadTime), 'ms');
        }
      }
    };

    // Mesurer avec l'API Performance Observer si disponible
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            trackPerformance('dom_content_loaded', Math.round(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart), 'ms');
            trackPerformance('first_paint', Math.round(entry.loadEventEnd - entry.loadEventStart), 'ms');
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      return () => observer.disconnect();
    } else {
      // Fallback pour les navigateurs plus anciens
      setTimeout(measureLoadTime, 1000);
    }
  }, []);
};

// Hook pour suivre le temps passé sur une page
export const usePageTimeTracking = (pageName) => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const timeSpent = Date.now() - startTime.current;
      trackEvent('page_time_spent', {
        event_category: 'User_Engagement',
        event_label: `Time on ${pageName}`,
        page_name: pageName,
        time_spent: Math.round(timeSpent / 1000), // en secondes
        value: Math.min(Math.round(timeSpent / 1000), 300) // Cap à 5 minutes pour la valeur
      });
    };
  }, [pageName]);
};

// Hook pour suivre les interactions utilisateur
export const useInteractionTracking = () => {
  const trackClick = (elementType, elementId, additionalData = {}) => {
    trackEvent('user_interaction', {
      event_category: 'UI_Interaction',
      event_label: `Click - ${elementType}`,
      element_type: elementType,
      element_id: elementId,
      ...additionalData
    });
  };

  const trackHover = (elementType, elementId, duration = null) => {
    trackEvent('user_hover', {
      event_category: 'UI_Interaction',
      event_label: `Hover - ${elementType}`,
      element_type: elementType,
      element_id: elementId,
      hover_duration: duration
    });
  };

  const trackScroll = (scrollDepth, pageName) => {
    trackEvent('scroll_depth', {
      event_category: 'User_Engagement',
      event_label: `Scroll ${scrollDepth}% - ${pageName}`,
      scroll_depth: scrollDepth,
      page_name: pageName
    });
  };

  return {
    trackClick,
    trackHover,
    trackScroll
  };
};

// Hook pour suivre les erreurs
export const useErrorTracking = () => {
  useEffect(() => {
    const handleError = (error) => {
      trackEvent('javascript_error', {
        event_category: 'Error',
        event_label: error.message || 'Unknown error',
        error_message: error.message,
        error_filename: error.filename,
        error_lineno: error.lineno,
        error_colno: error.colno
      });
    };

    const handleUnhandledRejection = (event) => {
      trackEvent('promise_rejection', {
        event_category: 'Error',
        event_label: 'Unhandled Promise Rejection',
        error_reason: event.reason?.toString() || 'Unknown rejection'
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};
