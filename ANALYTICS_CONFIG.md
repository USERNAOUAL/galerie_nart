# Configuration Google Analytics pour Galerie N'ART

## 📊 Aperçu

Ce document décrit la configuration complète de Google Analytics pour la galerie d'art N'ART, incluant le tracking des interactions utilisateur, des performances et des conversions.

## 🚀 Configuration initiale

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# ID de mesure Google Analytics (obligatoire)
VITE_GA_MEASUREMENT_ID=G-74HV4SGR7P

# Configuration du debug (optionnel)
VITE_GA_DEBUG=false

# Activer/désactiver les analytics (optionnel)
VITE_ANALYTICS_ENABLED=true

# Nom de l'application (optionnel)
VITE_APP_NAME=Galerie N'ART

# Version de l'application (optionnel)
VITE_APP_VERSION=1.0.0
```

### 2. Initialisation automatique

Google Analytics est automatiquement initialisé au démarrage de l'application via le composant `App.jsx`.

## 📈 Événements trackés

### Événements d'œuvres d'art

- **`artwork_view`** : Quand un utilisateur visualise une œuvre
- **`artwork_detail_view`** : Quand un utilisateur ouvre la page détail d'une œuvre
- **`artwork_like`** : Quand un utilisateur aime/n'aime plus une œuvre
- **`artwork_interest`** : Quand un utilisateur clique sur "Ça m'intéresse"

### Événements de navigation

- **`gallery_navigation`** : Navigation dans les différentes sections
- **`category_filter`** : Filtrage par catégorie
- **`search_artwork`** : Utilisation de la recherche

### Événements d'engagement

- **`contact_interest`** : Demande de contact pour une œuvre
- **`contact_form_submit`** : Soumission du formulaire de contact
- **`modal_open/close`** : Ouverture/fermeture des modales

### Événements de session

- **`user_session`** : Données de session utilisateur
- **`page_time_spent`** : Temps passé sur chaque page
- **`scroll_depth`** : Profondeur de défilement

### Événements de performance

- **`page_load_time`** : Temps de chargement des pages
- **`javascript_error`** : Erreurs JavaScript
- **`performance_metric`** : Métriques de performance diverses

## 🛠 Utilisation dans les composants

### Avec le hook useAnalytics

```jsx
import { useAnalytics } from '../contexts/AnalyticsContext';

function MyComponent() {
  const { trackArtwork, trackNavigation, trackSearch } = useAnalytics();

  const handleArtworkClick = (artwork) => {
    trackArtwork('view', artwork.id, artwork.title);
  };

  const handleCategoryFilter = (category) => {
    trackFilter(category);
  };

  const handleSearch = (searchTerm, results) => {
    trackSearch(searchTerm, results.length);
  };

  return (
    // Votre composant
  );
}
```

### Avec les hooks spécialisés

```jsx
import { 
  useSessionTracking, 
  usePageTimeTracking, 
  useInteractionTracking 
} from '../hooks/useAnalytics';

function PageComponent() {
  // Tracking automatique du temps sur la page
  usePageTimeTracking('Gallery');
  
  // Tracking des interactions
  const { trackClick, trackHover, trackScroll } = useInteractionTracking();
  
  // Tracking de session
  const { incrementInteraction } = useSessionTracking();

  return (
    // Votre composant
  );
}
```

### Tracking direct

```jsx
import { 
  trackArtworkView, 
  trackInterestClick, 
  trackEvent 
} from '../utils/analytics';

// Tracking d'événements spécifiques
trackArtworkView('artwork_123', 'Abstraction Moderne');
trackInterestClick('artwork_123', 'Abstraction Moderne');

// Tracking d'événements personnalisés
trackEvent('custom_event', {
  event_category: 'Custom',
  event_label: 'Mon événement',
  custom_parameter: 'valeur'
});
```

## 📊 Métriques importantes

### Conversion Goals

1. **Likes d'œuvres** : Engagement utilisateur
2. **Demandes de contact** : Leads générés
3. **Temps sur site** : Qualité de l'engagement
4. **Vues d'œuvres détaillées** : Intérêt profond

### Segments d'audience

- **Visiteurs par catégorie d'art préférée**
- **Utilisateurs engagés** (likes + demandes de contact)
- **Visiteurs récurrents**
- **Durée de session > 2 minutes**

## 🔧 Configuration avancée

### Custom Dimensions

Les dimensions personnalisées suivantes sont configurées :

1. **artwork_category** : Catégorie d'œuvre
2. **user_interest** : Niveau d'intérêt utilisateur
3. **artwork_id** : Identifiant unique de l'œuvre
4. **session_id** : Identifiant de session

### Enhanced Ecommerce (optionnel)

Pour tracker les "achats" ou demandes de contact comme des conversions :

```jsx
// Exemple de tracking de conversion
trackEvent('purchase', {
  transaction_id: 'contact_' + Date.now(),
  value: 1,
  currency: 'EUR',
  items: [{
    item_id: artwork.id,
    item_name: artwork.title,
    item_category: 'artwork',
    quantity: 1,
    price: 0 // Contact gratuit
  }]
});
```

## 🔒 Confidentialité et RGPD

- **IP anonymization** : Activée par défaut
- **Google Signals** : Désactivés
- **Ad Personalization** : Désactivé
- **Cookies** : Utilisation minimale

## 🐛 Debug et monitoring

### Mode Debug

Activez le mode debug avec `VITE_GA_DEBUG=true` pour voir tous les événements dans la console.

### Désactivation temporaire

Utilisez `VITE_ANALYTICS_ENABLED=false` pour désactiver complètement le tracking.

### Monitoring des erreurs

Toutes les erreurs JavaScript sont automatiquement trackées avec le contexte approprié.

## 📱 Support mobile

Tous les événements sont optimisés pour les appareils mobiles avec des ajustements automatiques pour :

- Les interactions tactiles
- La navigation mobile
- Les performances réduites
- Les connexions lentes

## 🚀 Prochaines étapes

1. **Tests A/B** : Intégration de Google Optimize
2. **Heatmaps** : Ajout de Hotjar ou similaire
3. **Real User Monitoring** : Métriques de performance avancées
4. **Machine Learning** : Prédictions d'engagement

## 📞 Support

Pour toute question concernant l'implémentation Analytics, consultez :

- [Documentation Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Guide de migration GA4](./MIGRATION_GUIDE.md)
- Code source : `src/utils/analytics.js` et `src/hooks/useAnalytics.js`
