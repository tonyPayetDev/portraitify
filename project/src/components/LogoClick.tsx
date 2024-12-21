import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClickLogo {
  id: number;
  x: number;
  y: number;
}

export const LogoClick: React.FC = () => {
  const [clickLogos, setClickLogos] = useState<ClickLogo[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const newLogo = {
      id: Date.now(),
      x: e.clientX - 20, // Centre le logo sur le clic
      y: e.clientY - 20,
    };

    setClickLogos(prev => [...prev, newLogo]);

    // Supprimer le logo après l'animation
    setTimeout(() => {
      setClickLogos(prev => prev.filter(logo => logo.id !== newLogo.id));
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 cursor-pointer"
      onClick={handleClick}
    >
      <AnimatePresence>
        {clickLogos.map((logo) => (
          <motion.div
            key={logo.id}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: logo.x,
              y: logo.y,
              rotate: -180
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: 180,
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
            className="absolute"
          >
            <div className="relative w-10 h-10">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255, 155, 155, 0)",
                    "0 0 20px 10px rgba(255, 155, 155, 0.3)",
                    "0 0 0 0 rgba(255, 155, 155, 0)"
                  ]
                }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-rose-500/50 rounded-lg transform rotate-45" />
                <div className="absolute inset-1 bg-white/50 rounded-lg transform rotate-45" />
                <div className="absolute inset-2 bg-rose-500/50 rounded-lg transform rotate-45" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
