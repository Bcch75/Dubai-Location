// Icônes des conditions de location (voitures)
export const COND_ICONS: Record<string, [string, string]> = {
  age: ['Âge', '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'],
  id: ['Permis', '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.5"/><path d="M14 10h4M14 14h3"/>'],
  card: ['Caution', '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>'],
  road: ['Kilométrage', '<path d="M5 21 9 3M19 21 15 3M12 6v2M12 11v2M12 16v2"/>'],
  shield: ['Assurance', '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>'],
  fuel: ['Carburant', '<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M7 8h5M15 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-3-3"/>'],
  pin: ['Livraison', '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'],
  fine: ['Amendes', '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>'],
  clock: ['Horaires', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  doc: ['Documents', '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>'],
};
export const condIcon = (k: string, cls = 'h-6 w-6') => `<svg viewBox="0 0 24 24" class="${cls} shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${(COND_ICONS[k] ?? COND_ICONS.doc)[1]}</svg>`;

/** Conditions par défaut (modifiables dans Admin → Apparence) */
export const rentalConditions = [
  { icon: 'age', title: 'Âge minimum', text: '21 ans, et 25 ans pour certaines supercars.' },
  { icon: 'id', title: 'Permis de conduire', text: 'Permis valide depuis plus d’un an. Un permis international peut être demandé selon votre pays.' },
  { icon: 'card', title: 'Caution', text: 'Une caution est demandée à la remise du véhicule, puis restituée après le retour.' },
  { icon: 'pin', title: 'Livraison', text: 'À votre hôtel, à votre villa ou à l’aéroport, partout à Dubaï.' },
];
