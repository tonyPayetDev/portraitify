import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

console.log('Loading environment variables from:', envPath);
dotenv.config({ path: envPath });

console.log('Environment variables loaded:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Present' : 'Missing');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Creating Supabase client with URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const app = express();

// Configure multer for temporary file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Enable CORS
app.use(cors());

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.post('/convert-dpi', upload.single('image'), async (req: express.Request, res: express.Response) => {
  console.log('Received conversion request');
  
  try {
    if (!req.file) {
      console.error('No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    console.log('File received:', req.file);

    const inputPath = req.file.path;
    const outputPath = path.join(
      path.dirname(inputPath),
      `${path.parse(req.file.originalname).name}_300dpi.jpg`
    );

    console.log('Processing image...');
    console.log('Input path:', inputPath);
    console.log('Output path:', outputPath);

    // Process the image with Sharp
    await sharp(inputPath)
      .metadata()
      .then(async (metadata: sharp.Metadata) => {
        return sharp(inputPath)
          .jpeg({
            quality: 100,
            chromaSubsampling: '4:4:4'
          })
          .withMetadata({
            density: 300
          })
          .toFile(outputPath);
      });

    console.log('Image processed successfully');

    // Upload to Supabase Storage
    const fileStream = fs.createReadStream(outputPath);
    const fileName = `processed/${Date.now()}-${path.basename(outputPath)}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('images')
      .upload(fileName, fileStream, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Error uploading to Supabase: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    // Clean up temporary files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    // Send back the public URL
    res.json({ url: publicUrl });
    return;

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      error: 'Error processing image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
