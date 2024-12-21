import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage } from '../../lib/storage';
import { useArtworkStore } from '../../stores/artworkStore';
import type { Artwork } from '../../lib/artworks';

export const ArtworkManager: React.FC = () => {
  const { artworks, fetchArtworks, addArtwork, deleteArtwork, loading, error } = useArtworkStore();
  const [newArtwork, setNewArtwork] = useState<Partial<Artwork>>({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    description: '',
    image_url: '',
    category: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewArtwork(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadImage(file);
      setNewArtwork(prev => ({
        ...prev,
        image_url: imageUrl
      }));
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      if (error.message === 'User must be authenticated to upload images') {
        setUploadError('Vous devez être connecté pour uploader des images.');
      } else if (error.message?.includes('Unauthorized')) {
        setUploadError('Vous n\'avez pas les permissions nécessaires pour uploader des images.');
      } else {
        setUploadError('Erreur lors de l\'upload de l\'image. Veuillez réessayer.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtwork.title || !newArtwork.image_url || !newArtwork.category) return;

    try {
      await addArtwork({
        title: newArtwork.title,
        artist: newArtwork.artist || 'Anonyme',
        year: newArtwork.year || new Date().getFullYear(),
        description: newArtwork.description || '',
        image_url: newArtwork.image_url,
        category: newArtwork.category,
      });

      setNewArtwork({
        title: '',
        artist: '',
        year: new Date().getFullYear(),
        description: '',
        image_url: '',
        category: '',
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArtwork(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des Tableaux</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
        >
          Ajouter un Tableau
        </button>
      </div>

      {/* Liste des tableaux */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {artworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white p-4 rounded-lg shadow"
            >
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="font-medium text-gray-900">{artwork.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{artwork.artist}, {artwork.year}</p>
              <p className="text-sm text-gray-500 mb-2">{artwork.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-rose-600">{artwork.category}</span>
                <button
                  onClick={() => handleDelete(artwork.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal d'ajout */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-medium mb-4">Ajouter un Tableau</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newArtwork.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Artiste
                  </label>
                  <input
                    type="text"
                    name="artist"
                    value={newArtwork.artist}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={newArtwork.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newArtwork.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                    required={!newArtwork.image_url}
                  />
                  {isUploading && (
                    <p className="text-sm text-gray-500 mt-1">Upload en cours...</p>
                  )}
                  {uploadError && (
                    <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={newArtwork.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Paysage">Paysage</option>
                    <option value="Nature morte">Nature morte</option>
                    <option value="Abstrait">Abstrait</option>
                    <option value="Moderne">Moderne</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`px-4 py-2 bg-rose-600 text-white rounded-md ${
                      isUploading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-rose-700'
                    }`}
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
