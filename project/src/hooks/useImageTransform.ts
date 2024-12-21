import { useState } from 'react';
import { swapFace } from '../lib/replicate';

interface TransformOptions {
  intensity: number;
  contrast: number;
  brightness: number;
  color: string;
  message?: string;
}

interface TransformParams {
  sourceImage: string;
  targetImage: string;
  options: TransformOptions;
}

interface WebhookResponse {
  status: string;
  message: string;
  data: {
    id: number;
    url: string;
  };
}

interface TransformResult {
  sourceImageUrl: string;
  transformedImageUrl: string;
}

export const useImageTransform = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformImage = async ({ sourceImage, targetImage, options }: TransformParams): Promise<TransformResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const transformedImageUrl = await swapFace(sourceImage, targetImage);

      return {
        sourceImageUrl: sourceImage,
        transformedImageUrl
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transformImage,
    isLoading,
    error,
  };
};
