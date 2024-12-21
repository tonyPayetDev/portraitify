import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface ProcessedImage {
  id: string;
  filename: string;
  original_name: string;
  public_url: string;
  processed_at: string;
}

export const DPIConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const loadProcessedImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('processed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setProcessedImages(data || []);
    } catch (err) {
      console.error('Error loading images:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3002/convert-dpi', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process image');
      }

      // Reload the list of processed images
      await loadProcessedImages();
      
      // Reset form
      setFile(null);
      setPreview('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load processed images on component mount
  useEffect(() => {
    loadProcessedImages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">DPI Converter</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </label>
        </div>

        {preview && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img src={preview} alt="Preview" className="max-w-md rounded-lg shadow-md" />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!file || loading}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white
            ${loading
              ? 'bg-gray-400'
              : 'bg-violet-600 hover:bg-violet-700'
            }`}
        >
          {loading ? 'Processing...' : 'Convert to 300 DPI'}
        </motion.button>
      </form>

      {/* Processed Images List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Conversions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedImages.map((image) => (
            <div key={image.id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={image.public_url}
                alt={image.original_name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">{image.original_name}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(image.processed_at).toLocaleDateString()}
                </span>
                <a
                  href={image.public_url}
                  download
                  className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
