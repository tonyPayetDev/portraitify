import React from 'react';

const testimonials = [
  {
    name: "Marie L.",
    role: "Coach Bien-être",
    testimonial: "Grâce aux accroches virales, j'ai multiplié mes vues par 10 en seulement 2 semaines !",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Thomas D.",
    role: "E-commerçant",
    testimonial: "Un outil indispensable pour tout créateur de contenu qui veut se démarquer.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Sophie M.",
    role: "Influenceuse Lifestyle",
    testimonial: "La meilleure investissement pour ma présence sur les réseaux sociaux.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

export function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, i) => (
        <div key={i} className="bg-gray-800/30 p-6 rounded-2xl">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-300 mb-4">"{testimonial.testimonial}"</p>
          <div className="text-center">
            <h4 className="font-bold">{testimonial.name}</h4>
            <p className="text-yellow-400">{testimonial.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}