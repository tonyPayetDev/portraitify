import React from 'react';
import { Zap, Star, Users } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "1000+ Accroches Virales",
    description: "Des modèles d'accroches testés et approuvés pour tous les secteurs"
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Formats Optimisés",
    description: "Adaptés pour TikTok, Instagram Reels et YouTube Shorts"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Communauté VIP",
    description: "Accès à notre groupe privé de créateurs de contenu"
  }
];

export function Features() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <div key={i} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
          <div className="text-yellow-400 mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}