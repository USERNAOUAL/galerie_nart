// Service pour gérer les interactions avec JSONBin.io
// Fonctions pour charger et sauvegarder les données des œuvres

import { JSONBIN_CONFIG } from '../config/jsonbinConfig.js';

// URL temporaire du bin - sera mise à jour après création
let BIN_URL = null;

// Fonction pour initialiser un nouveau bin JSONBin
export const initializeJSONBin = async () => {
  try {
    const initialData = {
      artwork_stats: {
        bateau: { likes: 0, interested: 0 },
        abstrait: { likes: 0, interested: 0 },
        oiseaux: { likes: 0, interested: 0 },
        vase: { likes: 0, interested: 0 },
        beach: { likes: 0, interested: 0 },
        boujie: { likes: 0, interested: 0 },
        collection: { likes: 0, interested: 0 }
      },
      last_updated: Date.now()
    };

    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bin-Name': 'galerie-nart-interactions'
      },
      body: JSON.stringify(initialData)
    });

    if (response.ok) {
      const result = await response.json();
      BIN_URL = `https://api.jsonbin.io/v3/b/${result.metadata.id}`;
      console.log('JSONBin initialisé:', BIN_URL);
      return BIN_URL;
    }
  } catch (error) {
    console.error('Erreur initialisation JSONBin:', error);
    return null;
  }
};

// Fonction pour charger les données depuis JSONBin
export const loadInteractionsFromJSONBin = async (binUrl = null) => {
  try {
    // Si c'est la première fois, initialiser le bin
    if (!BIN_URL && !binUrl) {
      console.log('Premier chargement - initialisation du bin...');
      const newBinUrl = await initializeJSONBin();
      if (newBinUrl) {
        BIN_URL = newBinUrl;
      }
    }
    
    const url = binUrl || BIN_URL || 'https://api.jsonbin.io/v3/b/66b67e5fe41b4d34e4201234/latest';
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Données chargées depuis JSONBin:', data.record.artwork_stats);
      return data.record.artwork_stats || {};
    } else {
      console.log('Bin non trouvé, création d\'un nouveau bin...');
      const newBinUrl = await initializeJSONBin();
      if (newBinUrl) {
        BIN_URL = newBinUrl;
        return getDefaultStats();
      }
      return getDefaultStats();
    }
  } catch (error) {
    console.error('Erreur chargement JSONBin:', error);
    console.log('Utilisation des valeurs par défaut à zéro');
    return getDefaultStats();
  }
};

// Fonction pour sauvegarder les données vers JSONBin
export const saveInteractionsToJSONBin = async (artworkStats, binUrl = null) => {
  try {
    const url = binUrl || BIN_URL || 'https://api.jsonbin.io/v3/b/66b67e5fe41b4d34e4201234';
    
    const dataToSave = {
      artwork_stats: artworkStats,
      last_updated: Date.now()
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSave)
    });

    if (response.ok) {
      console.log('Données sauvegardées avec succès!');
      return true;
    } else {
      console.error('Erreur sauvegarde:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Erreur sauvegarde JSONBin:', error);
    return false;
  }
};

// Valeurs par défaut si JSONBin n'est pas disponible - VRAIES données à zéro
const getDefaultStats = () => ({
  bateau: { likes: 0, interested: 0 },
  abstrait: { likes: 0, interested: 0 },
  oiseaux: { likes: 0, interested: 0 },
  vase: { likes: 0, interested: 0 },
  beach: { likes: 0, interested: 0 },
  boujie: { likes: 0, interested: 0 },
  collection: { likes: 0, interested: 0 }
});

// Fonction pour incrémenter les likes
export const incrementLikes = async (artworkId, currentStats) => {
  const newStats = { ...currentStats };
  if (!newStats[artworkId]) {
    newStats[artworkId] = { likes: 0, interested: 0 };
  }
  newStats[artworkId].likes += 1;
  
  await saveInteractionsToJSONBin(newStats);
  return newStats;
};

// Fonction pour incrémenter les intéressés
export const incrementInterested = async (artworkId, currentStats) => {
  const newStats = { ...currentStats };
  if (!newStats[artworkId]) {
    newStats[artworkId] = { likes: 0, interested: 0 };
  }
  newStats[artworkId].interested += 1;
  
  await saveInteractionsToJSONBin(newStats);
  return newStats;
};
