// Récupère les données au moment de la construction du site (HTML déjà rempli)
import type { Activity, Car } from './cards';
const U = import.meta.env.PUBLIC_SUPABASE_URL;
const K = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
async function get<T>(q: string): Promise<T[]> {
  try {
    const r = await fetch(`${U}/rest/v1/${q}`, { headers: { apikey: K, Authorization: `Bearer ${K}` } });
    return r.ok ? await r.json() : [];
  } catch { return []; }
}
let acts: Promise<Activity[]> | null = null, cars: Promise<Car[]> | null = null;
export const getActivities = () => (acts ??= get<Activity>('activities?select=*&active=eq.true&order=position'));
export const getCars = () => (cars ??= get<Car>('cars?select=*&active=eq.true&order=position'));

export type Category = { slug: string; label: string; icon: string | null; subtitle: string | null; image_url: string | null; position: number; in_menu: boolean; on_home: boolean; active: boolean };
const FALLBACK: Category[] = [
  { slug: 'desert', label: 'Désert', icon: '🏜️', subtitle: null, image_url: '/img/desert.webp', position: 10, in_menu: true, on_home: true, active: true },
  { slug: 'mer', label: 'Mer & yacht', icon: '🛥️', subtitle: null, image_url: '/img/yacht.webp', position: 20, in_menu: true, on_home: true, active: true },
  { slug: 'ciel', label: 'Dans les airs', icon: '🎈', subtitle: null, image_url: '/img/montgolfiere.webp', position: 30, in_menu: true, on_home: false, active: true },
];
let cats: Promise<Category[]> | null = null;
export const getCategories = () => (cats ??= get<Category>('categories?select=*&active=eq.true&order=position').then((c) => (c.length ? c : FALLBACK)));
