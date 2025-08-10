import { db } from '../config/firebaseConfig.js';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  onSnapshot 
} from 'firebase/firestore';

class FirebaseService {
  constructor() {
    this.interactions = null;
    this.listeners = [];
  }

  // Référence du document des interactions
  getInteractionsRef() {
    return doc(db, 'gallery', 'interactions');
  }

  // Charger les interactions depuis Firebase
  async loadInteractions() {
    try {
      const docRef = this.getInteractionsRef();
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        this.interactions = docSnap.data();
        console.log('✅ Interactions chargées depuis Firebase');
        return this.interactions;
      } else {
        // Créer le document avec des données par défaut
        const defaultInteractions = {
          likes: {},
          interests: {},
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        await setDoc(docRef, defaultInteractions);
        this.interactions = defaultInteractions;
        console.log('✅ Document d\'interactions créé dans Firebase');
        return this.interactions;
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des interactions:', error);
      // Données par défaut en cas d'erreur
      this.interactions = { likes: {}, interests: {} };
      return this.interactions;
    }
  }

  // Écouter les changements en temps réel
  subscribeToInteractions(callback) {
    const docRef = this.getInteractionsRef();
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        this.interactions = doc.data();
        callback(this.interactions);
      }
    }, (error) => {
      console.error('❌ Erreur lors de l\'écoute des changements:', error);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Arrêter l'écoute
  unsubscribeAll() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }

  // Obtenir le nombre de likes pour une œuvre
  getLikes(artworkId) {
    if (!this.interactions || !this.interactions.likes) {
      return 0;
    }
    return this.interactions.likes[artworkId] || 0;
  }

  // Obtenir le nombre d'intérêts pour une œuvre
  getInterests(artworkId) {
    if (!this.interactions || !this.interactions.interests) {
      return 0;
    }
    return this.interactions.interests[artworkId] || 0;
  }

  // Ajouter un like à une œuvre
  async addLike(artworkId) {
    try {
      const docRef = this.getInteractionsRef();
      
      // Utiliser increment pour éviter les conflits de concurrence
      await updateDoc(docRef, {
        [`likes.${artworkId}`]: increment(1),
        lastUpdated: new Date().toISOString()
      });

      console.log(`✅ Like ajouté pour ${artworkId}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du like:', error);
      return false;
    }
  }

  // Ajouter un intérêt à une œuvre
  async addInterest(artworkId) {
    try {
      const docRef = this.getInteractionsRef();
      
      // Utiliser increment pour éviter les conflits de concurrence
      await updateDoc(docRef, {
        [`interests.${artworkId}`]: increment(1),
        lastUpdated: new Date().toISOString()
      });

      console.log(`✅ Intérêt ajouté pour ${artworkId}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de l\'intérêt:', error);
      return false;
    }
  }

  // Sauvegarder toutes les interactions (pour la migration)
  async saveInteractions(interactions) {
    try {
      const docRef = this.getInteractionsRef();
      const dataToSave = {
        ...interactions,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave);
      this.interactions = dataToSave;
      console.log('✅ Interactions sauvegardées dans Firebase');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  // Obtenir toutes les interactions
  getInteractions() {
    return this.interactions || { likes: {}, interests: {} };
  }

  // Méthode pour obtenir des statistiques
  getStats() {
    if (!this.interactions) {
      return { totalLikes: 0, totalInterests: 0, totalArtworks: 0 };
    }

    const likes = this.interactions.likes || {};
    const interests = this.interactions.interests || {};
    
    const totalLikes = Object.values(likes).reduce((sum, count) => sum + count, 0);
    const totalInterests = Object.values(interests).reduce((sum, count) => sum + count, 0);
    const likedArtworks = new Set(Object.keys(likes));
    const interestedArtworks = new Set(Object.keys(interests));
    const totalArtworks = new Set([...likedArtworks, ...interestedArtworks]).size;

    return {
      totalLikes,
      totalInterests,
      totalArtworks,
      mostLikedArtwork: this.getMostPopular(likes),
      mostInterestedArtwork: this.getMostPopular(interests)
    };
  }

  // Trouver l'œuvre la plus populaire
  getMostPopular(data) {
    if (!data || Object.keys(data).length === 0) return null;
    
    return Object.entries(data).reduce((max, [id, count]) => 
      count > max.count ? { id, count } : max
    , { id: null, count: 0 });
  }
}

// Instance unique du service
export const firebaseService = new FirebaseService();
export default firebaseService;
