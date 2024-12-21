import express from 'express';
import Replicate from 'replicate';

const router = express.Router();

// Initialiser le client Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

router.post('/swap-face', async (req, res) => {
  const { sourceImage, targetImage } = req.body;

  console.log('Face swap request received:', { sourceImage, targetImage });

  try {
    // Validation des entrées
    if (!sourceImage || !targetImage) {
      return res.status(400).json({ error: 'Source and target images are required' });
    }

    // Check Replicate API token
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(500).json({ 
        error: 'Replicate API token is not configured. Please check your environment variables.' 
      });
    }

    // Prediction configuration
    const prediction = await replicate.predictions.create({
      version: "9a34a6ace5d1ae0d13767980f2a2b1f0a5a612e2db43a9d45a6b05b9f9fbb7e0",
      input: {
        source_image: sourceImage,
        target_image: targetImage
      }
    });

    // Wait for prediction to complete
    const finalPrediction = await replicate.wait(prediction);

    // Return the result
    return res.status(200).json({ result: finalPrediction.output });

  } catch (error: any) {
    console.error('Face swap error:', error);

    // Handle specific Replicate API errors
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later or upgrade your Replicate account.',
        details: 'You have exhausted your free tier API calls. Consider upgrading or waiting before retrying.'
      });
    }

    // Generic error handling
    return res.status(500).json({ 
      error: 'An error occurred during face swap',
      details: error.message || 'Unknown error'
    });
  }
});

export default router;
