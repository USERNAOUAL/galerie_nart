# 🎨 Gestion des Œuvres d'Art - N'ART

Ce dossier contient toute la configuration pour gérer les œuvres d'art et leurs interactions.

## 📁 Structure des Fichiers

### `config.yaml` - Configuration des Œuvres
Ce fichier contient la liste de toutes vos œuvres d'art avec leurs métadonnées :

```yaml
artworks:
  - id: "painting-sunset"
    title: "Coucher de soleil doré"
    description: "Une peinture capturant la beauté d'un coucher de soleil automnal"
    dimensions: "60x80 cm"
    image: "sunset.jpg"
```

**Format requis :**
- `id`: Identifiant unique (pas d'espaces, utilisez des tirets)
- `title`: Titre de l'œuvre
- `description`: Description de l'œuvre
- `dimensions`: Dimensions (ex: "50x70 cm")
- `image`: Nom du fichier image (à placer dans ce dossier)

### `interactions.yaml` - Messages et Likes
Ce fichier est **automatiquement géré** par l'application. Il stocke :
- Les likes de chaque œuvre
- Les messages d'intérêt des visiteurs

**⚠️ Ne modifiez pas ce fichier manuellement** - il est mis à jour automatiquement.

## 🖼️ Ajouter une Nouvelle Œuvre

1. **Ajoutez votre image** dans ce dossier (`/public/artworks/`)
2. **Modifiez le fichier `config.yaml`** :
   ```yaml
   artworks:
     # ... œuvres existantes
     - id: "mon-nouveau-tableau"
       title: "Mon Nouveau Tableau"
       description: "Description de mon œuvre"
       dimensions: "40x60 cm"
       image: "mon-image.jpg"
   ```
3. **Sauvegardez** et rechargez la page

## 🔧 Mode Administration

### Accès Admin
- **URL Publique** : `http://localhost:5173/`
- **URL Admin** : `http://localhost:5173/?mode=admin`
- **Page Admin** : `http://localhost:5173/admin`

### Fonctionnalités Admin
- ✅ Voir tous les messages d'intérêt
- ✅ Voir les statistiques (likes, intérêts)
- ✅ Badge de notification des nouveaux messages
- ✅ Interface de debug (console développeur)

### Sauvegarde des Interactions
Les interactions sont sauvegardées automatiquement. En mode développement, vous pouvez voir le format YAML dans la console pour sauvegarder manuellement si besoin.

## 📊 Consultation des Données

### Console Développeur (F12)
Quand les utilisateurs interagissent avec vos œuvres, vous verrez dans la console :
```
=== INTERACTIONS À SAUVEGARDER ===
artwork_interactions:
  painting-sunset:
    likes: 5
    messages:
      - name: "Marie Dubois"
        email: "marie@email.com"
        message: "Magnifique œuvre !"
        timestamp: 1672531200000
```

### Sauvegarde Permanente
Pour un déploiement en production, vous devrez :
1. Mettre en place un backend pour sauvegarder les interactions
2. Ou utiliser une base de données
3. Ou exporter périodiquement les données de la console

## 🚀 Déploiement

Lors du déploiement :
- Tous les fichiers de ce dossier doivent être inclus
- Les images doivent être optimisées (format WebP recommandé)
- Le fichier `interactions.yaml` sera créé automatiquement

## 🆘 Dépannage

### Mes œuvres n'apparaissent pas
1. Vérifiez que le fichier `config.yaml` est bien formaté
2. Vérifiez que les images existent dans le dossier
3. Rechargez la page (Ctrl+F5)

### Les interactions ne se sauvegardent pas
1. Ouvrez la console développeur (F12)
2. Cherchez les erreurs
3. Vérifiez le format des interactions dans la console

### Mode admin non accessible
1. Utilisez l'URL : `http://localhost:5173/?mode=admin`
2. Ou accédez à la page admin : `http://localhost:5173/admin`

---

💡 **Astuce** : Pour tester rapidement, utilisez l'URL `/?mode=admin` pour activer l'interface administrateur.
