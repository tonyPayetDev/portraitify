export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  description: string;
  imageUrl: string;
  category: string;
}

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "La Joconde",
    artist: "Leonardo da Vinci",
    year: 1503,
    description: "Portrait de Lisa Gherardini, épouse de Francesco del Giocondo",
    imageUrl: "/images/mona-lisa.jpg",
    category: "Portrait"
  },
  {
    id: "2",
    title: "La Nuit étoilée",
    artist: "Vincent van Gogh",
    year: 1889,
    description: "Vue depuis la fenêtre de l'asile de Saint-Rémy-de-Provence",
    imageUrl: "/images/starry-night.jpg",
    category: "Paysage"
  },
  {
    id: "3",
    title: "Les Demoiselles d'Avignon",
    artist: "Pablo Picasso",
    year: 1907,
    description: "Une œuvre majeure du cubisme",
    imageUrl: "/images/demoiselles-avignon.jpg",
    category: "Moderne"
  }
];
