import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onAccept, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 overflow-hidden"
          >
            {/* En-tête */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Mentions Légales</h3>
              <p className="mt-2 text-sm text-gray-500">
                Veuillez lire et accepter les conditions suivantes avant de continuer
              </p>
            </div>

            {/* Contenu */}
            <div className="space-y-4 mb-6 text-gray-600 text-sm">
              <p>
                En utilisant notre service de transformation d'images par IA, vous acceptez les conditions suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Vos photos seront temporairement stockées sur nos serveurs pour permettre la transformation par IA.
                </li>
                <li>
                  Les images générées peuvent être utilisées pour améliorer notre modèle d'IA, de manière anonyme.
                </li>
                <li>
                  Vous conservez tous les droits sur vos photos originales.
                </li>
                <li>
                  Nous nous engageons à ne pas partager vos photos originales avec des tiers.
                </li>
                <li>
                  Les images générées sont soumises à nos conditions d'utilisation et peuvent être supprimées à tout moment.
                </li>
              </ul>
              <p className="font-medium mt-4">
                En cliquant sur "J'accepte", vous confirmez avoir lu et accepté ces conditions.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Annuler
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAccept}
                className="px-6 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                J'accepte
              </motion.button>
            </div>

            {/* Bouton de fermeture */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
