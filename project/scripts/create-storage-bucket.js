// @ts-check
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStorageBucket() {
  try {
    // Créer le bucket
    const { error: createError } = await supabase
      .storage
      .createBucket('artworks', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });

    if (createError) {
      throw createError;
    }

    console.log('Storage bucket created successfully');
  } catch (error) {
    if (error.message?.includes('already exists')) {
      console.log('Storage bucket already exists');
      return;
    }
    console.error('Error creating storage bucket:', error);
  }
}

createStorageBucket();
