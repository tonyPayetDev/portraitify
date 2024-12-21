const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

console.log('Starting server initialization...');

try {
  console.log('Loading environment variables...');
  dotenv.config();
  console.log('Environment variables loaded');

  // Initialize Supabase client with error handling
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  console.log('Environment variables:');
  console.log('SUPABASE_URL:', supabaseUrl ? 'present' : 'missing');
  console.log('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'present' : 'missing');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required environment variables');
  }

  console.log('Creating Supabase client...');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('Supabase client created');

  console.log('Creating Express app...');
  const app = express();

  // Configure multer for temporary file storage
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  // Enable CORS
  app.use(cors());
  console.log('CORS enabled');

  // Basic health check endpoint
  app.get('/', (req, res) => {
    console.log('Health check request received');
    res.json({ status: 'Server is running' });
  });

  app.post('/convert-dpi', upload.single('image'), async (req, res) => {
    console.log('Received conversion request');
    
    try {
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('File received:', req.file.originalname);

      // Process image with Sharp
      const processedImageBuffer = await sharp(req.file.buffer)
        .metadata()
        .then(async ({ width, height }) => {
          // Double the image dimensions
          const newWidth = width * 2;
          const newHeight = height * 2;
          
          console.log(`Upscaling image from ${width}x${height} to ${newWidth}x${newHeight}`);
          
          return sharp(req.file.buffer)
            .resize(newWidth, newHeight, {
              kernel: sharp.kernel.lanczos3,
              fit: 'fill'
            })
            .jpeg({
              quality: 100,
              chromaSubsampling: '4:4:4',
              density: 300
            })
            .toBuffer();
        });

      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${req.file.originalname}`;
      
      // Upload to Supabase Storage
      console.log('Attempting to upload to Supabase Storage...');
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`processed/${filename}`, processedImageBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading to Supabase:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return res.status(500).json({ 
          error: 'Failed to upload processed image',
          details: error.message || 'Unknown error'
        });
      }

      console.log('Upload successful:', data);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`processed/${filename}`);

      // Save metadata to database
      const { data: imageRecord, error: dbError } = await supabase
        .from('images')
        .insert([
          {
            filename: filename,
            original_name: req.file.originalname,
            storage_path: `processed/${filename}`,
            public_url: publicUrl,
            processed_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Error saving to database:', dbError);
        return res.status(500).json({ error: 'Failed to save image metadata' });
      }

      console.log('Image processed and uploaded successfully');

      // Return the processed image URL and metadata
      res.json({
        success: true,
        image: imageRecord,
        url: publicUrl
      });

    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ 
        error: 'Error processing image',
        details: error.message || 'Unknown error'
      });
    }
  });

  const PORT = 4000;

  console.log('Starting server...');
  const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
    console.log('=================================');
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });

} catch (error) {
  console.error('Fatal error during startup:', error);
  process.exit(1);
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
