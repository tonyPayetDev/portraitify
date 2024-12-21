import React, { useState, useEffect } from 'react';

const backgrounds = [
  'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg',
  'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg',
  'https://images.pexels.com/photos/3246665/pexels-photo-3246665.jpeg',
  'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
];

export function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {backgrounds.map((bg, index) => (
        <div
          key={bg}
          className={`absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    </div>
  );
}
