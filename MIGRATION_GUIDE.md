# Guide de Migration vers Firebase

## 🚀 **ÉTAPES RAPIDES**

### 1️⃣ **Configurez Firebase** 
```bash
# Firebase est déjà installé ✅
# Suivez le guide FIREBASE_SETUP.md pour la configuration
```

### 2️⃣ **Configurez votre projet Firebase**
1. Allez sur https://console.firebase.google.com
2. Créez un projet "galerie-nart"
3. Configurez Firestore (mode Production)
4. Copiez votre configuration dans `src/config/firebaseConfig.js`
5. Déployez les règles de sécurité depuis `firestore.rules`

### 3️⃣ **Testez Firebase**
```bash
npm run dev
```
Puis visitez: http://localhost:5173/firebase-test

### 4️⃣ **Migrez vos données**
Visitez: http://localhost:5173/migration
1. Cliquez "Tester la Migration"
2. Si OK, cliquez "Migrer vers Firebase"

### 5️⃣ **Vérifiez que tout fonctionne**
Visitez: http://localhost:5173/
- Testez les likes ❤️
- Testez les intérêts 📧
- Vérifiez les mises à jour en temps réel

### 6️⃣ **Nettoyage final**
```bash
# Supprimer les outils de migration
rm src/components/FirebaseTest.jsx
rm src/components/MigrationTool.jsx
rm src/utils/migration.js

# Supprimer le service JSONBin
rm src/services/jsonbinService.js
rm src/config/jsonbinConfig.js

# Restaurer App.jsx
mv src/App-backup.jsx src/App.jsx
```

## 🔧 **Configuration Firebase Complète**

### Configuration (`src/config/firebaseConfig.js`)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Votre vraie clé
  authDomain: "galerie-nart.firebaseapp.com",
  projectId: "galerie-nart",
  storageBucket: "galerie-nart.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Règles Firestore
```javascript
// À copier dans Firebase Console > Firestore > Règles
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gallery/{document} {
      allow read: if true;
      allow write: if 
        document == 'interactions' &&
        request.resource.data.keys().hasAll(['likes', 'interests', 'lastUpdated']) &&
        isValidInteractionUpdate(resource.data, request.resource.data);
    }
  }
  
  function isValidInteractionUpdate(existingData, newData) {
    let likesValid = newData.likes is map &&
      newData.likes.values().all(value => value is number && value >= 0);
    let interestsValid = newData.interests is map &&
      newData.interests.values().all(value => value is number && value >= 0);
    let timestampValid = newData.lastUpdated is string;
    return likesValid && interestsValid && timestampValid;
  }
}
```

## ⚡ **Avantages de Firebase**

### 🔒 **Sécurité**
- ❌ JSONBin: Clé API exposée dans le navigateur
- ✅ Firebase: Règles de sécurité côté serveur incontournables

### 🚀 **Performance**
- ❌ JSONBin: Requêtes manuelles 
- ✅ Firebase: Mises à jour temps réel automatiques

### 💰 **Coût**
- ✅ Firebase: Gratuit jusqu'à 50k lectures/jour et 20k écritures/jour

### 📊 **Fonctionnalités**
- ✅ Validation automatique des données
- ✅ Prévention des conditions de course (race conditions)
- ✅ Historique des modifications
- ✅ Monitoring et analytics

## 🐛 **Dépannage**

### Erreur: "Firebase not configured"
- Vérifiez `src/config/firebaseConfig.js`
- Assurez-vous que votre projet Firebase existe

### Erreur: "Permission denied"
- Vérifiez que les règles Firestore sont déployées
- Testez avec des règles temporaires plus permissives

### Migration échoue
- Vérifiez que JSONBin fonctionne encore
- Vérifiez la console du navigateur pour les erreurs détaillées

### Données manquantes après migration
- Consultez Firebase Console > Firestore pour vérifier les données
- Utilisez `firebaseService.getStats()` dans la console du navigateur

## 📞 **Support**

Si vous rencontrez des problèmes:
1. Consultez la console du navigateur (F12)
2. Vérifiez Firebase Console > Firestore > Données
3. Testez avec `/firebase-test` et `/migration`
4. Lisez les logs détaillés dans les outils de migration
