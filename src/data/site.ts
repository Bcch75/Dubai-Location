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
  hours: '7j/7 · 8h – 23h (heure de Dubaï)',
  // Statistiques de visites : identifiant Google Analytics (ex. 'G-XXXXXXX'), vide = désactivé.
  // Les statistiques Vercel fonctionnent sans identifiant (à activer dans Vercel → Analytics).
  googleAnalyticsId: '',
};

// ───────── Réseaux sociaux ─────────
// Remplissez le lien (url) et le nombre d'abonnés (count, ex. '12K').
// Un réseau sans lien n'est pas affiché.
export const socials: { key: string; label: string; url: string; count: string }[] = [
  { key: 'google', label: 'Avis Google', url: '', count: '' },     // count = note, ex. '4.9'
  { key: 'instagram', label: 'Instagram', url: '', count: '' },
  { key: 'tiktok', label: 'TikTok', url: '', count: '' },
  { key: 'snapchat', label: 'Snapchat', url: '', count: '' },
  { key: 'facebook', label: 'Facebook', url: '', count: '' },
];

/** Lien WhatsApp avec message pré-rempli */
export const waLink = (message = `Bonjour ${site.name} 👋 J'aimerais avoir des informations.`) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
