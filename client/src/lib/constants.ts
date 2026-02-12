/**
 * Wedding site constants. Update these for your wedding.
 */

/** Venmo profile URL for optional honeymoon fund (e.g. https://venmo.com/u/YourUsername) */
export const HONEYMOON_FUND_VENMO_URL = 'https://venmo.com/u/YourUsername';

/** Featured photos for landing polaroids and open passport spread. Replace with real engagement/couple images. */
export interface FeaturedPhoto {
  src: string;
  alt: string;
}

export const FEATURED_PHOTOS: FeaturedPhoto[] = [
  { src: '/images/dreams-playa-mujeres.jpg', alt: 'Dreams Playa Mujeres resort' },
  { src: '', alt: 'Engagement photo 1' },
  { src: '', alt: 'Engagement photo 2' },
  { src: '', alt: 'Couple photo 1' },
  { src: '', alt: 'Couple photo 2' },
  { src: '', alt: 'Couple photo 3' },
];

/** Cast / wedding party for The Cast page. Update names, roles, photos, and blurbs. */
export interface CastMemberConfig {
  id: string;
  name: string;
  role: string;
  photo?: string;
  blurb: string;
}

export const CAST_MEMBERS: CastMemberConfig[] = [
  { id: 'moh', name: 'Placeholder', role: 'Maid of Honor', blurb: 'Add a short, fun blurb here.' },
  { id: 'bm', name: 'Placeholder', role: 'Best Man', blurb: 'Add a short, fun blurb here.' },
  { id: 'b1', name: 'Placeholder', role: 'Bridesmaid', blurb: 'Add a short, fun blurb here.' },
  { id: 'b2', name: 'Placeholder', role: 'Bridesmaid', blurb: 'Add a short, fun blurb here.' },
  { id: 'g1', name: 'Placeholder', role: 'Groomsman', blurb: 'Add a short, fun blurb here.' },
  { id: 'g2', name: 'Placeholder', role: 'Groomsman', blurb: 'Add a short, fun blurb here.' },
];
