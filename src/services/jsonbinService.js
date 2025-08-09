// Service pour gérer les interactions avec JSONBin.io (solution cloud partagée)
// Permet de partager les statistiques entre tous les visiteurs

console.log('🔧 Chargement du service jsonbinService.js - Mode JSONBin.io');

// Configuration JSONBin.io
const JSONBIN_CONFIG = {
  binId: '6897d1b8d0ea881f405573af',
  apiKey: '$2a$10$kkMIoGQGiWPP5y3iL22AEu0o/3cpE.I8tdIFdUj9Ur5xMqkyqJU5m',
  baseUrl: 'https://api.jsonbin.io/v3'
};

// Valeurs par défaut si aucune donnée n'est disponible
const getDefaultStats = () => ({
  bateau: { likes: 0, interested: 0 },
  abstrait: { likes: 0, interested: 0 },
  oiseaux: { likes: 0, interested: 0 },
  vase: { likes: 0, interested: 0 },
  beach: { likes: 0, interested: 0 },
  boujie: { likes: 0, interested: 0 },
  collection: { likes: 0, interested: 0 }
});

// Fonction pour charger les données depuis JSONBin.io
const loadInteractionsFromJSONBin = async () => {
  try {
    console.log('📦 Chargement des données depuis JSONBin.io...');
    
    const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/b/${JSONBIN_CONFIG.binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_CONFIG.apiKey,
        'X-Bin-Meta': 'false'
      }
    });

    if (!response.ok) {
      console.error('❌ Erreur HTTP:', response.status, response.statusText);
      return getDefaultStats();
    }

    const data = await response.json();
    console.log('✅ Données chargées depuis JSONBin.io:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Erreur chargement JSONBin.io:', error);
    console.log('🔄 Utilisation des valeurs par défaut');
    return getDefaultStats();
  }
};

// Fonction pour sauvegarder les données vers JSONBin.io
const saveInteractionsToJSONBin = async (artworkStats) => {
  try {
    console.log('💾 Sauvegarde vers JSONBin.io...');
    console.log('📊 Données à sauvegarder:', artworkStats);
    
    const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/b/${JSONBIN_CONFIG.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_CONFIG.apiKey
      },
      body: JSON.stringify(artworkStats)
    });

    if (!response.ok) {
      console.error('❌ Erreur HTTP sauvegarde:', response.status, response.statusText);
      return false;
    }

    const result = await response.json();
    console.log('✅ Données sauvegardées avec succès sur JSONBin.io!', result.metadata);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde JSONBin.io:', error);
    return false;
  }
};

// Fonction pour incrémenter les likes
const incrementLikes = async (artworkId, currentStats) => {
  const newStats = { ...currentStats };
  if (!newStats[artworkId]) {
    newStats[artworkId] = { likes: 0, interested: 0 };
  }
  newStats[artworkId].likes += 1;
  
  console.log('🔄 Incrémentation like pour:', artworkId, 'Nouveau total:', newStats[artworkId].likes);
  await saveInteractionsToJSONBin(newStats);
  return newStats;
};

// Fonction pour incrémenter les intéressés
const incrementInterested = async (artworkId, currentStats, message = null) => {
  const newStats = { ...currentStats };
  if (!newStats[artworkId]) {
    newStats[artworkId] = { likes: 0, interested: 0, messages: [] };
  }
  
  // Incrémenter le compteur d'intéressés
  newStats[artworkId].interested += 1;
  
  // Ajouter le message s'il existe
  if (message) {
    if (!newStats[artworkId].messages) {
      newStats[artworkId].messages = [];
    }
    newStats[artworkId].messages.push(message);
  }
  
  console.log('📝 Incrémentation intérêt pour:', artworkId, 'Nouveau total:', newStats[artworkId].interested);
  await saveInteractionsToJSONBin(newStats);
  return newStats;
};

// Fonction de debug pour vérifier l'état JSONBin.io
const debugJSONBinState = async () => {
  console.log('=== ÉTAT JSONBIN.IO DEBUG ===');
  try {
    const data = await loadInteractionsFromJSONBin();
    console.log('Données actuelles:', data);
    console.log('Bin ID:', JSONBIN_CONFIG.binId);
  } catch (error) {
    console.error('Erreur debug:', error);
  }
  console.log('================================');
};

// Fonction pour réinitialiser les données (utile pour les tests)
const resetStats = async () => {
  try {
    const defaultStats = getDefaultStats();
    const success = await saveInteractionsToJSONBin(defaultStats);
    if (success) {
      console.log('🔄 Données réinitialisées sur JSONBin.io');
    } else {
      console.error('❌ Erreur lors de la réinitialisation');
    }
    return success;
  } catch (error) {
    console.error('❌ Erreur resetStats:', error);
    return false;
  }
};

// Logs de vérification des exports
console.log('✅ Service chargé avec toutes les fonctions disponibles');

// Export des fonctions individuelles
export { 
  loadInteractionsFromJSONBin, 
  saveInteractionsToJSONBin, 
  incrementLikes, 
  incrementInterested, 
  debugJSONBinState, 
  resetStats 
};

// Export par défaut
export default {
  loadInteractionsFromJSONBin,
  saveInteractionsToJSONBin,
  incrementLikes,
  incrementInterested,
  debugJSONBinState,
  resetStats
};
