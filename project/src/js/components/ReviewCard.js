import { getReviewStars } from '../reviewData.js';
import { formatDate } from '../utils/dateFormatter.js';

export const createReviewCard = ({ image, rating, text, date, verified }) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    card.innerHTML = `
        <img src="${image}" alt="Avis Ozeroz Rose Video Box" loading="lazy">
        <div class="review-header">
            <div class="rating">${getReviewStars(rating)}</div>
            ${verified ? '<div class="verified-badge"><img src="/images/verified.svg" alt="Client Vérifié" title="Achat Vérifié"><span>Achat Vérifié</span></div>' : ''}
        </div>
        <div class="text">${text}</div>
        <div class="date">${formatDate(date)}</div>
    `;
    
    return card;
};