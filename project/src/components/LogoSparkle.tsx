import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const LogoSparkle: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const createSparkle = (): Sparkle => {
      return {
        id: Math.random(),
        x: Math.random() * (window.innerWidth - 40), // -40 pour la taille du logo
        y: Math.random() * (window.innerHeight - 40),
        scale: 0.2 + Math.random() * 0.3, // Taille entre 0.2 et 0.5
        rotation: Math.random() * 360,
      };
    };

    const addSparkle = () => {
      if (Math.random() < 0.3) { // 30% de chance d'ajouter un sparkle
        const newSparkle = createSparkle();
        setSparkles(prev => [...prev, newSparkle]);

        // Supprimer le sparkle après un délai aléatoire
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1000 + Math.random() * 2000); // Durée entre 1 et 3 secondes
      }
    };

    const interval = setInterval(addSparkle, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: sparkle.x,
              y: sparkle.y,
              rotate: sparkle.rotation - 90
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, sparkle.scale, 0],
              rotate: sparkle.rotation + 90
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{ left: 0, top: 0 }}
          >
            {/* Mini version du logo */}
            <div className="relative w-10 h-10">
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-rose-500/30 rounded-lg transform rotate-45" />
                <div className="absolute inset-1 bg-white/30 rounded-lg transform rotate-45" />
                <div className="absolute inset-2 bg-rose-500/30 rounded-lg transform rotate-45" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
