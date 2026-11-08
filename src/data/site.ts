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
  heroTitle: 'Trouvez et réservez des activités',
  searchPlaceholder: 'Destination ou une activité...',
  heroImage: '', // vide = photo par défaut du site
};

// Les réglages modifiés dans l'espace admin (⚙️ Réglages du site) remplacent les valeurs ci-dessus
try {
  const r = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/rest/v1/settings?id=eq.1&select=data`, {
    headers: { apikey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.PUBLIC_SUPABASE_ANON_KEY}` },
  });
  const d = r.ok ? (await r.json())[0]?.data : null;
  if (d) {
    if (d.whatsapp) site.whatsapp = String(d.whatsapp).replace(/\D/g, '');
    if (d.phone) site.phoneDisplay = d.phone;
    if (d.email) site.email = d.email;
    if (d.hours) site.hours = d.hours;
    if (d.hero_title) site.heroTitle = d.hero_title;
    if (d.search_placeholder) site.searchPlaceholder = d.search_placeholder;
    if (d.hero_image) site.heroImage = d.hero_image;
  }
} catch { /* hors ligne : valeurs par défaut */ }

// ───────── Réseaux sociaux ─────────
// Remplissez le lien (url) et le nombre d'abonnés (count, ex. '12K').
// Un réseau sans lien n'est pas affiché.
export const socials: { key: string; label: string; url: string; count: string }[] = [
  { key: 'google', label: 'Avis Google', url: '', count: '' },     // count = note, ex. '4.9'
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/location.dubai', count: '' },
  { key: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@dubai.location8', count: '' },
  { key: 'snapchat', label: 'Snapchat', url: '', count: '' },
  { key: 'facebook', label: 'Facebook', url: '', count: '' },
];

/** Lien WhatsApp avec message pré-rempli */
export const waLink = (message = `Bonjour ${site.name} 👋 J'aimerais avoir des informations.`) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
