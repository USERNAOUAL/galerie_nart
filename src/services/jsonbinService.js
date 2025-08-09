// Service pour gérer les interactions avec localStorage (solution simple et fiable)
// Alternative à JSONBin.io qui nécessite maintenant une clé API

console.log('🔧 Chargement du service jsonbinService.js');

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

// Clé pour le stockage local
const STORAGE_KEY = 'nart_artwork_stats';

// Fonction pour charger les données depuis localStorage
const loadInteractionsFromJSONBin = async () => {
  try {
    console.log('📦 Chargement des données depuis localStorage...');
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('✅ Données trouvées dans localStorage:', parsedData);
      return parsedData;
    } else {
      console.log('📝 Aucune donnée trouvée, initialisation avec valeurs par défaut');
      const defaultStats = getDefaultStats();
      
      // Sauvegarder les valeurs par défaut
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats));
      localStorage.setItem(STORAGE_KEY + '_created', Date.now().toString());
      
      return defaultStats;
    }
  } catch (error) {
    console.error('❌ Erreur chargement localStorage:', error);
    return getDefaultStats();
  }
};

// Fonction pour sauvegarder les données vers localStorage
const saveInteractionsToJSONBin = async (artworkStats) => {
  try {
    console.log('💾 Sauvegarde dans localStorage...');
    console.log('📊 Données à sauvegarder:', artworkStats);
    
    // Sauvegarder les statistiques
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artworkStats));
    localStorage.setItem(STORAGE_KEY + '_updated', Date.now().toString());
    
    console.log('✅ Données sauvegardées avec succès dans localStorage!');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde localStorage:', error);
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

// Fonction de debug pour vérifier l'état
const debugJSONBinState = () => {
  console.log('=== ÉTAT STOCKAGE LOCAL DEBUG ===');
  console.log('Données stockées:', localStorage.getItem(STORAGE_KEY));
  console.log('Créé le:', new Date(parseInt(localStorage.getItem(STORAGE_KEY + '_created'))));
  console.log('Mis à jour le:', new Date(parseInt(localStorage.getItem(STORAGE_KEY + '_updated'))));
  console.log('================================');
};

// Fonction pour réinitialiser les données (utile pour les tests)
const resetStats = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY + '_created');
  localStorage.removeItem(STORAGE_KEY + '_updated');
  console.log('🔄 Données réinitialisées');
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
