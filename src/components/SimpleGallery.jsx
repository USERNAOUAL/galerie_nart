import React, { useState, useEffect } from "react";
import { getAssetPath } from '../utils/assetUtils';
import "../styles/Gallery.css";

const SimpleGallery = () => {
  // Données statiques pour test
  const [artworks] = useState([
    {
      id: "test-1",
      title: "Œuvre de Test",
      image: getAssetPath('artworks/abstrait.jpg'),
      description: "Test de l'affichage d'une œuvre",
      dimensions: "50x70 cm",
      likes: 0,
      interested: 0
    },
    {
      id: "test-2", 
      title: "Seconde Œuvre",
      image: getAssetPath('artworks/bateau.jpg'),
      description: "Deuxième test",
      dimensions: "60x80 cm",
      likes: 0,
      interested: 0
    }
  ]);
  
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Galerie N'Art - Test</h1>
      
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {artworks.map(art => (
            <div key={art.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>{art.title}</h3>
              <img 
                src={art.image}
                alt={art.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
                onError={(e) => {
                  console.error('Erreur de chargement image:', e.target.src);
                  e.target.src = 'https://via.placeholder.com/300x200/ccc/666?text=Image+non+trouvée';
                }}
              />
              <p>{art.description}</p>
              <p><strong>Dimensions:</strong> {art.dimensions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleGallery;
