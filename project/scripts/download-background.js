const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadPexelsImage() {
  try {
    // Clé API Pexels (vous devrez la remplacer par votre propre clé)
    const apiKey = 'YOUR_PEXELS_API_KEY';
    
    // Recherche d'une image de fond neutre et élégante
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: { 
        'Authorization': apiKey 
      },
      params: {
        query: 'minimalist background white soft texture',
        per_page: 1,
        page: 1
      }
    });

    // Récupérer l'URL de l'image originale
    const imageUrl = response.data.photos[0].src.original;

    // Télécharger l'image
    const imageResponse = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
    });

    // Chemin de destination
    const destinationPath = path.join(__dirname, '../src/assets/background.jpg');

    // Écrire l'image
    const writer = fs.createWriteStream(destinationPath);
    imageResponse.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
  }
}

downloadPexelsImage()
  .then(() => console.log('Image téléchargée avec succès'))
  .catch(console.error);
