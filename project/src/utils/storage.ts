import { supabase } from './supabase';

export interface StoredImage {
  name: string;
  url: string;
  created_at: string;
}

export async function uploadImageToSupabase(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erreur lors de l'upload de l'image");
  }
}

export async function fetchStoredImages(): Promise<StoredImage[]> {
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('uploads', {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      throw new Error(`Erreur lors de la récupération des images: ${error.message}`);
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(`uploads/${file.name}`);

        return {
          name: file.name,
          url: publicUrl,
          created_at: file.created_at
        };
      })
    );

    return images;
  } catch (error) {
    console.error('Error fetching stored images:', error);
    return [];
  }
}
