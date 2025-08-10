// Backend proxy pour sécuriser l'API JSONBin
// Ce fichier sera déployé sur Vercel/Netlify Functions

export default async function handler(req, res) {
  // Configuration sécurisée côté serveur
  const JSONBIN_CONFIG = {
    binId: process.env.JSONBIN_BIN_ID,
    apiKey: process.env.JSONBIN_API_KEY,
    baseUrl: 'https://api.jsonbin.io/v3'
  };

  // Autoriser seulement certaines origines
  const allowedOrigins = [
    'http://localhost:5173',
    'https://votre-site.vercel.app',
    'https://votre-domaine.com'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let url, method, body;

    switch (req.method) {
      case 'GET':
        url = `${JSONBIN_CONFIG.baseUrl}/b/${JSONBIN_CONFIG.binId}/latest`;
        method = 'GET';
        break;
      
      case 'PUT':
        url = `${JSONBIN_CONFIG.baseUrl}/b/${JSONBIN_CONFIG.binId}`;
        method = 'PUT';
        body = JSON.stringify(req.body);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_CONFIG.apiKey,
        ...(body && { 'Content-Length': body.length })
      },
      ...(body && { body })
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Erreur proxy JSONBin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
