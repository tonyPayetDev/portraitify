import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtworkManager } from './ArtworkManager';
import { CategoryManager } from './CategoryManager';
import { ThemeConfig } from './ThemeConfig';
import { DPIConverter } from './DPIConverter';

type Tab = 'themes' | 'artworks' | 'categories' | 'dpi';

export const BackOffice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('themes');

  const tabs = [
    { id: 'themes', label: 'Thèmes' },
    { id: 'artworks', label: 'Tableaux' },
    { id: 'categories', label: 'Catégories' },
    { id: 'dpi', label: 'Convertisseur DPI' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-rose-500 text-rose-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'themes' && <ThemeConfig />}
            {activeTab === 'artworks' && <ArtworkManager />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'dpi' && <DPIConverter />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
