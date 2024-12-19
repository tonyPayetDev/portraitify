export const reviews = [
    {
        id: 1,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/59224081633712408163371.jpg?v=1734249634",
        rating: 5,
        text: "J'ai acheté la Ozeroz Rose Video Box en juin. À leur arrivée, la qualité était incroyable ! La fonction vidéo personnelle ajoute une touche unique et sincère.",
        date: "16/06/2023",
        verified: true
    },
    {
        id: 2,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/43669971633716997163371.jpg?v=1734249633",
        rating: 4,
        text: "Je les ai adorées, la couleur était superbe. La qualité était au rendez-vous !",
        date: "08/05/2024",
        verified: true
    },
    {
        id: 3,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/00671071992717107199271_1.jpg?v=1734249630",
        rating: 5,
        text: "L'acheter comme cadeau est un choix intelligent. C'est unique et impressionnera certainement la personne qui le reçoit.",
        date: "19/03/2024",
        verified: true
    },
    {
        id: 4,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/04815043792711504379271_1.jpg?v=1734249629",
        rating: 5,
        text: "Ma mère est décédée en 2010 et je pense à elle. J'ai acheté ces roses pour les mettre à côté de ses photos. Elles sont magnifiques et le conteneur noir s'accorde parfaitement avec ma table d'appoint. J'ai gardé la carte pour la décoration.",
        date: "08/03/2024",
        verified: true
    },
    {
        id: 5,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/67447781992714778199271.jpg?v=1734249630",
        rating: 5,
        text: "Livraison dans les délais et en parfait état. Vraiment impressionnée !",
        date: "10/19/2023",
        verified: true
    },
    {
        id: 6,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/84529381992712938199271.jpg?v=1734249629",
        rating: 5,
        text: "J'ai acheté la Ozeroz Rose Video Box pour ma fiancée et je suis ravi de tout ! Les roses sont magnifiques et le message vidéo ajoute une touche personnelle. C'était le cadeau parfait pour exprimer mon amour. Je le recommande à tous ceux qui veulent impressionner leurs proches !",
        date: "01/03/2024",
        verified: true
    },
    {
        id: 7,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/67447781992714778199271_1.jpg?v=1734249629",
        rating: 5,
        text: "Les roses sont magnifiques et la boîte vidéo est parfaite ! Les roses durent plus longtemps qu'un bouquet classique, ce qui en fait un cadeau encore plus attentionné. La présentation est superbe et le message personnalisé crée une impression durable. Je recommande vivement !",
        date: "04/03/2024",
        verified: true
    },
    {
        id: 8,
        image: "https://cdn.shopify.com/s/files/1/0811/6283/0168/files/04815043792711504379271_1.jpg?v=1734249629",
        rating: 5,
        text: "Excellent produit. La boîte vidéo est superbe et les roses sont magnifiques. C'était le cadeau ultime, parfait pour exprimer un moment spécial.",
        date: "12/04/2023",
        verified: true
    }
];

export const getReviewStars = (rating) => '❤️'.repeat(rating);