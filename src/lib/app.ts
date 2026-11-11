// ═══════════════════════════════════════════════════════════
//  Logique côté navigateur : Supabase, panier, favoris, rendu des cartes
// ═══════════════════════════════════════════════════════════
import { createClient, type User } from '@supabase/supabase-js';
import { videoBadge, setBase, setCurrency, currency, CURRENCIES, url, img, thumb, esc, aed, ICON, activityCard, carCard, carPrice, skeleton, CATEGORIES, CAR_CATEGORIES, type Activity, type Car } from './cards';
export { videoBadge, setCurrency, currency, CURRENCIES, url, img, thumb, esc, aed, ICON, activityCard, carCard, carPrice, skeleton, CATEGORIES, CAR_CATEGORIES };
export type { Activity, Car };

export const sb = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
export const WA = document.documentElement.dataset.wa || '971569736810';

// Chemin de base (permet d'héberger le site dans un sous-dossier)
setBase(document.documentElement.dataset.base ?? '/', document.documentElement.dataset.index === '1');

// ───────── Devise et langue choisies par le visiteur ─────────
const pref = (k: string) => { try { return localStorage.getItem('dl-' + k); } catch { return null; } };
const savePref = (k: string, v: string) => { try { localStorage.setItem('dl-' + k, v); } catch {} };
try {
  const rates = JSON.parse(pref('rates') || 'null');
  if (rates) Object.keys(CURRENCIES).forEach((c) => rates[c] && (CURRENCIES[c].rate = rates[c]));
} catch {}
setCurrency(pref('cur') || 'AED');
// Taux de change du jour (mis à jour au plus toutes les 12 h)
if (+(pref('rates-at') || 0) < Date.now() - 12 * 3600e3) {
  fetch('https://open.er-api.com/v6/latest/AED').then((r) => r.json()).then((d) => {
    if (d?.rates) { savePref('rates', JSON.stringify(d.rates)); savePref('rates-at', String(Date.now())); }
  }).catch(() => {});
}
export function chooseCurrency(code: string) { savePref('cur', code); location.reload(); }
export const LANGS: [string, string, string][] = [['fr', '🇫🇷', 'Français'], ['en', '🇬🇧', 'English'], ['ar', '🇦🇪', 'العربية'], ['ru', '🇷🇺', 'Русский']];
export const lang = () => pref('lang') || 'fr';
export function chooseLang(code: string) {
  savePref('lang', code);
  const host = location.hostname;
  const v = code === 'fr' ? '' : `/fr/${code}`;
  const exp = code === 'fr' ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '';
  for (const d of ['', `; domain=${host}`, `; domain=.${host}`]) document.cookie = `googtrans=${v}; path=/${d}${exp}`;
  location.reload();
}
// Traduction automatique si une autre langue que le français est choisie
// Mots à ne jamais traduire : le nom de l'entreprise et les devises (« AED » devient « défibrillateur » en arabe !)
const KEEP = /(Dubai Location|DUBAI LOCATION|Dubaï Location|\b(?:AED|EUR|USD|GBP)\b)/;
function protectWords(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (KEEP.test(n.nodeValue ?? '') && !(n.parentElement?.closest('.notranslate,script,style,textarea,input,select,option')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const nodes: Text[] = []; while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const t of nodes) {
    const parts = (t.nodeValue ?? '').split(new RegExp(KEEP.source, 'g'));
    const frag = document.createDocumentFragment();
    parts.forEach((p, i) => { if (!p) return; if (i % 2) { const sp = document.createElement('span'); sp.className = 'notranslate'; sp.setAttribute('translate', 'no'); sp.textContent = p; frag.append(sp); } else frag.append(p); });
    t.replaceWith(frag);
  }
}
if (lang() !== 'fr') {
  protectWords(document.body);
  // Nouveaux contenus (cartes, panier…) : on les protège par petits lots, sans gêner le défilement
  let pending = new Set<Node>(), queued = false;
  new MutationObserver((ms) => {
    ms.forEach((m) => m.addedNodes.forEach((n) => { const el = n.nodeType === 3 ? n.parentElement : (n as Element); if (el && !el.closest('.notranslate, font, #goog-gt-tt, .skiptranslate')) pending.add(el); }));
    if (!queued && pending.size) { queued = true; setTimeout(() => { const list = [...pending]; pending = new Set(); queued = false; list.forEach((el) => el.isConnected && protectWords(el)); }, 120); }
  }).observe(document.body, { childList: true, subtree: true });
  (window as any).gtInit = () => new (window as any).google.translate.TranslateElement({ pageLanguage: 'fr', autoDisplay: false }, 'gt-el');
  const el = document.createElement('div'); el.id = 'gt-el'; el.style.display = 'none'; document.body.append(el);
  const sc = document.createElement('script'); sc.src = 'https://translate.google.com/translate_a/element.js?cb=gtInit'; sc.async = true; document.head.append(sc);
}
export const waLink = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

// ───────── Session ─────────
// « Se souvenir de moi » décoché : déconnexion à la fermeture du navigateur
try { if (localStorage.getItem('dl-noremember') && !sessionStorage.getItem('dl-alive')) { localStorage.removeItem('dl-noremember'); sb.auth.signOut(); } } catch {}
let _user: User | null | undefined;
export async function getUser() {
  if (_user !== undefined) return _user;
  const { data } = await sb.auth.getSession();
  _user = data.session?.user ?? null;
  return _user;
}
sb.auth.onAuthStateChange((_e, s) => { _user = s?.user ?? null; });
export async function isAdmin() {
  const u = await getUser();
  if (!u) return false;
  const { data } = await sb.from('profiles').select('is_admin').eq('id', u.id).maybeSingle();
  return !!data?.is_admin;
}
export function goLogin() { location.href = url(`connexion/?next=${encodeURIComponent(location.pathname + location.search)}`); }

// ───────── Panier (stocké dans le navigateur) ─────────
export type CartItem = {
  key: string; type: 'activity' | 'car'; slug: string; title: string; image: string | null; option: string | null;
  date: string | null; endDate: string | null; qty: number; qtyLabel: string; unitPrice: number | null; priceUnit: string | null;
  time?: string | null; duration?: string | null; extras?: { name: string; price: number; qty: number }[];
  tagline?: string | null; rating?: number | null; reviews?: number | null; optIndex?: number | null;
};
/** Prix d'une ligne du panier (formule × quantité + options en plus) */
export const lineTotal = (i: CartItem) => (i.unitPrice ?? 0) * (i.type === 'car' ? nights(i) : i.qty) + (i.extras ?? []).reduce((s, e) => s + e.price * e.qty, 0);
const CART = 'dl-cart';
export const cart = {
  get(): CartItem[] { try { return JSON.parse(localStorage.getItem(CART) || '[]'); } catch { return []; } },
  set(items: CartItem[]) { try { localStorage.setItem(CART, JSON.stringify(items)); } catch {} window.dispatchEvent(new Event('cart:change')); },
  add(item: Omit<CartItem, 'key'>) { const key = Math.random().toString(36).slice(2) + Date.now().toString(36); this.set([...this.get(), { ...item, key }]); return key; },
  update(key: string, patch: Partial<CartItem>) { this.set(this.get().map((i) => (i.key === key ? { ...i, ...patch } : i))); },
  remove(key: string) { this.set(this.get().filter((i) => i.key !== key)); },
  setQty(key: string, qty: number) { this.set(this.get().map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(50, qty)) } : i))); },
  clear() { this.set([]); },
  total() { return this.get().reduce((s, i) => s + lineTotal(i), 0); },
};
export const nights = (i: Pick<CartItem, 'date' | 'endDate'>) => {
  if (!i.date || !i.endDate) return 1;
  return Math.max(1, Math.round((+new Date(i.endDate) - +new Date(i.date)) / 86400000));
};

// ───────── Favoris (compte requis) ─────────
let favSet: Set<string> | null = null;
export async function loadFavs() {
  const u = await getUser();
  if (!u) return (favSet = new Set());
  const { data } = await sb.from('favorites').select('item_type,item_slug');
  return (favSet = new Set((data ?? []).map((f) => `${f.item_type}:${f.item_slug}`)));
}
export async function toggleFav(type: 'activity' | 'car', slug: string) {
  const u = await getUser();
  if (!u) return goLogin();
  if (!favSet) favSet = new Set();
  const k = `${type}:${slug}`;
  const add = !favSet.has(k);
  if (add) favSet.add(k); else favSet.delete(k);
  paintFavs();                                   // le cœur change tout de suite
  const { error } = add
    ? await sb.from('favorites').insert({ user_id: u.id, item_type: type, item_slug: slug })
    : await sb.from('favorites').delete().match({ item_type: type, item_slug: slug });
  if (error && !/duplicate/i.test(error.message)) { if (add) favSet.delete(k); else favSet.add(k); paintFavs(); }
}
export function paintFavs(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-fav]').forEach((b) => {
    const on = !!favSet?.has(b.dataset.fav!);
    b.classList.toggle('is-fav', on);
    b.setAttribute('aria-pressed', String(on));
  });
}
// Délégation : un seul écouteur pour tous les cœurs
document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-fav]');
  if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const [t, s] = b.dataset.fav!.split(':');
  toggleFav(t as 'activity' | 'car', s);
});

// ───────── Cache local : affichage instantané, puis mise à jour en arrière-plan ─────────
const cacheGet = <T,>(k: string): T | null => { try { return JSON.parse(localStorage.getItem('dl-' + k) || 'null'); } catch { return null; } };
const cacheSet = (k: string, v: unknown) => { try { localStorage.setItem('dl-' + k, JSON.stringify(v)); } catch {} };
/** Affiche tout de suite la version en cache, puis la version fraîche si elle a changé */
export const seed = <T,>(k: string): T | null => { try { const el = document.getElementById('seed-' + k); return el ? JSON.parse(el.textContent || 'null') : null; } catch { return null; } };
export function live<T>(key: string, fetcher: () => Promise<T>, render: (d: T) => void) {
  let shown = seed<T>(key);               // déjà affiché dans le HTML de la page
  const cached = cacheGet<T>(key);
  if (!shown && !cached) render([] as unknown as T);
  if (cached && JSON.stringify(cached) !== JSON.stringify(shown)) { render(cached); shown = cached; }
  if (!shown) shown = cached;
  if (currency() !== 'AED' && shown) render(shown);
  return fetcher().then((fresh) => {
    if (!fresh || (Array.isArray(fresh) && !fresh.length && shown)) return shown as T; // réseau bloqué : on garde ce qui est affiché
    cacheSet(key, fresh);
    if (JSON.stringify(fresh) !== JSON.stringify(shown)) render(fresh);
    return fresh;
  });
}
export const cachedActivities = () => cacheGet<Activity[]>('acts') ?? seed<Activity[]>('acts') ?? [];
export const cachedCars = () => cacheGet<Car[]>('cars') ?? seed<Car[]>('cars') ?? [];
export const refreshCache = (k: 'acts' | 'cars', v: unknown) => cacheSet(k, v);

// ───────── Requêtes ─────────
export function warn(msg: string) {
  if (document.getElementById('net-warn')) return;
  const d = document.createElement('div');
  d.id = 'net-warn';
  d.className = 'fixed inset-x-3 bottom-24 z-[60] mx-auto max-w-lg rounded-xl bg-amber-50 p-4 text-sm text-amber-900 shadow-lift ring-1 ring-amber-200';
  d.innerHTML = msg + ' <button class="ml-2 font-semibold underline" onclick="this.parentNode.remove()">OK</button>';
  document.body.append(d);
}
const NET_MSG = 'Connexion au serveur impossible depuis ce navigateur (bloqueur de publicité, VPN ou réseau). Le catalogue reste consultable ; pour réserver ou vous connecter, désactivez le bloqueur ou essayez un autre navigateur.';
/** Requête avec délai maximum : au-delà, on considère le serveur injoignable */
async function timed<T>(q: PromiseLike<{ data: T | null; error: unknown }>, ms = 6000) {
  return Promise.race([
    Promise.resolve(q).catch((error) => ({ data: null, error })),
    new Promise<{ data: null; error: string }>((r) => setTimeout(() => r({ data: null, error: 'délai dépassé' }), ms)),
  ]);
}
export async function fetchActivities() {
  const { data, error } = await timed(sb.from('activities').select('*').eq('active', true).order('position'));
  if (error) { console.error(error); warn(NET_MSG); }
  return (data ?? []) as Activity[];
}
export async function fetchCars() {
  const { data, error } = await timed(sb.from('cars').select('*').eq('active', true).order('position'));
  if (error) { console.error(error); warn(NET_MSG); }
  return (data ?? []) as Car[];
}

// ───────── Statistiques de visites (anonymes, sans cookie) ─────────
export function logVisit() {
  try {
    if (location.pathname.includes('/admin') || /localhost|127\.0\.0\.1/.test(location.hostname) && !location.search.includes('stats')) return;
    const q = new URLSearchParams(location.search);
    const ref = document.referrer ? new URL(document.referrer).hostname : '';
    const src = q.get('utm_source') || ref;
    const SOURCES: [RegExp, string][] = [[/insta/i, 'Instagram'], [/tiktok/i, 'TikTok'], [/facebook|fb\./i, 'Facebook'], [/snap/i, 'Snapchat'], [/google/i, 'Google'], [/whatsapp|wa\.me/i, 'WhatsApp'], [/bing|yahoo|duckduckgo|qwant|ecosia/i, 'Autre moteur']];
    let source = SOURCES.find(([r]) => r.test(src))?.[1] ?? '';
    if (!source && ref && ref !== location.hostname) source = ref.replace(/^www\./, '');
    if (ref === location.hostname) source = 'Navigation interne';
    sb.rpc('log_visit', { p_path: location.pathname, p_slug: q.get('s'), p_source: source || 'Direct', p_tz: Intl.DateTimeFormat().resolvedOptions().timeZone }).then(() => {}, () => {});
  } catch {}
}

// ───────── En-tête : compteur panier + état connecté ─────────
export async function initHeader() {
  const paint = () => document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    const n = cart.get().length;
    el.textContent = String(n);
    el.classList.toggle('hidden', n === 0);
  });
  paint();
  window.addEventListener('cart:change', paint);
  window.addEventListener('storage', paint);
  const u = await getUser();
  document.querySelectorAll<HTMLAnchorElement>('[data-account-link]').forEach((a) => {
    a.href = url(u ? 'compte/' : 'connexion/');
    if (u) isAdmin().then((ad) => { if (ad) { a.href = url('admin/'); a.title = 'Espace admin'; } });
    a.title = u ? 'Mon compte' : 'Se connecter';
    a.classList.toggle('text-gold', !!u);
  });
  loadFavs().then(() => paintFavs());
}
