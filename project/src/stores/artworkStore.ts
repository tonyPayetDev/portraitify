import { create } from 'zustand';
import { Artwork, getArtworks, createArtwork, updateArtwork, deleteArtwork } from '../lib/artworks';

interface ArtworkStore {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  fetchArtworks: () => Promise<void>;
  addArtwork: (artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateArtwork: (id: string, artwork: Partial<Artwork>) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
}

export const useArtworkStore = create<ArtworkStore>((set) => ({
  artworks: [],
  loading: false,
  error: null,

  fetchArtworks: async () => {
    set({ loading: true, error: null });
    try {
      const artworks = await getArtworks();
      set({ artworks, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        loading: false 
      });
    }
  },

  addArtwork: async (artwork) => {
    set({ loading: true, error: null });
    try {
      const newArtwork = await createArtwork(artwork);
      set((state) => ({ 
        artworks: [newArtwork, ...state.artworks],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        loading: false 
      });
    }
  },

  updateArtwork: async (id, artwork) => {
    set({ loading: true, error: null });
    try {
      const updatedArtwork = await updateArtwork(id, artwork);
      set((state) => ({
        artworks: state.artworks.map((a) => 
          a.id === id ? updatedArtwork : a
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        loading: false 
      });
    }
  },

  deleteArtwork: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteArtwork(id);
      set((state) => ({
        artworks: state.artworks.filter((a) => a.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        loading: false 
      });
    }
  }
}));
