import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  title: string;
  description: string;
  onImageSelect: (file: File) => void;
  accept?: string;
}

export function ImageUpload({ 
  title, 
  description, 
  onImageSelect, 
  accept = "image/*" 
}: ImageUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`file-${title}`}
        />
        <label
          htmlFor={`file-${title}`}
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-600 mb-2">{description}</p>
          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30">
            Sélectionner une image
          </span>
        </label>
      </div>
    </div>
  );
}