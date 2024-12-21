import { supabase } from './supabase';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  description: string;
  image_url: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export async function getArtworks() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Artwork[];
}

export async function createArtwork(artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at'>) {
  // Générer un ID unique
  const id = `artwork_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const { data, error } = await supabase
    .from('artworks')
    .insert([{ id, ...artwork }])
    .select()
    .single();

  if (error) throw error;
  return data as Artwork;
}

export async function updateArtwork(id: string, artwork: Partial<Artwork>) {
  const { data, error } = await supabase
    .from('artworks')
    .update(artwork)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Artwork;
}

export async function deleteArtwork(id: string) {
  const { error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
