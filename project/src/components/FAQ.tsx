import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Comment accéder à l'offre du Super Pack d'accroches virales ?",
    answer: "Après votre achat, vous recevrez un accès immédiat à notre plateforme exclusive où vous pourrez télécharger tous les modèles d'accroches."
  },
  {
    question: "Quels sont les secteurs concernés ?",
    answer: "Notre pack est adapté à tous les secteurs : e-commerce, coaching, formation, bien-être, tech, mode, etc. Les accroches sont personnalisables selon votre niche."
  },
  {
    question: "Le programme est-il adapté aux débutants ?",
    answer: "Absolument ! Nos modèles sont conçus pour être facilement adaptables, que vous soyez débutant ou expert en création de contenu."
  },
  {
    question: "Y a-t-il des mises à jour régulières ?",
    answer: "Oui, nous ajoutons régulièrement de nouveaux modèles d'accroches basés sur les dernières tendances des réseaux sociaux."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-700">
          <button
            className="flex justify-between items-center w-full py-4 text-left"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium">{faq.question}</span>
            <ChevronDown className={`w-5 h-5 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === index && (
            <p className="pb-4 text-gray-400">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}