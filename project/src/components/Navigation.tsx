import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Logo 
            className="cursor-pointer" 
            onClick={() => navigate('/')}
          />
          
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <Link
                to="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Retour au Studio
              </Link>
            ) : (
              <Link
                to="/admin"
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Administration
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
