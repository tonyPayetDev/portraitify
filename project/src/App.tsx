import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ImageProcessor } from './components/ImageProcessor';
import { Logo } from './components/Logo';
import { Navigation } from './components/Navigation';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="text-center mb-12">
                  <Logo className="mx-auto mb-8" />
                  <ImageProcessor />
                </div>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
