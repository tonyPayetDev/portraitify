import { supabase } from './supabase';

export async function uploadImage(file: File): Promise<string> {
  try {
    console.log('Début de l\'upload', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    // Vérifier la taille et le type du fichier
    if (file.size > 5 * 1024 * 1024) {  // 5 Mo max
      throw new Error('La taille du fichier ne doit pas dépasser 5 Mo');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Type de fichier non autorisé. Utilisez JPEG, PNG, GIF ou WebP. Type reçu: ${file.type}`);
    }

    // Générer un nom de fichier unique pour le portrait
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `portraits/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;

    console.log('Détails de l\'upload:', { 
      fileName, 
      fileType: file.type, 
      fileSize: file.size,
      supabaseUrl: process.env.SUPABASE_URL 
    });

    // Upload du fichier directement
    const { error: uploadError, data } = await supabase.storage
      .from('artworks')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Erreur Supabase lors de l\'upload:', {
        errorMessage: uploadError.message,
        errorDetails: uploadError
      });
      throw uploadError;
    }

    if (!data?.path) {
      throw new Error('Impossible de récupérer le chemin du fichier');
    }

    // Récupérer l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from('artworks')
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Impossible de générer l\'URL publique');
    }

    return publicUrlData.publicUrl;

  } catch (error: any) {
    console.error('Erreur lors de l\'upload:', error);
    throw error;
  }
}
