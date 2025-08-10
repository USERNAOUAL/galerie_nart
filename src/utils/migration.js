import { firebaseService } from '../services/firebaseService.js';
import { loadInteractionsFromJSONBin } from '../services/jsonbinService.js';

/**
 * Script de migration des données JSONBin vers Firebase
 * Exécutez ce script une fois pour transférer vos données existantes
 */
export async function migrateFromJsonbinToFirebase() {
  console.log('🔄 Début de la migration JSONBin → Firebase...');
  
  try {
    // 1. Charger les données existantes depuis JSONBin
    console.log('📥 Chargement des données depuis JSONBin...');
    const jsonbinData = await loadInteractionsFromJSONBin();
    
    console.log('📊 Données JSONBin trouvées:', {
      likes: Object.keys(jsonbinData.likes || {}).length,
      interests: Object.keys(jsonbinData.interests || {}).length,
      totalLikes: Object.values(jsonbinData.likes || {}).reduce((sum, count) => sum + count, 0),
      totalInterests: Object.values(jsonbinData.interests || {}).reduce((sum, count) => sum + count, 0)
    });

    // 2. Initialiser Firebase
    console.log('🔥 Initialisation de Firebase...');
    await firebaseService.loadInteractions();

    // 3. Migrer les données vers Firebase
    console.log('📤 Migration des données vers Firebase...');
    const migrationData = {
      likes: jsonbinData.likes || {},
      interests: jsonbinData.interests || {},
      migratedAt: new Date().toISOString(),
      migratedFrom: 'jsonbin',
      createdAt: jsonbinData.createdAt || new Date().toISOString()
    };

    const success = await firebaseService.saveInteractions(migrationData);
    
    if (success) {
      console.log('✅ Migration réussie !');
      console.log('📊 Données migrées:', {
        likes: Object.keys(migrationData.likes).length,
        interests: Object.keys(migrationData.interests).length,
        totalLikes: Object.values(migrationData.likes).reduce((sum, count) => sum + count, 0),
        totalInterests: Object.values(migrationData.interests).reduce((sum, count) => sum + count, 0)
      });
      
      // 4. Vérifier les données dans Firebase
      console.log('🔍 Vérification des données dans Firebase...');
      await firebaseService.loadInteractions();
      const firebaseData = firebaseService.getInteractions();
      
      console.log('✅ Vérification réussie - données disponibles dans Firebase');
      return firebaseData;
    } else {
      throw new Error('Échec de la sauvegarde dans Firebase');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

// Fonction pour tester la migration sans l'exécuter
export async function testMigration() {
  console.log('🧪 Test de migration (lecture seule)...');
  
  try {
    // Tester JSONBin
    const jsonbinData = await loadInteractionsFromJSONBin();
    console.log('✅ JSONBin accessible:', jsonbinData);

    // Tester Firebase
    await firebaseService.loadInteractions();
    const firebaseData = firebaseService.getInteractions();
    console.log('✅ Firebase accessible:', firebaseData);

    return {
      jsonbin: jsonbinData,
      firebase: firebaseData,
      ready: true
    };
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return {
      jsonbin: null,
      firebase: null,
      ready: false,
      error: error.message
    };
  }
}
