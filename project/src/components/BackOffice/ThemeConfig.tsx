import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export const ThemeConfig: React.FC = () => {
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#FF4B6E',
    secondary: '#FF9B9B',
    accent: '#FFD4D4',
    background: '#F9FAFB',
    text: '#111827',
  });

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }));
    
    // TODO: Save to localStorage or backend
    document.documentElement.style.setProperty(`--color-${key}`, value);
  };

  const colorFields = [
    { key: 'primary', label: 'Couleur Principale' },
    { key: 'secondary', label: 'Couleur Secondaire' },
    { key: 'accent', label: 'Couleur d\'Accent' },
    { key: 'background', label: 'Arrière-plan' },
    { key: 'text', label: 'Texte' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Configuration du Thème</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {colorFields.map(({ key, label }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={colors[key as keyof ThemeColors]}
                onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                className="h-10 w-20 rounded border border-gray-300"
              />
              <input
                type="text"
                value={colors[key as keyof ThemeColors]}
                onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu</h3>
        <div 
          className="p-6 rounded-lg"
          style={{ backgroundColor: colors.background }}
        >
          <div 
            className="space-y-4"
            style={{ color: colors.text }}
          >
            <div className="space-x-4">
              <button
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: colors.primary }}
              >
                Bouton Principal
              </button>
              <button
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: colors.secondary }}
              >
                Bouton Secondaire
              </button>
            </div>
            <div 
              className="p-4 rounded-md"
              style={{ backgroundColor: colors.accent }}
            >
              Zone d'accent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
