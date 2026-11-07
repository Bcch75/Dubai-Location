// ———————————————————————————————————————————
//  Informations de la conciergerie — modifiez ici, tout le site suit.
// ———————————————————————————————————————————
export const site = {
  name: 'Dubai Location',
  tagline: 'Conciergerie privée à Dubaï',
  phoneDisplay: '+971 56 973 6810',
  whatsapp: '971569736810', // format international, sans + ni espaces
  email: 'dubailocation19@gmail.com',
  city: 'Dubaï, Émirats arabes unis',
  instagram: '', // ex. 'https://instagram.com/dubailocation' — laissé vide = masqué
  hours: '7j/7 · 8h – 23h (heure de Dubaï)',
};

/** Lien WhatsApp avec message pré-rempli */
export const waLink = (message = `Bonjour ${site.name} 👋 J'aimerais avoir des informations.`) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
