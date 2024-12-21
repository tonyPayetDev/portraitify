import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory's .env file
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const artworks = [
  {
    id: "1",
    title: "La Joconde",
    artist: "Leonardo da Vinci",
    year: 1503,
    description: "Portrait de Lisa Gherardini, épouse de Francesco del Giocondo",
    image_url: "/images/artworks/artwork-1.jpg",
    category: "Portrait"
  },
  {
    id: "2",
    title: "La Nuit étoilée",
    artist: "Vincent van Gogh",
    year: 1889,
    description: "Vue depuis la fenêtre de l'asile de Saint-Rémy-de-Provence",
    image_url: "/images/artworks/artwork-1.jpg",
    category: "Paysage"
  },
  {
    id: "3",
    title: "Les Demoiselles d'Avignon",
    artist: "Pablo Picasso",
    year: 1907,
    description: "Une œuvre majeure du cubisme",
    image_url: "/images/artworks/artwork-1.jpg",
    category: "Moderne"
  }
]

async function createArtworks() {
  try {
    // First, create the table if it doesn't exist
    const { error: createError } = await supabase.rpc('create_artworks_table')
    if (createError) {
      throw createError
    }

    // Insert the artworks
    const { data, error } = await supabase
      .from('artworks')
      .upsert(artworks, { onConflict: 'id' })

    if (error) throw error

    console.log('Artworks added successfully:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

createArtworks()
