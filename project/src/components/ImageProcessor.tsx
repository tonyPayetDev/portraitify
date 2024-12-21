import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageUpload } from './ImageUpload';
import { ImagePreview } from './ImagePreview';
import { StatusMessage } from './StatusMessage';
import { SubmitButton } from './SubmitButton';
import { ArtworkGallery } from './ArtworkGallery';
import { validateImage } from '../utils/validation';
import { uploadImage } from '../lib/storage';
import { swapFace } from '../lib/replicate';
import { useAuth } from '../contexts/AuthContext';

export function ImageProcessor() {
  const [tableauImage, setTableauImage] = useState<string | null>(null);
  const [visageImage, setVisageImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = async (file: File, setImage: (url: string) => void) => {
    try {
      // Validation côté client avant l'upload
      if (!file) {
        throw new Error('Aucun fichier sélectionné');
      }

      // Vérification du type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Type de fichier non autorisé. Types acceptés : JPEG, PNG, GIF, WebP. Type reçu : ${file.type}`);
      }

      // Vérification de la taille
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille de l\'image ne doit pas dépasser 5 Mo');
      }

      setUploadProgress("Upload en cours...");
      setError(null);
      const imageUrl = await uploadImage(file);
      setImage(imageUrl);
      setUploadProgress(null);
      setSuccess(false);
    } catch (err) {
      console.error('Erreur lors de l\'upload :', err);
      
      // Gestion détaillée des erreurs
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Une erreur inconnue est survenue lors de l'upload";
      
      // Messages d'erreur spécifiques
      if (errorMessage.includes('5 Mo')) {
        setError("La taille de l'image ne doit pas dépasser 5 Mo");
      } else if (errorMessage.includes('Type de fichier')) {
        setError(`Formats autorisés : JPEG, PNG, GIF, WebP. Type reçu : ${file.type}`);
      } else if (errorMessage.includes('Aucun fichier')) {
        setError("Veuillez sélectionner un fichier");
      } else {
        // Erreur générique
        setError(errorMessage);
      }
      
      setUploadProgress(null);
    }
  };

  const handleArtworkSelect = (artwork: any) => {
    setTableauImage(artwork.image_url);
    setShowGallery(false);
  };

  const handleSubmit = async () => {
    if (!tableauImage || !visageImage) {
      setError("Veuillez sélectionner les deux images");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setResultImage(null);

    try {
      const imageUrl = await swapFace(visageImage, tableauImage);
      setResultImage(imageUrl);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors du traitement des images");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black p-8 bg-white">
      <div className="space-y-6">
        {showGallery ? (
          <ArtworkGallery 
            onSelectArtwork={handleArtworkSelect} 
          />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-light text-black">Images Sélectionnées</h3>
              <button
                onClick={() => setShowGallery(true)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Changer d'œuvre d'art
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <ImageUpload 
                  title="Votre Portrait"
                  description="Sélectionnez votre portrait"
                  onImageSelect={(file) => handleImageUpload(file, setVisageImage)}
                  accept="image/*"
                />
                {visageImage && (
                  <ImagePreview 
                    imageUrl={visageImage} 
                    onRemove={() => setVisageImage(null)} 
                  />
                )}
              </div>

              <div>
                <div className="text-center">
                  <h4 className="text-lg font-light mb-4">Œuvre d'art sélectionnée</h4>
                  {tableauImage && (
                    <img 
                      src={tableauImage} 
                      alt="Artwork" 
                      className="mx-auto max-h-64 object-contain rounded-lg shadow-md" 
                    />
                  )}
                </div>
              </div>
            </div>

            {error && <StatusMessage type="error" message={error} />}
            {success && <StatusMessage type="success" message="Transformation réussie !" />}

            <SubmitButton 
              isLoading={isLoading}
              onSubmit={handleSubmit}
              disabled={!visageImage || !tableauImage}
            />

            {resultImage && (
              <div className="mt-8">
                <h3 className="text-xl font-light text-black mb-4">Résultat</h3>
                <img 
                  src={resultImage} 
                  alt="Résultat de la transformation" 
                  className="mx-auto max-w-full rounded-lg shadow-lg" 
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}