import React, { useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

/**
 * Composant de test Firebase - À utiliser temporairement pour valider la configuration
 * Supprimer ce composant après migration réussie
 */
const FirebaseTest = () => {
  const [status, setStatus] = useState('⏳ Initialisation...');
  const [interactions, setInteractions] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  useEffect(() => {
    const runTests = async () => {
      try {
        addTestResult('🔥 Test de connexion Firebase...', 'info');
        
        // Test 1: Chargement des interactions
        await firebaseService.loadInteractions();
        const data = firebaseService.getInteractions();
        setInteractions(data);
        addTestResult('✅ Connexion Firebase réussie', 'success');
        addTestResult(`📊 Données chargées: ${Object.keys(data.likes || {}).length} likes, ${Object.keys(data.interests || {}).length} interests`, 'info');

        // Test 2: Ajout d'un like test
        addTestResult('🧪 Test d\'ajout de like...', 'info');
        const likeSuccess = await firebaseService.addLike('test-artwork');
        if (likeSuccess) {
          addTestResult('✅ Ajout de like réussi', 'success');
          const likes = firebaseService.getLikes('test-artwork');
          addTestResult(`💖 Likes pour test-artwork: ${likes}`, 'info');
        } else {
          addTestResult('❌ Échec de l\'ajout de like', 'error');
        }

        // Test 3: Ajout d'un intérêt test
        addTestResult('🧪 Test d\'ajout d\'intérêt...', 'info');
        const interestSuccess = await firebaseService.addInterest('test-artwork');
        if (interestSuccess) {
          addTestResult('✅ Ajout d\'intérêt réussi', 'success');
          const interests = firebaseService.getInterests('test-artwork');
          addTestResult(`📩 Intérêts pour test-artwork: ${interests}`, 'info');
        } else {
          addTestResult('❌ Échec de l\'ajout d\'intérêt', 'error');
        }

        // Test 4: Statistiques
        const stats = firebaseService.getStats();
        addTestResult(`📈 Statistiques: ${stats.totalLikes} likes, ${stats.totalInterests} intérêts, ${stats.totalArtworks} œuvres`, 'info');

        setStatus('✅ Tests terminés');

      } catch (error) {
        console.error('Erreur lors des tests:', error);
        addTestResult(`❌ Erreur: ${error.message}`, 'error');
        setStatus('❌ Erreur de configuration');
      }
    };

    runTests();
  }, []);

  const clearTestData = async () => {
    try {
      addTestResult('🧹 Nettoyage des données de test...', 'info');
      // Note: En production, vous pourriez vouloir ajouter une fonction de nettoyage
      addTestResult('ℹ️ Nettoyage manuel requis dans Firebase Console', 'info');
    } catch (error) {
      addTestResult(`❌ Erreur de nettoyage: ${error.message}`, 'error');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '20px auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <h2>🔥 Test de Configuration Firebase</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {status}
      </div>

      {interactions && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
          <h3>📊 Données actuelles:</h3>
          <pre>{JSON.stringify(interactions, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>📋 Log des tests:</h3>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '4px'
        }}>
          {testResults.map((result, index) => (
            <div 
              key={index} 
              style={{ 
                color: result.type === 'error' ? 'red' : result.type === 'success' ? 'green' : 'black',
                marginBottom: '5px'
              }}
            >
              <small>{result.timestamp}</small> - {result.message}
            </div>
          ))}
        </div>
      </div>

      <div>
        <button 
          onClick={clearTestData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🧹 Nettoyer les données de test
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>⚠️ Instructions:</strong>
        <ol>
          <li>Si les tests échouent, vérifiez votre configuration Firebase</li>
          <li>Assurez-vous que les règles Firestore sont déployées</li>
          <li>Vérifiez la console de votre navigateur pour plus de détails</li>
          <li>Supprimez ce composant après migration réussie</li>
        </ol>
      </div>
    </div>
  );
};

export default FirebaseTest;
