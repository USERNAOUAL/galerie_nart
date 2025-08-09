// Configuration JSONBin.io pour stocker les interactions
// JSONBin.io est un service gratuit pour stocker des données JSON en ligne
// Similaire à EmailJS mais pour les données

export const JSONBIN_CONFIG = {
  // URL publique du bin JSONBin - sera générée automatiquement
  BIN_URL: 'SERA_GENERE_AUTOMATIQUEMENT',
  
  // Headers pour les requêtes
  HEADERS: {
    'Content-Type': 'application/json',
    'X-Bin-Name': 'galerie-nart-interactions'
  }
};

// Structure des données stockées :
/*
{
  "artwork_stats": {
    "bateau": { "likes": 5, "interested": 2 },
    "abstrait": { "likes": 3, "interested": 1 },
    "oiseaux": { "likes": 8, "interested": 4 }
  },
  "last_updated": 1691234567890
}
*/
