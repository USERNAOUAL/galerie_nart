import React, { useState, useEffect } from 'react';
import { trackEvent, trackPageView, trackArtworkView } from '../utils/analytics';

const AnalyticsDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({
    gaLoaded: false,
    measurementId: '',
    analyticsEnabled: false,
    events: []
  });

  useEffect(() => {
    // Vérifier si GA est chargé
    const checkGA = () => {
      const gaLoaded = typeof window.gtag !== 'undefined';
      const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-74HV4SGR7P';
      const analyticsEnabled = import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
      
      setDebugInfo(prev => ({
        ...prev,
        gaLoaded,
        measurementId,
        analyticsEnabled
      }));
    };

    checkGA();
    
    // Vérifier toutes les 1 seconde pendant 10 secondes
    const interval = setInterval(checkGA, 1000);
    setTimeout(() => clearInterval(interval), 10000);
  }, []);

  const testEvent = (eventName) => {
    const timestamp = new Date().toLocaleTimeString();
    
    switch(eventName) {
      case 'page_view':
        trackPageView(window.location.href, 'Test Page View');
        break;
      case 'artwork_view':
        trackArtworkView('test-artwork', 'Test Artwork', 'Test Category');
        break;
      case 'custom_event':
        trackEvent('test_custom_event', {
          event_category: 'test',
          event_label: 'debug_test',
          value: 1
        });
        break;
    }
    
    setDebugInfo(prev => ({
      ...prev,
      events: [
        ...prev.events,
        { event: eventName, time: timestamp, status: 'sent' }
      ].slice(-10) // Garder seulement les 10 derniers
    }));
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: 'white', 
      border: '2px solid #a13c2f',
      borderRadius: '10px',
      padding: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#a13c2f' }}>🔍 Analytics Debugger</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <div><strong>GA Chargé:</strong> {debugInfo.gaLoaded ? '✅' : '❌'}</div>
        <div><strong>ID:</strong> {debugInfo.measurementId}</div>
        <div><strong>Activé:</strong> {debugInfo.analyticsEnabled ? '✅' : '❌'}</div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => testEvent('page_view')}
          style={{ 
            margin: '2px', 
            padding: '5px 8px', 
            fontSize: '10px',
            background: '#a13c2f',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Test Page View
        </button>
        <button 
          onClick={() => testEvent('artwork_view')}
          style={{ 
            margin: '2px', 
            padding: '5px 8px', 
            fontSize: '10px',
            background: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Test Artwork
        </button>
        <button 
          onClick={() => testEvent('custom_event')}
          style={{ 
            margin: '2px', 
            padding: '5px 8px', 
            fontSize: '10px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Test Custom
        </button>
      </div>

      <div>
        <strong>Événements récents:</strong>
        <div style={{ maxHeight: '100px', overflowY: 'auto', background: '#f5f5f5', padding: '5px', borderRadius: '3px', marginTop: '5px' }}>
          {debugInfo.events.length === 0 ? (
            <div>Aucun événement encore</div>
          ) : (
            debugInfo.events.map((event, index) => (
              <div key={index} style={{ fontSize: '10px' }}>
                {event.time}: {event.event} {event.status === 'sent' ? '✅' : '❌'}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDebugger;
