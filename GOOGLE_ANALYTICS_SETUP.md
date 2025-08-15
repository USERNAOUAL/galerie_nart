# Configuration Google Analytics pour N'ART

## Instructions de configuration

### 1. Remplacer l'ID de mesure
Dans le fichier `src/utils/analytics.js`, remplacez :
```javascript
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```
Par votre vrai ID Google Analytics (format G-XXXXXXXXXX)

### 2. Événements configurés pour votre galerie

#### Événements automatiques :
- **Page views** : Suivi automatique de toutes les pages visitées
- **Navigation** : Suivi des sections visitées

#### Événements personnalisés disponibles :
- `trackArtworkView(artworkId, artworkTitle)` : Quand un utilisateur consulte une œuvre
- `trackInterestClick(artworkId, artworkTitle)` : Quand quelqu'un clique sur "J'adore"
- `trackContactFormSubmit(formType)` : Soumission de formulaires de contact
- `trackGalleryNavigation(section)` : Navigation dans les différentes sections

### 3. Métriques importantes à suivre

#### Pour votre galerie d'art :
- **Œuvres les plus vues**
- **Taux d'engagement** (likes, contacts)
- **Parcours utilisateur** dans la galerie
- **Sources de trafic**
- **Temps passé sur le site**
- **Taux de rebond**

### 4. Objectifs recommandés dans GA4

1. **Contact Form Submission** : Conversion principale
2. **Artwork Interest** : Engagement utilisateur
3. **Time on Site** : Qualité du contenu
4. **Page Depth** : Exploration de la galerie

### 5. Rapports personnalisés suggérés

- **Popularité des œuvres** : Classement des œuvres les plus consultées
- **Entonnoir de conversion** : Visite → Intérêt → Contact
- **Géolocalisation** : D'où viennent vos visiteurs
- **Appareils** : Desktop vs Mobile

### 6. Variables d'environnement (optionnel)

Créez un fichier `.env.local` :
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Et modifiez `analytics.js` :
```javascript
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
```
