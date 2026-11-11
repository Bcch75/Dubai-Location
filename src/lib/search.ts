// ═══════════════════════════════════════════════════════════
//  Recherche d'activités : suggestions dès la première lettre
// ═══════════════════════════════════════════════════════════
import { esc, aed, thumb, url, CATEGORIES, type Activity } from './cards';

/** minuscules, sans accents, sans tirets ni espaces superflus : « Jet-ski » → « jet ski » */
export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const compact = (s: string) => norm(s).replace(/ /g, '');

const haystack = (a: Activity) => [a.title, a.tagline, a.location, a.description, ...(a.categories ?? []).map((c) => CATEGORIES[c] ?? c), ...(a.options ?? []).map((o) => `${o.name} ${o.group ?? ''}`), ...(a.highlights ?? [])].filter(Boolean).join(' ');

/** Score de pertinence (0 = ne correspond pas) */
export function score(a: Activity, q: string) {
  const words = norm(q).split(' ').filter(Boolean);
  if (!words.length) return 1;
  const title = norm(a.title), all = norm(haystack(a)), allC = compact(haystack(a)), titleC = compact(a.title);
  let s = 0;
  for (const w of words) {
    if (title.split(' ').some((t) => t.startsWith(w))) s += 6;
    else if (w.length < 2) return 0;               // 1 lettre : seulement les noms qui commencent par cette lettre
    else if (w.length >= 3 && titleC.includes(w)) s += 4;
    else if (all.split(' ').some((t) => t.startsWith(w))) s += 2;
    else if (w.length >= 4 && allC.includes(w)) s += 1;
    else return 0;
  }
  return s + (a.featured ? 0.5 : 0);
}
export const searchActivities = (list: Activity[], q: string) =>
  list.map((a) => [a, score(a, q)] as const).filter(([, s]) => s > 0).sort((x, y) => y[1] - x[1]).map(([a]) => a);

/** Liste de suggestions sous une barre de recherche */
export function attachSuggest(input: HTMLInputElement, getList: () => Activity[]) {
  const form = input.form!;
  const box = document.createElement('div');
  box.className = 'absolute inset-x-0 top-[calc(100%+8px)] z-40 hidden overflow-hidden rounded-3xl bg-white text-left shadow-[0_20px_50px_-12px_rgb(0_0_0/0.35)] ring-1 ring-gray-100';
  form.style.position = 'relative';
  form.append(box);
  const mark = (t: string, q: string) => {
    const w = norm(q).split(' ')[0]; if (!w) return esc(t);
    const base = t.normalize('NFC').split('').map((c) => c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()[0] ?? c).join('');
    const i = base.indexOf(w);
    return i >= 0 ? esc(t.slice(0, i)) + '<b class="text-[#0171eb]">' + esc(t.slice(i, i + w.length)) + '</b>' + esc(t.slice(i + w.length)) : esc(t);
  };
  const row = (a: Activity, q: string) => `<a href="${url('activite/?s=' + encodeURIComponent(a.slug))}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
      <img src="${esc(thumb(a.image_url))}" alt="" class="h-11 w-11 shrink-0 rounded-xl object-cover">
      <span class="min-w-0 flex-1"><span class="block truncate text-[14px] font-semibold text-[#0f1b2d]">${mark(a.title, q)}</span><span class="block truncate text-[12px] text-gray-500">${esc(a.tagline ?? a.location ?? '')}</span></span>
      <span class="shrink-0 text-right text-[11px] leading-tight text-gray-400">dès<br><b class="text-[13px] text-[#0f1b2d]">${esc(aed(a.price))}</b></span></a>`;
  let sel = -1;
  const render = () => {
    const q = input.value.trim(), list = getList();
    const res = q ? searchActivities(list, q).slice(0, 6) : list.filter((a) => a.featured).concat(list.filter((a) => !a.featured)).slice(0, 5);
    sel = -1;
    box.innerHTML = (q ? '' : '<p class="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Les plus populaires</p>')
      + (res.length ? `<div class="py-1">${res.map((a) => row(a, q)).join('')}</div>` : `<p class="px-4 py-4 text-[14px] text-gray-500">Aucune activité pour « ${esc(q)} »</p>`)
      + (q && res.length ? `<a href="${url('activites/?q=' + encodeURIComponent(q))}" class="block border-t border-gray-100 px-4 py-3 text-center text-[13px] font-semibold text-[#0171eb]">Voir tous les résultats</a>` : '');
    box.classList.remove('hidden');
  };
  input.setAttribute('autocomplete', 'off');
  input.addEventListener('focus', render);
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    const items = [...box.querySelectorAll<HTMLAnchorElement>('a[href*="activite/?s="]')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(-1, Math.min(items.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); items.forEach((x, i) => x.classList.toggle('bg-gray-50', i === sel)); }
    if (e.key === 'Enter' && sel >= 0 && items[sel]) { e.preventDefault(); location.href = items[sel].href; }
    if (e.key === 'Escape') box.classList.add('hidden');
  });
  document.addEventListener('pointerdown', (e) => { if (!form.contains(e.target as Node)) box.classList.add('hidden'); });
}
