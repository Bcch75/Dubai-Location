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
