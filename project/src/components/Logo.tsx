import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  const controls = useAnimation();
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const startBlinking = async () => {
      // Séquence initiale d'apparition
      await controls.start({
        opacity: [0, 1],
        scale: [0.8, 1],
        transition: { duration: 0.5 }
      });

      const blink = async () => {
        if (!isBlinking) {
          setIsBlinking(true);
          await controls.start({
            opacity: [1, 0.3, 1],
            transition: { duration: 0.2, times: [0, 0.5, 1] }
          });
          setIsBlinking(false);
        }
      };

      // Démarrer les clignotements aléatoires
      const interval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% de chance de clignoter
          blink();
        }
      }, 2000); // Vérifier toutes les 2 secondes

      return () => clearInterval(interval);
    };

    startBlinking();
  }, [controls, isBlinking]);

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      animate={controls}
      onClick={onClick}
    >
      {/* Icône du logo avec clignotement indépendant */}
      <motion.div
        className="relative w-10 h-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Cercles avec effets de brillance */}
        <motion.div 
          className="absolute inset-0 bg-rose-500 rounded-lg transform rotate-45"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(255, 155, 155, 0)",
              "0 0 8px 2px rgba(255, 155, 155, 0.3)",
              "0 0 0 0 rgba(255, 155, 155, 0)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute inset-1 bg-white rounded-lg transform rotate-45"
          animate={{
            scale: [1, 1.02, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        />
        <motion.div 
          className="absolute inset-2 bg-rose-500 rounded-lg transform rotate-45"
          animate={{
            rotate: [45, 55, 45],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>

      {/* Texte du logo avec effet de flottement */}
      <motion.div 
        className="flex flex-col"
        animate={{
          y: [0, -2, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      >
        <motion.span 
          className="text-2xl font-bold text-gray-800 tracking-tight"
          animate={{
            opacity: [0.9, 1, 0.9],
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          Portraitify
        </motion.span>
        <motion.span 
          className="text-xs text-rose-500 font-medium -mt-1"
          animate={{
            opacity: [0.8, 1, 0.8],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          AI Portrait Studio
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
