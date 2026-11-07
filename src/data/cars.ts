import type { ImageMetadata } from 'astro';
import rolls from '../assets/img/cars/rolls-wraith.jpg';
import huracan from '../assets/img/cars/huracan-evo.jpg';
import aventador from '../assets/img/cars/aventador.jpg';
import f8 from '../assets/img/cars/ferrari-f8.jpg';
import amgGt from '../assets/img/cars/amg-gt.jpg';
import gt3 from '../assets/img/cars/porsche-gt3.jpg';
import g63 from '../assets/img/cars/g63.jpg';
import rangeSport from '../assets/img/cars/range-sport.jpg';
import panamera from '../assets/img/cars/panamera.jpg';
import m4 from '../assets/img/cars/bmw-m4.jpg';
import rs7 from '../assets/img/cars/audi-rs7.jpg';

// ———————————————————————————————————————————
//  FLOTTE DE VOITURES : modifiez librement.
//  • pricePerDay : prix en AED par jour. Laissez `null` pour afficher « Sur demande ».
//  • available : false pour afficher « Bientôt disponible ».
//  Flotte type, à remplacer par les véhicules réels de la conciergerie.
// ———————————————————————————————————————————

export type CarCategory = 'supercar' | 'prestige' | 'suv' | 'sport';

export const carCategories: { id: CarCategory; label: string }[] = [
  { id: 'supercar', label: 'Supercars' },
  { id: 'prestige', label: 'Prestige' },
  { id: 'suv', label: 'SUV de luxe' },
  { id: 'sport', label: 'Sportives & berlines' },
];

export interface Car {
  slug: string;
  brand: string;
  model: string;
  category: CarCategory;
  image: ImageMetadata;
  seats: number;
  engine: string;
  pricePerDay: number | null;
  available?: boolean;
  tag?: string;
}

export const cars: Car[] = [
  { slug: 'rolls-royce-wraith', brand: 'Rolls-Royce', model: 'Wraith', category: 'prestige', image: rolls, seats: 4, engine: 'V12', pricePerDay: null, tag: 'Prestige absolu' },
  { slug: 'lamborghini-huracan-evo', brand: 'Lamborghini', model: 'Huracán EVO', category: 'supercar', image: huracan, seats: 2, engine: 'V10', pricePerDay: null },
  { slug: 'lamborghini-aventador-s', brand: 'Lamborghini', model: 'Aventador S', category: 'supercar', image: aventador, seats: 2, engine: 'V12', pricePerDay: null },
  { slug: 'ferrari-f8', brand: 'Ferrari', model: 'F8 Tributo', category: 'supercar', image: f8, seats: 2, engine: 'V8 biturbo', pricePerDay: null, tag: 'Coup de cœur' },
  { slug: 'mercedes-amg-gt', brand: 'Mercedes-AMG', model: 'GT', category: 'sport', image: amgGt, seats: 2, engine: 'V8 biturbo', pricePerDay: null },
  { slug: 'porsche-911-gt3', brand: 'Porsche', model: '911 GT3', category: 'sport', image: gt3, seats: 2, engine: '6 cyl. à plat', pricePerDay: null },
  { slug: 'mercedes-amg-g63', brand: 'Mercedes-AMG', model: 'G 63', category: 'suv', image: g63, seats: 5, engine: 'V8 biturbo', pricePerDay: null, tag: 'Best-seller' },
  { slug: 'range-rover-sport', brand: 'Land Rover', model: 'Range Rover Sport', category: 'suv', image: rangeSport, seats: 5, engine: '4x4', pricePerDay: null },
  { slug: 'porsche-panamera', brand: 'Porsche', model: 'Panamera', category: 'sport', image: panamera, seats: 4, engine: 'V6 / V8', pricePerDay: null },
  { slug: 'bmw-m4-competition', brand: 'BMW', model: 'M4 Competition', category: 'sport', image: m4, seats: 4, engine: '6 cyl. biturbo', pricePerDay: null },
  { slug: 'audi-rs7', brand: 'Audi', model: 'RS 7 Sportback', category: 'sport', image: rs7, seats: 5, engine: 'V8 biturbo', pricePerDay: null },
];

export const carName = (c: Car) => `${c.brand} ${c.model}`;
export const carPrice = (c: Car) =>
  c.pricePerDay ? `${c.pricePerDay.toLocaleString('fr-FR')} AED / jour` : 'Prix sur demande';

/** Conditions de location : à valider avec la conciergerie */
export const rentalConditions = [
  { icon: 'users', title: 'Âge minimum', text: '21 ans, et 25 ans pour certaines supercars.' },
  { icon: 'check', title: 'Permis de conduire', text: 'Permis valide depuis plus d’un an. Un permis international peut être demandé selon votre pays.' },
  { icon: 'wallet', title: 'Caution', text: 'Une caution est demandée à la remise du véhicule, puis restituée après le retour.' },
  { icon: 'car', title: 'Livraison', text: 'À votre hôtel, à votre villa ou à l’aéroport, partout à Dubaï.' },
];
