// ═══════════════════════════════════════════════════════════
//  Rendu des cartes : utilisable au build (HTML statique) ET dans le navigateur
// ═══════════════════════════════════════════════════════════
export type Activity = {
  id: number; slug: string; title: string; categories: string[]; tagline: string | null; description: string | null;
  image_url: string | null; image_alt: string | null; price: number; price_from: boolean; price_unit: string | null;
  duration: string | null; location: string | null; highlights: string[]; options: { name: string; detail?: string | null; price?: number | null }[];
  badge: string | null; featured: boolean; position: number; active: boolean; old_price: number | null; perk: string | null;
  gallery: string[]; included: string[]; excluded: string[]; important: string | null; qty_label: string;
};
export type Car = {
  id: number; slug: string; brand: string; model: string; category: string; image_url: string | null; seats: number | null;
  engine: string | null; price_per_day: number | null; tag: string | null; available: boolean; position: number; active: boolean;
  perk: string | null; old_price: number | null; description: string | null;
};

export const CATEGORIES: Record<string, string> = {
  desert: 'Désert', mer: 'Mer & yacht', ciel: 'Dans les airs', incontournables: 'Incontournables', excursions: 'Excursions', famille: 'En famille',
};
export const CAR_CATEGORIES: Record<string, string> = { supercar: 'Supercars', prestige: 'Prestige', suv: 'SUV de luxe', sport: 'Sportives & berlines' };


let BASE = '/';
let IDX = false;
export function setBase(base: string, index = false) { BASE = base.replace(/\/?$/, '/'); IDX = index; }
export const url = (p: string) => { const s = BASE + p.replace(/^\//, ''); return IDX ? s.replace(/([a-z-]+)\/(?=[?#]|$)/, '$1/index.html') : s; };
export const img = (u?: string | null) => (!u ? '' : /^https?:/.test(u) ? u : url(u));
/** Version légère (640 px) pour les vignettes */
export const thumb = (u?: string | null) => (u && u.startsWith('/img/') && !u.startsWith('/img/thumb/') ? img(u.replace('/img/', '/img/thumb/')) : img(u));
export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export const aed = (n: number | null | undefined) => (n == null ? '' : `${n.toLocaleString('fr-FR')} AED`);
// ───────── Rendu HTML des cartes ─────────
const ICON = {
  heart: '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path class="fav-fill" d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  gift: '<svg viewBox="0 0 24 24" class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>',
  users: '<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/></svg>',
};
export { ICON };

const priceBlock = (price: string, old?: number | null, from = true) => `
  <div class="text-right leading-tight">
    ${from ? '<span class="block text-[11px] font-medium leading-[1.5] text-gray-400">à partir de</span>' : ''}
    ${old ? `<span class="mr-1 text-xs text-muted line-through">${esc(old.toLocaleString('fr-FR'))}</span><span class="text-lg font-bold leading-7 text-red-500">${esc(price)}</span>` : `<span class="text-lg font-bold leading-7 text-ink">${esc(price)}</span>`}
  </div>`;

export function activityCard(a: Activity, cls = '') {
  return `
  <article class="card group relative flex flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_4px_20px_0_rgb(0_0_0/0.08)] transition-shadow duration-300 hover:shadow-[0_10px_30px_0_rgb(0_0_0/0.14)] ${cls}" data-cats="${esc(a.categories.join(' '))}" data-search="${esc((a.title + ' ' + (a.tagline ?? '') + ' ' + (a.location ?? '') + ' ' + a.categories.join(' ')).toLowerCase())}">
    <div class="relative h-[176px] overflow-hidden bg-sand">
      <img src="${esc(thumb(a.image_url))}" alt="${esc(a.image_alt ?? a.title)}" loading="lazy" decoding="async" width="640" height="420" class="h-full w-full object-cover transition duration-700 group-hover:scale-105">
      ${a.badge ? `<span class="absolute left-3 top-3 rounded-full bg-sky-400/90 px-3 py-1.5 text-xs font-semibold leading-4 tracking-[0.3px] text-white shadow-lg">${esc(a.badge)}</span>` : ''}
      <button type="button" data-fav="activity:${esc(a.slug)}" aria-label="Ajouter aux favoris" class="fav-btn absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-ink shadow transition hover:scale-110">${ICON.heart}</button>
      ${a.duration ? `<span class="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium leading-4 text-white">${ICON.clock}${esc(a.duration)}</span>` : ''}
    </div>
    <div class="flex flex-1 flex-col px-4 pb-4 pt-4">
      <h3 class="mb-2 line-clamp-2 text-[17px] font-semibold leading-[1.375] text-ink"><a href="${url('activite/?s=' + encodeURIComponent(a.slug))}" class="after:absolute after:inset-0">${esc(a.title)}</a></h3>
      <p class="mb-3 line-clamp-2 text-sm leading-[1.625] text-gray-500">${esc(a.tagline)}</p>
      ${a.perk ? `<p class="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold leading-tight text-emerald-700">${ICON.gift}${esc(a.perk)}</p>` : ''}
      <div class="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
        <span class="flex items-center gap-1 text-xs text-gray-400">📍 ${esc(a.location ?? '')}</span>
        ${priceBlock(aed(a.price), a.old_price, a.price_from)}
      </div>
    </div>
  </article>`;
}

export const carPrice = (c: Car) => (c.price_per_day ? `${aed(c.price_per_day)}` : 'Sur demande');
export function carCard(c: Car, cls = '') {
  return `
  <article class="card group relative flex flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_4px_20px_0_rgb(0_0_0/0.08)] transition-shadow duration-300 hover:shadow-[0_10px_30px_0_rgb(0_0_0/0.14)] ${cls}" data-cats="${esc(c.category)}" data-search="${esc((c.brand + ' ' + c.model + ' ' + c.category).toLowerCase())}">
    <div class="relative h-[176px] overflow-hidden bg-sand">
      <img src="${esc(thumb(c.image_url))}" alt="${esc(c.brand + ' ' + c.model)}" loading="lazy" decoding="async" width="640" height="420" class="h-full w-full object-cover transition duration-700 group-hover:scale-105">
      <span class="absolute left-3 top-3 rounded-full bg-sky-400/90 px-3 py-1.5 text-xs font-semibold leading-4 tracking-[0.3px] text-white shadow-lg">${esc(c.tag ?? CAR_CATEGORIES[c.category] ?? '')}</span>
      <button type="button" data-fav="car:${esc(c.slug)}" aria-label="Ajouter aux favoris" class="fav-btn absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-ink shadow transition hover:scale-110">${ICON.heart}</button>
    </div>
    <div class="flex flex-1 flex-col px-4 pb-4 pt-4">
      <p class="text-xs font-medium text-gray-400">${esc(c.brand)}</p>
      <h3 class="mb-2 text-[17px] font-semibold leading-[1.375] text-ink"><a href="${url('voiture/?s=' + encodeURIComponent(c.slug))}" class="after:absolute after:inset-0">${esc(c.model)}</a></h3>
      <p class="mt-1.5 flex flex-wrap gap-x-3 text-xs text-muted"><span class="flex items-center gap-1">${ICON.users}${c.seats ?? '-'} places</span><span>${esc(c.engine ?? '')}</span><span>Boîte auto</span></p>
      ${c.perk ? `<p class="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold leading-tight text-emerald-700">${ICON.gift}${esc(c.perk)}</p>` : ''}
      <div class="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
        <span class="text-xs text-muted">par jour</span>
        ${priceBlock(carPrice(c), c.old_price, !!c.price_per_day)}
      </div>
    </div>
  </article>`;
}

export const skeleton = (n = 4, cls = '') =>
  Array.from({ length: n }, () => `<div class="${cls} animate-pulse overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_-2px_rgb(17_24_39/0.12)]"><div class="aspect-[16/10] bg-sand"></div><div class="space-y-2 p-4"><div class="h-4 w-2/3 rounded bg-sand"></div><div class="h-3 w-full rounded bg-sand"></div><div class="h-3 w-1/2 rounded bg-sand"></div></div></div>`).join('');

