# Configuration Google Analytics - Galerie N'ART 🎨📊

## ✨ Aperçu des nouvelles fonctionnalités

La configuration Google Analytics a été **considérablement étendue** avec des fonctionnalités avancées de tracking pour votre galerie d'art.

## 🚀 Nouveautés ajoutées

### 📁 Nouveaux fichiers créés

1. **`src/hooks/useAnalytics.js`** - Hooks React pour le tracking
2. **`src/contexts/AnalyticsContext.jsx`** - Contexte React pour Analytics
3. **`src/components/AnalyticsTest.jsx`** - Page de test des Analytics
4. **`ANALYTICS_CONFIG.md`** - Documentation complète
5. **`.env.example`** - Exemple de variables d'environnement

### 📈 Événements trackés

| Événement | Description | Déclencheur |
|-----------|-------------|-------------|
| `artwork_view` | Vue d'une œuvre | Affichage dans la galerie |
| `artwork_detail_view` | Vue détaillée | Clic sur l'image |
| `artwork_like` | Like d'une œuvre | Clic sur le bouton ❤️ |
| `artwork_interest` | Intérêt pour une œuvre | Clic "Ça m'intéresse" |
| `contact_interest` | Demande de contact | Soumission du formulaire |
| `search_artwork` | Recherche | Saisie dans la barre de recherche |
| `modal_open/close` | Ouverture/fermeture modale | Interactions avec les modales |
| `scroll_depth` | Profondeur de défilement | Défilement de la page |
| `user_session` | Données de session | Début/fin de session |
| `performance_metric` | Métriques de performance | Chargement de page |

### 🛠 Fonctionnalités techniques

#### Hooks personnalisés
- **`useSessionTracking`** - Suivi des sessions utilisateur
- **`usePerformanceTracking`** - Métriques de performance
- **`usePageTimeTracking`** - Temps passé sur chaque page
- **`useInteractionTracking`** - Interactions utilisateur
- **`useErrorTracking`** - Tracking automatique des erreurs

#### Contexte Analytics
- Provider centralisé pour tous les composants
- Méthodes de tracking encapsulées et validées
- Gestion d'erreurs intégrée

#### Configuration avancée
- Variables d'environnement pour la configuration
- Mode debug pour le développement
- Respect de la confidentialité (RGPD)
- Support mobile optimisé

## 🔧 Configuration

### 1. Variables d'environnement

Créez un fichier `.env` avec :

```env
VITE_GA_MEASUREMENT_ID=G-74HV4SGR7P
VITE_GA_DEBUG=false
VITE_ANALYTICS_ENABLED=true
VITE_APP_NAME=Galerie N'ART
VITE_APP_VERSION=1.0.0
```

### 2. Test de la configuration

Accédez à : **http://localhost:3000/analytics-test**

Cette page vous permet de :
- ✅ Vérifier la configuration
- 🧪 Tester tous les événements
- 📊 Voir les requêtes dans Network
- 🔥 Tester le tracking d'erreurs

## 📊 Utilisation dans les composants

### Avec le contexte Analytics

```jsx
import { useAnalytics } from '../contexts/AnalyticsContext';

function MonComposant() {
  const { trackArtwork, trackSearch, trackModal } = useAnalytics();

  const handleClick = () => {
    trackArtwork('view', 'artwork_123', 'Titre de l\'œuvre');
  };

  // ...
}
```

### Avec les hooks spécialisés

```jsx
import { usePageTimeTracking, useInteractionTracking } from '../hooks/useAnalytics';

function MaPage() {
  usePageTimeTracking('Ma Page');
  const { trackClick, trackScroll } = useInteractionTracking();
  
  // ...
}
```

## 🎯 Métriques importantes à surveiller

### Engagement
- **Likes par œuvre** - Popularité des œuvres
- **Demandes de contact** - Leads générés
- **Temps sur site** - Qualité de l'engagement
- **Profondeur de défilement** - Exploration du contenu

### Performance
- **Temps de chargement** - Expérience utilisateur
- **Erreurs JavaScript** - Stabilité de l'application
- **Interactions mobiles** - Optimisation mobile

### Conversion
- **Formulaires soumis** - Génération de leads
- **Vues d'œuvres détaillées** - Intérêt approfondi
- **Recherches effectuées** - Intention d'achat

## 🔒 Confidentialité et RGPD

✅ **Conformité automatique :**
- Anonymisation des IP activée
- Google Signals désactivé
- Personnalisation publicitaire désactivée
- Utilisation minimale des cookies

## 🐛 Debug et monitoring

### Mode développement
- Logs détaillés dans la console
- Vérification des requêtes Network
- Variables d'environnement pour le debug

### Production
- Tracking automatique des erreurs
- Métriques de performance en temps réel
- Monitoring de la stabilité

## 📱 Support mobile

Toutes les fonctionnalités sont optimisées pour :
- **Interactions tactiles** - Swipe, pinch, tap
- **Performance mobile** - Chargement optimisé
- **Connectivité limitée** - Fallbacks appropriés

## 🚀 Prochaines étapes recommandées

1. **Tests A/B** - Optimiser l'engagement
2. **Segmentation avancée** - Profils d'utilisateurs
3. **Prédictions ML** - Intelligence artificielle
4. **Reporting automatisé** - Tableaux de bord

## 📞 Support

Pour toute question :
- 📖 Consultez `ANALYTICS_CONFIG.md` pour la documentation complète
- 🧪 Utilisez `/analytics-test` pour tester
- 🔍 Vérifiez les logs de la console en mode debug
- 📊 Consultez Google Analytics pour les données en temps réel

---

**Note :** La configuration est maintenant **complète et prête pour la production** ! 🎉
