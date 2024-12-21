interface ProcessImagesResponse {
  status: string;
  message: string;
  data: {
    id: number;
    url: string;
  };
}

export async function processImages(tableauUrl: string, visageUrl: string): Promise<string> {
  const webhookUrl = 'https://hook.eu2.make.com/tj7plalzjyo2zwhxtghzd78ew8dpcucj';
  
  try {
    console.log('Envoi des données au webhook:', {
      tableau: tableauUrl,
      visage: visageUrl
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        tableau: tableauUrl,
        visage: visageUrl
      })
    });
    
    if (!response.ok) {
      let errorMessage = `Erreur serveur: ${response.status}`;
      try {
        const errorData = await response.text();
        errorMessage += ` - ${errorData}`;
      } catch (e) {
        console.error('Impossible de lire le message d\'erreur:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json() as ProcessImagesResponse;
    
    if (data.status !== 'success' || !data.data?.url) {
      throw new Error(data.message || 'Erreur: Réponse invalide du serveur');
    }
    
    console.log('Réponse reçue du serveur:', data);
    return data.data.url;
  } catch (error) {
    console.error('Erreur détaillée lors du traitement des images:', {
      error,
      tableauUrl,
      visageUrl
    });
    throw error;
  }
}