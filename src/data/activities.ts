import type { ImageMetadata } from 'astro';
import abuDhabi from '../assets/img/abu-dhabi.jpg';
import yacht from '../assets/img/yacht.jpg';
import desert from '../assets/img/desert.jpg';
import diner from '../assets/img/diner.jpg';
import aquatique from '../assets/img/aquatique.jpg';
import oman from '../assets/img/oman.jpg';
import montgolfiere from '../assets/img/montgolfiere.jpg';
import burjKhalifa from '../assets/img/burj-khalifa.jpg';
import refuge from '../assets/img/refuge.jpg';
import dolphin from '../assets/img/dolphin.jpg';
import attraction from '../assets/img/attraction.jpg';
import ski from '../assets/img/ski.jpg';

export type CategoryId = 'desert' | 'mer' | 'ciel' | 'incontournables' | 'excursions' | 'famille';

export const categories: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'desert', label: 'Désert', icon: '🏜️' },
  { id: 'mer', label: 'Mer & yacht', icon: '🛥️' },
  { id: 'ciel', label: 'Dans les airs', icon: '🎈' },
  { id: 'incontournables', label: 'Incontournables', icon: '🏙️' },
  { id: 'excursions', label: 'Excursions', icon: '🧭' },
  { id: 'famille', label: 'En famille', icon: '👨‍👩‍👧' },
];

export interface Option { name: string; detail?: string; price?: string }

export interface Activity {
  slug: string;
  title: string;
  categories: CategoryId[];
  tagline: string;
  description: string[];
  image: ImageMetadata;
  imageAlt: string;
  price: number; // en AED
  priceFrom: boolean;
  priceUnit?: string; // ex. « / heure », « / pers. »
  duration: string;
  location: string;
  highlights: string[];
  options?: Option[];
  badge?: string;
  featured?: boolean;
}

export const activities: Activity[] = [
  {
    slug: 'safari-desert-quad-buggy',
    title: 'Désert en quad, moto ou buggy',
    categories: ['desert'],
    tagline: "100 % adrénaline sur les dunes dorées de Dubaï, au guidon de machines puissantes.",
    description: [
      "Le désert de Dubaï, c'est un terrain de jeu immense. Choisissez votre monture parmi notre sélection de machines puissantes, puis lancez-vous sur les dunes, toujours encadré par des guides expérimentés.",
      "Pour une immersion complète, ajoutez une balade en 4x4 dans les dunes, une promenade à dos de chameau ou le transfert depuis votre hôtel. On s'occupe de tout, vous n'avez qu'à profiter.",
    ],
    image: desert,
    imageAlt: 'Dunes de sable doré dans le désert de Dubaï',
    price: 150,
    priceFrom: true,
    duration: '1 h et plus',
    location: 'Désert de Dubaï',
    highlights: ['Équipement de sécurité fourni', 'Guides professionnels', 'Débutants bienvenus', 'Transfert hôtel en option'],
    options: [
      { name: 'Quad Yamaha 700 Raptor', detail: 'Le plus puissant, pour les amateurs de sensations' },
      { name: 'Quad CF Moto 450', detail: 'Idéal pour une première fois' },
      { name: 'Moto KTM 450', detail: 'Pour les pilotes confirmés' },
      { name: 'Buggy Polaris 1000cc', detail: 'À deux, en toute sécurité' },
      { name: 'Can-Am Maverick X3', detail: "Le haut de gamme du buggy" },
      { name: 'Options', detail: 'Balade en 4x4, chameau, transfert hôtel ↔ désert' },
    ],
    badge: 'Best-seller',
    featured: true,
  },
  {
    slug: 'balade-en-yacht',
    title: 'Yacht privatisé',
    categories: ['mer'],
    tagline: 'Naviguez entre la Marina, Palm Jumeirah et le Burj Al Arab, à bord de votre propre yacht.',
    description: [
      "Offrez-vous un moment d'exception à bord d'un yacht privatisé, rien que pour vous et vos proches. Cap sur la Marina, la Palm Jumeirah ou le pied du Burj Al Arab, avec un équipage aux petits soins.",
      "Pour en faire un moment inoubliable, ajoutez un barbecue à bord ou faites livrer un jet-ski directement au yacht. C'est la formule idéale pour un anniversaire, une demande en mariage, un groupe d'amis ou un événement privé.",
    ],
    image: yacht,
    imageAlt: 'Yacht de luxe blanc naviguant sur une mer turquoise',
    price: 600,
    priceFrom: true,
    priceUnit: '/ heure',
    duration: "À partir d'1 h",
    location: 'Dubai Marina',
    highlights: ['Yacht 100 % privatisé', 'Équipage professionnel', 'Vue Palm & Burj Al Arab', 'Idéal événements'],
    options: [
      { name: 'Yacht privatisé', price: '600 AED / heure' },
      { name: 'Barbecue à bord', price: '80 AED / pers.' },
      { name: 'Jet-ski 2 places livré au yacht', price: '580 AED / heure' },
    ],
    badge: 'Coup de cœur',
    featured: true,
  },
  {
    slug: 'montgolfiere-helicoptere',
    title: 'Montgolfière ou hélicoptère',
    categories: ['ciel'],
    tagline: 'Dubaï vue du ciel : les dunes au lever du soleil, ou le skyline en hélicoptère.',
    description: [
      "Deux façons spectaculaires de vivre Dubaï depuis les airs. Au lever du soleil, la montgolfière glisse en silence au-dessus des dunes dorées : un moment magique et paisible, transfert inclus.",
      "Envie d'intensité ? Le survol en hélicoptère, de 12 ou 17 minutes, vous offre les plus grands symboles de la ville : Burj Khalifa, Palm Jumeirah, Atlantis, les plages et le skyline. C'est idéal pour une surprise romantique ou un souvenir hors du commun.",
    ],
    image: montgolfiere,
    imageAlt: 'Montgolfières colorées dans un ciel bleu',
    price: 699,
    priceFrom: true,
    duration: '12 min à 1 h',
    location: 'Dubaï',
    highlights: ['Lever de soleil sur le désert', 'Transfert inclus (montgolfière)', 'Vols 12 ou 17 min', 'Sécurité certifiée'],
    options: [
      { name: 'Montgolfière au lever du soleil', detail: 'Survol des dunes, transfert inclus' },
      { name: 'Hélicoptère 12 minutes', detail: 'Palm Jumeirah, Atlantis, Burj Al Arab' },
      { name: 'Hélicoptère 17 minutes', detail: 'Le tour complet, avec le Burj Khalifa' },
    ],
    badge: 'Inoubliable',
    featured: true,
  },
  {
    slug: 'diner-bedouin',
    title: 'Dîner bédouin privatisé',
    categories: ['desert'],
    tagline: "Une soirée authentique au cœur du désert, avec quad inclus.",
    description: [
      "Vivez un dîner bédouin privatisé dans un cadre exceptionnel, au cœur du désert. Vous découvrirez un village ensablé, puis partagerez un repas traditionnel sous les étoiles, sans regarder l'heure.",
      "Une heure de quad est incluse pour profiter des dunes avant le dîner. Vous rêvez d'une demande en mariage ou d'un événement spécial ? Nous l'organisons pour vous, sur mesure.",
    ],
    image: diner,
    imageAlt: 'Dunes orangées du désert au coucher du soleil',
    price: 300,
    priceFrom: false,
    priceUnit: '/ pers.',
    duration: 'En soirée',
    location: 'Désert de Dubaï',
    highlights: ['Dîner privatisé', '1 h de quad incluse', 'Village ensablé', 'Demande en mariage possible'],
    featured: true,
  },
  {
    slug: 'activites-nautiques',
    title: 'Jet-ski, flyboard & plongée',
    categories: ['mer'],
    tagline: 'Jet-ski face au skyline, jet car, flyboard, plongée : choisissez vos sensations.',
    description: [
      "Profitez d'un large choix d'activités nautiques pour vivre des sensations fortes en pleine mer. Pilotez un jet-ski face aux plus beaux panoramas de la ville, testez le jet car ou décollez au-dessus de l'eau en flyboard.",
      "Vous préférez le calme ? Explorez les fonds marins en plongée sous-marine, ou partagez un moment fun en bouée tractée. Toutes les activités sont accessibles et encadrées par des professionnels.",
    ],
    image: aquatique,
    imageAlt: 'Plongeur sous-marin entouré de poissons',
    price: 350,
    priceFrom: true,
    duration: 'À partir de 30 min',
    location: 'Dubai International Marine Club',
    highlights: ['Encadrement professionnel', 'Accessible à tous', 'Vue sur le skyline', 'Plusieurs activités combinables'],
    options: [
      { name: 'Jet-ski' },
      { name: 'Jet car' },
      { name: 'Flyboard' },
      { name: 'Plongée sous-marine' },
      { name: 'Bouée tractée' },
    ],
    featured: true,
  },
  {
    slug: 'excursion-oman',
    title: 'Croisière à Oman (Musandam)',
    categories: ['excursions', 'mer'],
    tagline: 'Les fjords turquoise d’Oman : baignade, snorkeling, repas, et le visa est inclus.',
    description: [
      "Partez pour une journée inoubliable à Oman, avec le transfert depuis votre hôtel inclus. Vous profiterez d'une croisière de 5 heures entre eaux turquoise et montagnes : baignade, snorkeling, pêche et activités fun comme le bateau banane.",
      "Le repas est servi à bord, et le visa touristique omanais est inclus pour une excursion sans aucune contrainte. C'est parfait en famille ou entre amis.",
    ],
    image: oman,
    imageAlt: 'Baie aux eaux turquoise entourée de falaises',
    price: 350,
    priceFrom: true,
    priceUnit: '/ pers.',
    duration: 'Journée (croisière 5 h)',
    location: 'Musandam, Oman',
    highlights: ['Transfert hôtel inclus', 'Visa omanais inclus', 'Repas à bord', 'Snorkeling & baignade'],
  },
  {
    slug: 'abu-dhabi-tour',
    title: 'Journée à Abu Dhabi',
    categories: ['excursions', 'incontournables'],
    tagline: 'La Grande Mosquée Sheikh Zayed, Yas Island et la Corniche, avec chauffeur privé.',
    description: [
      "Découvrez la capitale des Émirats en une journée exceptionnelle. Au programme : la majestueuse Grande Mosquée Sheikh Zayed, Yas Island, le front de mer de la Corniche, et bien plus encore.",
      "Un chauffeur professionnel vous accompagne tout au long d'un parcours confortable, pour découvrir une ville qui marie la tradition et le luxe moderne.",
    ],
    image: abuDhabi,
    imageAlt: 'Grande Mosquée Sheikh Zayed illuminée au crépuscule',
    price: 600,
    priceFrom: false,
    duration: 'Journée complète',
    location: 'Abu Dhabi',
    highlights: ['Chauffeur privé', 'Grande Mosquée Sheikh Zayed', 'Yas Island', 'Prise en charge à votre hôtel'],
  },
  {
    slug: 'burj-khalifa-aquarium',
    title: 'Burj Khalifa + Dubai Aquarium',
    categories: ['incontournables', 'famille'],
    tagline: 'Entre ciel et océan : la plus haute tour du monde et son aquarium géant.',
    description: [
      "Une double expérience pour découvrir deux symboles de Dubaï en une seule sortie. Montez au Burj Khalifa, la plus haute tour du monde, et admirez la ville depuis une vue panoramique à couper le souffle.",
      "Plongez ensuite dans l'univers fascinant du Dubai Aquarium, peuplé de requins, de raies et de milliers d'espèces marines. Le tarif est le même pour les enfants et les adultes, et l'entrée est gratuite pour les moins de 3 ans.",
    ],
    image: burjKhalifa,
    imageAlt: 'Le Burj Khalifa entouré de palmiers sous un ciel bleu',
    price: 312,
    priceFrom: false,
    priceUnit: '/ pers.',
    duration: 'Environ 2 h',
    location: 'Downtown Dubai',
    highlights: ['Billets coupe-file', 'Gratuit moins de 3 ans', 'Vue panoramique', 'Requins & raies'],
  },
  {
    slug: 'dolphinarium',
    title: 'Dolphinarium de Dubaï',
    categories: ['famille'],
    tagline: 'Un moment magique au plus près des dauphins, pour petits et grands.',
    description: [
      "Offrez-vous une rencontre inoubliable avec les dauphins au Dolphinarium de Dubaï. Assistez à leurs démonstrations impressionnantes, ou vivez un moment privilégié à leurs côtés, dans un cadre sécurisé et encadré par des professionnels.",
      "Sensations, émotions et souvenirs garantis : c'est l'activité idéale en famille, en couple ou entre amis.",
    ],
    image: dolphin,
    imageAlt: 'Dauphins nageant dans une eau bleue',
    price: 760,
    priceFrom: false,
    duration: 'Selon formule',
    location: 'Creek Park, Dubaï',
    highlights: ['Rencontre avec les dauphins', 'Encadrement professionnel', 'Idéal en famille', 'Souvenirs garantis'],
  },
  {
    slug: 'ski-dubai',
    title: 'Ski Dubai',
    categories: ['famille', 'incontournables'],
    tagline: 'La neige en plein désert : ski, tyrolienne, manèges et rencontre avec les pingouins.',
    description: [
      "Plongez dans un univers 100 % enneigé en plein désert, avec l'une des attractions les plus insolites de la ville. Snow Park, manèges, tyrolienne, cours de ski et rencontre avec les pingouins : tout dépend de la formule choisie.",
      "C'est l'activité parfaite pour vivre l'hiver au cœur de Dubaï, en famille, entre amis ou en couple.",
    ],
    image: ski,
    imageAlt: 'Skieur en plein saut sur fond de ciel bleu',
    price: 220,
    priceFrom: true,
    priceUnit: '/ pers.',
    duration: 'À partir d’1 h',
    location: 'Mall of the Emirates',
    highlights: ['Équipement fourni', 'Pingouins (Premium)', 'Cours de ski (Plus)', 'Accès toute la journée'],
    options: [
      { name: 'Snow Classique', detail: 'Pour découvrir la neige et les attractions' },
      { name: 'Snow Plus', detail: 'Remontées illimitées, cours de ski et tyrolienne' },
      { name: 'Snow Premium', detail: 'Expérience complète : pingouins, photo souvenir, accès total' },
    ],
  },
  {
    slug: 'refuge-animalier',
    title: 'Refuge animalier',
    categories: ['famille'],
    tagline: 'Rencontrez des animaux sauvés, dans un refuge unique dédié à leur protection.',
    description: [
      "Vivez une expérience émouvante et éducative dans un refuge animalier de Dubaï, dédié à la protection et au bien-être des animaux. Vous observerez de près différentes espèces, dans un environnement respectueux et sécurisé.",
      "La visite est accessible aux adultes comme aux enfants, et gratuite pour les moins de 2 ans. Des sessions sont proposées le matin ou l'après-midi, avec les transferts aller-retour en option.",
    ],
    image: refuge,
    imageAlt: 'Un lion marchant dans l’herbe',
    price: 500,
    priceFrom: true,
    duration: 'Matin ou après-midi',
    location: 'Dubaï',
    highlights: ['Gratuit moins de 2 ans', 'Sessions matin / après-midi', 'Transferts en option', 'Expérience éducative'],
  },
  {
    slug: 'attractions',
    title: 'Parcs & attractions',
    categories: ['famille', 'incontournables'],
    tagline: 'IMG Worlds, Ferrari World, Global Village, Museum of the Future… vos billets au meilleur prix.',
    description: [
      "Découvrez les attractions les plus célèbres de Dubaï, avec des expériences pour tous les goûts. Plongez dans l'univers du cinéma et des super-héros à IMG Worlds of Adventure, le plus grand parc indoor au monde, ou vibrez au rythme de la vitesse à Ferrari World.",
      "Explorez les cultures du monde à Global Village, puis laissez-vous surprendre par l'architecture futuriste du Museum of the Future. Dites-nous lesquelles vous tentent, et on s'occupe des billets.",
    ],
    image: attraction,
    imageAlt: 'Manège coloré dans un parc d’attractions',
    price: 30,
    priceFrom: true,
    priceUnit: '/ pers.',
    duration: 'Selon attraction',
    location: 'Dubaï & Abu Dhabi',
    highlights: ['Billets au meilleur prix', 'Toutes les grandes attractions', 'Conseils personnalisés', 'Combinaisons possibles'],
    options: [
      { name: 'IMG Worlds of Adventure', detail: 'Le plus grand parc indoor au monde' },
      { name: 'Ferrari World', detail: 'Montagnes russes record (Abu Dhabi)' },
      { name: 'Global Village', detail: 'Pavillons du monde, spectacles, street-food' },
      { name: 'Museum of the Future', detail: 'Le musée le plus futuriste de la ville' },
    ],
  },
];

export const formatPrice = (a: Activity) =>
  `${a.priceFrom ? 'Dès ' : ''}${a.price.toLocaleString('fr-FR')} AED${a.priceUnit ? ' ' + a.priceUnit : ''}`;
