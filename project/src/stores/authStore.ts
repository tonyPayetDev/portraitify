import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { getCurrentUser } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  checkAuth: async () => {
    try {
      set({ loading: true, error: null });
      const { user } = await getCurrentUser();
      set({ user, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        loading: false 
      });
    }
  },
  setUser: (user) => set({ user }),
  clearError: () => set({ error: null })
}));
