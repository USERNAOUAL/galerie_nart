# Configuration Firebase pour Galerie N'ART

## 🔥 Étape 1 : Créer le projet Firebase

1. **Aller sur [Firebase Console](https://console.firebase.google.com)**

2. **Créer un nouveau projet :**
   - Cliquez sur "Ajouter un projet"
   - Nom du projet : `galerie-nart` (ou votre choix)
   - Désactivez Google Analytics (optionnel pour ce projet)
   - Cliquez sur "Créer le projet"

## 🗄️ Étape 2 : Configurer Firestore

1. **Dans votre projet Firebase :**
   - Menu de gauche → "Firestore Database"
   - Cliquez sur "Créer une base de données"
   - Mode : **Production** (nous avons des règles de sécurité)
   - Région : Europe (europe-west) recommandée

2. **Configurer les règles de sécurité :**
   - Dans Firestore → onglet "Règles"
   - Copiez le contenu du fichier `firestore.rules`
   - Cliquez sur "Publier"

## 🔑 Étape 3 : Obtenir la configuration

1. **Dans Firebase Console :**
   - Icône ⚙️ (Paramètres du projet)
   - Onglet "Général"
   - Section "Vos applications" → Cliquez sur l'icône Web `</>`

2. **Enregistrer l'application :**
   - Nom : "Galerie N'ART Web"
   - ✅ Cochez "Configurer Firebase Hosting" (pour plus tard)
   - Cliquez sur "Enregistrer l'application"

3. **Copier la configuration :**
   ```javascript
   // Vous obtiendrez quelque chose comme :
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "galerie-nart.firebaseapp.com",
     projectId: "galerie-nart",
     storageBucket: "galerie-nart.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

## 📝 Étape 4 : Mettre à jour votre configuration

Remplacez le contenu du fichier `src/config/firebaseConfig.js` avec vos vraies valeurs :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_VRAIE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com", 
  projectId: "VOTRE_VRAIE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_VRAIE_SENDER_ID",
  appId: "VOTRE_VRAIE_APP_ID"
};
```

## 🔄 Étape 5 : Migration des données

Une fois Firebase configuré, vous pourrez migrer vos données JSONBin :

```javascript
// Dans la console du navigateur ou dans un composant
import { migrateFromJsonbinToFirebase } from './src/utils/migration.js';

// Exécuter la migration
migrateFromJsonbinToFirebase();
```

## 🧪 Étape 6 : Tester la configuration

```javascript
// Test rapide dans la console du navigateur
import { firebaseService } from './src/services/firebaseService.js';

// Charger les données
await firebaseService.loadInteractions();

// Tester un like
await firebaseService.addLike('test-artwork');

// Vérifier
console.log(firebaseService.getLikes('test-artwork'));
```

## 🔐 Sécurité Firebase vs JSONBin

### ❌ Problème JSONBin :
- Clé API exposée dans le code frontend
- N'importe qui peut voir et utiliser votre clé
- Risque de suppression ou modification malveillante

### ✅ Solution Firebase :
- Configuration publique (clés non secrètes) 
- Sécurité gérée par les règles Firestore côté serveur
- Impossible de contourner les règles depuis le frontend
- Validation automatique des données

## 🚀 Prochaines étapes

1. Configurez Firebase (Étapes 1-4)
2. Testez la connexion (Étape 6)  
3. Migrez vos données (Étape 5)
4. Remplacez JSONBin par Firebase dans Gallery.jsx
5. Supprimez l'ancien service JSONBin

## 💡 Avantages Firebase

- **Temps réel** : Mises à jour automatiques entre utilisateurs
- **Sécurisé** : Règles serveur incontournables
- **Gratuit** : Quotas généreux pour votre usage
- **Fiable** : Infrastructure Google Cloud
- **Évolutif** : Peut grandir avec votre galerie
