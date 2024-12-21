import React from 'react';
import { Play } from 'lucide-react';

const videos = [
  {
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    title: "Comment j'ai atteint 1M de vues",
    views: "1.2M vues"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1622563064789-b7e50f7c7f8f?w=800&q=80",
    title: "Technique secrète de viralité",
    views: "890K vues"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&q=80",
    title: "Hack TikTok révélé",
    views: "750K vues"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&q=80",
    title: "Stratégie de contenu viral",
    views: "950K vues"
  }
];

export function VideoGallery() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <div key={index} className="group relative overflow-hidden rounded-xl">
          <div className="aspect-video relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-black fill-current" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-800/90 absolute bottom-0 left-0 right-0">
            <h3 className="text-sm font-semibold mb-1 truncate">{video.title}</h3>
            <p className="text-xs text-yellow-400">{video.views}</p>
          </div>
        </div>
      ))}
    </div>
  );
}