import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtworkGallery } from './ArtworkGallery';
import { ImageUploader } from './ImageUploader';
import { Customization } from './Customization';
import { artworks } from '../data/artworks';
import { useImageTransform } from '../hooks/useImageTransform';
import { Logo } from './Logo';
import { LegalModal } from './LegalModal';
import { WelcomeModal } from './WelcomeModal';
import { uploadImage } from '../lib/storage';

interface PortraitStudioState {
  step: number;
  selectedArtwork: Artwork | null;
  uploadedImageUrl: string | null;
  customization: {
    intensity: number;
    contrast: number;
    brightness: number;
    color: string;
    message: string;
  };
  processingImage: boolean;
  finalImage: string | null;
  error: string | null;
}

interface Artwork {
  id: number;
  image_url: string;
  // Add other artwork properties here
}

export const PortraitStudio: React.FC = () => {
  const [state, setState] = useState<PortraitStudioState>({
    step: 1,
    selectedArtwork: null,
    uploadedImageUrl: null,
    customization: {
      intensity: 75,
      contrast: 50,
      brightness: 50,
      color: '#FF9B9B',
      message: '',
    },
    processingImage: false,
    finalImage: null,
    error: null,
  });

  // Vérifier si les mentions légales ont déjà été acceptées
  const [showLegalModal, setShowLegalModal] = useState(() => {
    return !localStorage.getItem('legalAccepted');
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const { transformImage, isLoading: isTransforming } = useImageTransform();

  const customizationOptions = [
    {
      id: 'intensity',
      label: 'Intensité de la transformation',
      value: state.customization.intensity,
      min: 0,
      max: 100,
      step: 1,
      type: 'slider' as const,
    },
    {
      id: 'contrast',
      label: 'Contraste',
      value: state.customization.contrast,
      min: 0,
      max: 100,
      step: 1,
      type: 'slider' as const,
    },
    {
      id: 'brightness',
      label: 'Luminosité',
      value: state.customization.brightness,
      min: 0,
      max: 100,
      step: 1,
      type: 'slider' as const,
    },
    {
      id: 'color',
      label: 'Teinte dominante',
      value: state.customization.color,
      type: 'color' as const,
    },
    {
      id: 'message',
      label: 'Message personnalisé',
      value: state.customization.message,
      type: 'text' as const,
    },
  ];

  const handleArtworkSelect = (artwork: Artwork) => {
    setState((prev) => ({
      ...prev,
      selectedArtwork: artwork,
      step: prev.uploadedImageUrl ? 3 : 2
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      setState(prev => ({
        ...prev,
        uploadedImageUrl: imageUrl,
        step: prev.selectedArtwork ? 3 : 2,
        error: null
      }));
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'upload'
      }));
    }
  };

  const handleCustomizationChange = (id: string, value: string | number) => {
    setState((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        [id]: value,
      },
    }));
  };

  const handleProcessImage = async () => {
    if (!state.selectedArtwork || !state.uploadedImageUrl) return;

    setState((prev) => ({ ...prev, processingImage: true }));
    
    try {
      const result = await transformImage({
        sourceImage: state.uploadedImageUrl,
        targetImage: state.selectedArtwork.image_url,
        options: {
          intensity: state.customization.intensity / 100,
          contrast: state.customization.contrast / 100,
          brightness: state.customization.brightness / 100,
          color: state.customization.color,
          message: state.customization.message,
        }
      });

      setState((prev) => ({
        ...prev,
        finalImage: result.transformedImageUrl,
        processingImage: false,
        step: 4
      }));
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      setState((prev) => ({ 
        ...prev, 
        processingImage: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      }));
    }
  };

  const handleLegalAccept = () => {
    localStorage.setItem('legalAccepted', 'true');
    setShowLegalModal(false);
    setShowWelcomeModal(true);
  };

  const handleLegalDecline = () => {
    setShowLegalModal(true);
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
  };

  useEffect(() => {
    if (state.error) {
      // Vous pouvez implémenter ici une notification ou un toast pour afficher l'erreur
      console.error(state.error);
    }
  }, [state.error]);

  const stepTitles = [
    'Choisissez votre style',
    'Ajoutez votre photo',
    'Personnalisez votre portrait',
    'Votre portrait est prêt !',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* En-tête avec logo */}
      <div className="max-w-7xl mx-auto mb-12">
        <Logo className="mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-montserrat font-light text-gray-900 mb-4">
            Portraitify Studio
          </h1>
          <div className="flex justify-center items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="flex items-center"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= state.step
                      ? 'bg-rose-400 text-white'
                      : 'bg-rose-200 text-rose-600'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step < state.step ? 'bg-rose-400' : 'bg-rose-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl text-rose-600 mt-4">
            {stepTitles[state.step - 1]}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {state.step === 1 && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ArtworkGallery onSelectArtwork={handleArtworkSelect} />
            </motion.div>
          )}

          {state.step === 2 && (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ImageUploader
                onImageUpload={handleImageUpload}
                isProcessing={state.processingImage}
              />
            </motion.div>
          )}

          {state.step === 3 && (
            <motion.div
              key="customization"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-center gap-8">
                {state.selectedArtwork && (
                  <div className="w-1/3">
                    <img
                      src={state.selectedArtwork.image_url}
                      alt="Style sélectionné"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                )}
                {state.uploadedImageUrl && (
                  <div className="w-1/3">
                    <img
                      src={state.uploadedImageUrl}
                      alt="Votre photo"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>

              <Customization
                options={customizationOptions}
                onChange={handleCustomizationChange}
              />

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  onClick={handleProcessImage}
                  disabled={state.processingImage || isTransforming}
                >
                  {(state.processingImage || isTransforming) ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Création en cours...
                    </div>
                  ) : (
                    'Créer mon portrait'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {state.step === 4 && state.finalImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                  {/* Image source */}
                  <div className="w-full md:w-1/2 max-w-md">
                    <div className="relative">
                      <img
                        src={state.uploadedImageUrl || ''}
                        alt="Image source"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm text-rose-600 font-medium">Image source</span>
                      </div>
                    </div>
                  </div>

                  {/* Flèche de transformation */}
                  <div className="hidden md:flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <svg
                        className="w-12 h-12 text-rose-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Image transformée */}
                  <div className="w-full md:w-1/2 max-w-md">
                    <div className="relative">
                      <img
                        src={state.finalImage}
                        alt="Portrait transformé"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm text-rose-600 font-medium">Résultat</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paramètres utilisés */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres utilisés</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Intensité</p>
                      <p className="font-medium">{state.customization.intensity}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contraste</p>
                      <p className="font-medium">{state.customization.contrast}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Luminosité</p>
                      <p className="font-medium">{state.customization.brightness}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Couleur</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: state.customization.color }}
                        />
                        <p className="font-medium">{state.customization.color}</p>
                      </div>
                    </div>
                  </div>
                  {state.customization.message && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Message</p>
                      <p className="font-medium">{state.customization.message}</p>
                    </div>
                  )}
                </motion.div>

                {/* Boutons d'action */}
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    onClick={() => window.open(state.finalImage, '_blank')}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Télécharger
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                    onClick={() => setState((prev) => ({
                      ...prev,
                      step: 1,
                      selectedArtwork: null,
                      uploadedImageUrl: null,
                      finalImage: null,
                      customization: {
                        intensity: 75,
                        contrast: 50,
                        brightness: 50,
                        color: '#FF9B9B',
                        message: '',
                      },
                    }))}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Créer un nouveau portrait
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
