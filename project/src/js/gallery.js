import { reviews } from './reviewData.js';
import { createReviewCard } from './components/ReviewCard.js';

export const initGallery = () => {
    const gallery = document.querySelector('.gallery');
    reviews.forEach(review => {
        gallery.appendChild(createReviewCard(review));
    });
};