// Fonction utilitaire pour gérer les chemins d'assets en production
export const getAssetPath = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  return base + path.replace(/^\//, '');
};
