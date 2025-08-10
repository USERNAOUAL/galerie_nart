import React, { useState } from 'react';
import { migrateFromJsonbinToFirebase, testMigration } from '../utils/migration';

/**
 * Composant de migration JSONBin vers Firebase
 * À utiliser une seule fois pour migrer les données existantes
 */
const MigrationTool = () => {
  const [status, setStatus] = useState('ready');
  const [logs, setLogs] = useState([]);
  const [migrationData, setMigrationData] = useState(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const runTest = async () => {
    setStatus('testing');
    setLogs([]);
    addLog('🧪 Début du test de migration...', 'info');

    try {
      const result = await testMigration();
      
      if (result.ready) {
        addLog('✅ Test réussi - Migration possible', 'success');
        addLog(`📊 JSONBin: ${Object.keys(result.jsonbin.likes || {}).length} likes, ${Object.keys(result.jsonbin.interests || {}).length} interests`, 'info');
        addLog(`📊 Firebase: ${Object.keys(result.firebase.likes || {}).length} likes, ${Object.keys(result.firebase.interests || {}).length} interests`, 'info');
      } else {
        addLog(`❌ Test échoué: ${result.error}`, 'error');
      }
      
      setStatus('ready');
    } catch (error) {
      addLog(`❌ Erreur de test: ${error.message}`, 'error');
      setStatus('ready');
    }
  };

  const runMigration = async () => {
    setStatus('migrating');
    setLogs([]);
    addLog('🚀 Début de la migration...', 'info');

    try {
      const result = await migrateFromJsonbinToFirebase();
      setMigrationData(result);
      addLog('✅ Migration terminée avec succès !', 'success');
      addLog(`📊 Données migrées: ${Object.keys(result.likes || {}).length} likes, ${Object.keys(result.interests || {}).length} interests`, 'info');
      addLog('ℹ️ Vous pouvez maintenant utiliser Firebase en production', 'info');
      setStatus('completed');
    } catch (error) {
      addLog(`❌ Erreur de migration: ${error.message}`, 'error');
      setStatus('ready');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '20px auto',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h2>🔄 Migration JSONBin → Firebase</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>
          Cet outil vous permet de migrer vos données existantes de JSONBin vers Firebase.
          La migration est sécurisée et préservera toutes vos données.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📋 Étapes:</h3>
        <ol>
          <li>✅ Configurez Firebase (voir FIREBASE_SETUP.md)</li>
          <li>🧪 Testez la connexion</li>
          <li>🔄 Exécutez la migration</li>
          <li>🗑️ Supprimez les anciens services JSONBin</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTest}
          disabled={status !== 'ready'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: status === 'ready' ? 'pointer' : 'not-allowed',
            marginRight: '10px',
            opacity: status === 'ready' ? 1 : 0.6
          }}
        >
          🧪 Tester la Migration
        </button>

        <button 
          onClick={runMigration}
          disabled={status !== 'ready'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: status === 'ready' ? 'pointer' : 'not-allowed',
            opacity: status === 'ready' ? 1 : 0.6
          }}
        >
          🚀 Migrer vers Firebase
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {
          status === 'ready' ? '⏳ Prêt' :
          status === 'testing' ? '🧪 Test en cours...' :
          status === 'migrating' ? '🔄 Migration en cours...' :
          status === 'completed' ? '✅ Migration terminée' : status
        }
      </div>

      {logs.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>📋 Log de migration:</h3>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            {logs.map((log, index) => (
              <div 
                key={index} 
                style={{ 
                  color: log.type === 'error' ? '#dc3545' : log.type === 'success' ? '#28a745' : '#6c757d',
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              >
                <small style={{ color: '#6c757d' }}>{log.timestamp}</small> - {log.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {migrationData && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d4edda', 
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          <h4>✅ Migration réussie !</h4>
          <p>Vos données ont été transférées vers Firebase:</p>
          <ul>
            <li>Likes: {Object.keys(migrationData.likes || {}).length} œuvres</li>
            <li>Intérêts: {Object.keys(migrationData.interests || {}).length} œuvres</li>
            <li>Date de migration: {migrationData.migratedAt}</li>
          </ul>
          <p><strong>Prochaines étapes:</strong></p>
          <ol>
            <li>Testez votre galerie pour vérifier que tout fonctionne</li>
            <li>Supprimez les fichiers JSONBin de votre projet</li>
            <li>Supprimez ce composant de migration</li>
          </ol>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd',
        borderRadius: '4px',
        border: '1px solid #ffeaa7'
      }}>
        <strong>⚠️ Important:</strong>
        <ul>
          <li>Effectuez la migration une seule fois</li>
          <li>Sauvegardez vos données JSONBin avant la migration</li>
          <li>Testez Firebase avant de supprimer JSONBin</li>
          <li>La migration additionne les données existantes</li>
        </ul>
      </div>
    </div>
  );
};

export default MigrationTool;
