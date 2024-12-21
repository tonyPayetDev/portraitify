import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const decorationVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.2
      }
    },
    exit: { 
      scale: 0, 
      rotate: 180,
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay avec effet de flou */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 overflow-hidden"
          >
            {/* Décoration */}
            <motion.div
              variants={decorationVariants}
              className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full opacity-20"></div>
            </motion.div>

            {/* En-tête */}
            <motion.div
              variants={itemVariants}
              className="relative mb-6"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenue sur Portraitify
              </h3>
              <p className="text-lg text-rose-600 font-medium">
                Votre Studio Portrait IA
              </p>
            </motion.div>

            {/* Contenu */}
            <motion.div
              variants={itemVariants}
              className="space-y-4 mb-8 text-gray-600"
            >
              <p className="text-lg">
                Transformez vos photos en œuvres d'art uniques grâce à notre technologie d'IA avancée.
              </p>
              
              <motion.div
                variants={itemVariants}
                className="bg-rose-50 rounded-lg p-4 space-y-2"
              >
                <h4 className="font-medium text-gray-900">Comment ça marche ?</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <motion.li
                    variants={itemVariants}
                    className="transition-colors hover:text-rose-600"
                  >
                    Choisissez un style artistique qui vous inspire
                  </motion.li>
                  <motion.li
                    variants={itemVariants}
                    className="transition-colors hover:text-rose-600"
                  >
                    Uploadez votre photo
                  </motion.li>
                  <motion.li
                    variants={itemVariants}
                    className="transition-colors hover:text-rose-600"
                  >
                    Personnalisez les paramètres selon vos préférences
                  </motion.li>
                  <motion.li
                    variants={itemVariants}
                    className="transition-colors hover:text-rose-600"
                  >
                    Laissez notre IA créer votre portrait unique
                  </motion.li>
                </ol>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
              >
                <h4 className="font-medium text-gray-900 mb-2">Notre engagement</h4>
                <p>
                  Nous accordons une grande importance à la confidentialité de vos données. 
                  Vos photos sont traitées de manière sécurisée et ne sont jamais partagées 
                  avec des tiers.
                </p>
              </motion.div>
            </motion.div>

            {/* Bouton */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#FF6B6B" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="px-6 py-3 bg-rose-500 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-shadow"
              >
                Commencer l'expérience
              </motion.button>
            </motion.div>

            {/* Bouton de fermeture avec animation */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
