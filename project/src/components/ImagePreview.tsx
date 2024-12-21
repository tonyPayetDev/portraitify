import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  title: string;
  onRemove?: () => void;
}

export function ImagePreview({ imageUrl, title, onRemove }: ImagePreviewProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-red-600/10 to-red-800/10 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Supprimer l'image"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
        )}
      </div>
      <div className="relative aspect-video">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}