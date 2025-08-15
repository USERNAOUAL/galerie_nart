import React, { useEffect } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { 
  trackEvent, 
  trackPageView, 
  trackArtworkView,
  trackPerformance,
  GA_MEASUREMENT_ID,
  ANALYTICS_ENABLED 
} from '../utils/analytics';

const AnalyticsTest = () => {
  const analytics = useAnalytics();

  useEffect(() => {
    console.log('🧪 Test Analytics initié');
    console.log('📊 Analytics activées:', ANALYTICS_ENABLED);
    console.log('🆔 Measurement ID:', GA_MEASUREMENT_ID);
    console.log('🪟 gtag disponible:', typeof window.gtag !== 'undefined');
  }, []);

  const runTests = () => {
    console.log('🚀 Début des tests Analytics');

    // Test 1: Événement personnalisé simple
    trackEvent('test_event', {
      event_category: 'Test',
      event_label: 'Analytics Test',
      test_value: 123
    });

    // Test 2: Vue de page
    trackPageView(window.location.href, 'Analytics Test Page');

    // Test 3: Vue d'œuvre d'art
    trackArtworkView('test_artwork', 'Test Artwork Title');

    // Test 4: Utilisation du contexte Analytics
    analytics.trackArtwork('view', 'context_test', 'Context Test Artwork');
    analytics.trackSearch('test search', 5);
    analytics.trackModal('open', 'test_modal', 'test_artwork');

    // Test 5: Performance
    trackPerformance('test_metric', 1234, 'ms');

    // Test 6: Événement personnalisé avec le contexte
    analytics.trackCustomEvent('custom_test', {
      test_category: 'Custom',
      test_data: 'success'
    });

    console.log('✅ Tests Analytics terminés - Vérifiez la console Network et Google Analytics');
  };

  const testErrorTracking = () => {
    console.log('🔥 Test de tracking d\'erreur');
    // Simuler une erreur
    setTimeout(() => {
      throw new Error('Test error for Analytics tracking');
    }, 100);
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🧪 Test Google Analytics</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Configuration actuelle</h2>
        <ul>
          <li><strong>Analytics activées:</strong> {ANALYTICS_ENABLED ? '✅ Oui' : '❌ Non'}</li>
          <li><strong>Measurement ID:</strong> {GA_MEASUREMENT_ID}</li>
          <li><strong>gtag chargé:</strong> {typeof window.gtag !== 'undefined' ? '✅ Oui' : '❌ Non'}</li>
          <li><strong>dataLayer disponible:</strong> {window.dataLayer ? '✅ Oui' : '❌ Non'}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Tests disponibles</h2>
        <button 
          onClick={runTests}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
            marginBottom: '10px'
          }}
        >
          🧪 Lancer tous les tests
        </button>
        
        <button 
          onClick={testErrorTracking}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          🔥 Test tracking d'erreur
        </button>
      </div>

      <div>
        <h2>Instructions</h2>
        <ol>
          <li>Ouvrez les outils de développement (F12)</li>
          <li>Allez dans l'onglet <strong>Network</strong></li>
          <li>Filtrez par "google-analytics" ou "analytics"</li>
          <li>Cliquez sur "Lancer tous les tests"</li>
          <li>Vérifiez que les requêtes sont envoyées vers Google Analytics</li>
          <li>Consultez également la console pour les logs de debug</li>
        </ol>
        
        <p><strong>Note:</strong> Les données peuvent prendre quelques minutes à apparaître dans Google Analytics.</p>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Vérification Google Analytics</h3>
        <p>Pour vérifier que les données arrivent dans Google Analytics :</p>
        <ol>
          <li>Connectez-vous à <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">Google Analytics</a></li>
          <li>Sélectionnez votre propriété Galerie N'ART</li>
          <li>Allez dans "Rapports" → "Temps réel" → "Aperçu"</li>
          <li>Vous devriez voir les événements de test apparaître</li>
        </ol>
      </div>
    </div>
  );
};

export default AnalyticsTest;
