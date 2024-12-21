import React from 'react';
import { motion } from 'framer-motion';

interface CustomizationOption {
  id: string;
  label: string;
  value: string | number;
  min?: number;
  max?: number;
  step?: number;
  type: 'slider' | 'color' | 'text';
}

interface CustomizationProps {
  options: CustomizationOption[];
  onChange: (id: string, value: string | number) => void;
}

export const Customization: React.FC<CustomizationProps> = ({ options, onChange }) => {
  const handleChange = (option: CustomizationOption, value: string | number) => {
    onChange(option.id, value);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-montserrat font-light text-gray-800 mb-6">
        Personnalisation
      </h3>
      
      <div className="space-y-6">
        {options.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700">
              {option.label}
            </label>
            
            {option.type === 'slider' && (
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={option.min}
                  max={option.max}
                  step={option.step}
                  value={option.value}
                  onChange={(e) => handleChange(option, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-sm text-gray-600 w-12 text-right">
                  {option.value}
                </span>
              </div>
            )}

            {option.type === 'color' && (
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={option.value as string}
                  onChange={(e) => handleChange(option, e.target.value)}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {option.value}
                </span>
              </div>
            )}

            {option.type === 'text' && (
              <input
                type="text"
                value={option.value as string}
                onChange={(e) => handleChange(option, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Entrez ${option.label.toLowerCase()}`}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Appliquer les modifications
        </motion.button>
      </div>
    </div>
  );
};
