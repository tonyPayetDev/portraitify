import React, { useState } from 'react';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  description: string;
  image_url: string;
  category: string;
}

interface ArtworkGalleryProps {
  onSelectArtwork: (artwork: Artwork) => void;
}

const staticArtworks: Artwork[] = [
  {
    id: "1",
    title: "La Joconde",
    artist: "Leonardo da Vinci",
    year: 1503,
    description: "Portrait de Lisa Gherardini, épouse de Francesco del Giocondo",
    image_url: "https://placekitten.com/400/500",
    category: "Portrait"
  }
];

export const ArtworkGallery: React.FC<ArtworkGalleryProps> = ({ onSelectArtwork }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (artwork: Artwork) => {
    setSelectedId(artwork.id);
    onSelectArtwork(artwork);
  };


  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-montserrat font-light text-gray-800 mb-8 text-center">
        Choisissez votre style de portrait
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staticArtworks.map((artwork) => (
          <div
            key={artwork.id}
            className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.02]
              ${selectedId === artwork.id ? 'ring-4 ring-rose-500' : ''}`}
            onMouseEnter={() => setHoveredId(artwork.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelect(artwork)}
          >
            <div className="relative aspect-w-4 aspect-h-5">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="object-cover w-full h-full filter hover:brightness-90 transition-all duration-300"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300
                  ${hoveredId === artwork.id || selectedId === artwork.id ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-montserrat mb-2">{artwork.title}</h3>
                  <p className="text-sm text-gray-200">{artwork.artist} - {artwork.year}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Sélectionnez un style de portrait pour commencer. Notre IA s'occupera d'intégrer 
          parfaitement votre photo dans l'œuvre de votre choix.
        </p>
      </div>
    </div>
  );
};
