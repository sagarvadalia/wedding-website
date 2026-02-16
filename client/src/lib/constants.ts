/**
 * Wedding site constants. Update these for your wedding.
 */

/** Venmo profile URL for optional honeymoon fund (e.g. https://venmo.com/u/YourUsername) */
export const HONEYMOON_FUND_VENMO_URL = 'https://venmo.com/u/grace-capati';

/**
 * Hero background photo for the landing page.
 *
 * objectPosition / mobileObjectPosition control which part of the photo
 * stays visible when the browser crops to fill the hero container.
 *
 * Format: 'X Y'
 *   X = horizontal → 0% is left edge, 50% is center, 100% is right edge
 *   Y = vertical   → 0% is top edge,  50% is center, 100% is bottom edge
 *
 * Tip: open the photo, estimate where the subject's face is as a percentage
 * from the left and top edges, and use those values.
 */
export const HERO_PHOTO = {
  src: '/images/hero-wedding-photo.avif',
  alt: 'Sagar and Grace',
  objectPosition: '50% 30%',
  mobileObjectPosition: '80% 70%',
};

/** Background photo for the RSVP page — same format as HERO_PHOTO. */
export const RSVP_BACKGROUND_PHOTO = {
  src: '/images/rsvp-landing-photo.avif',
  alt: 'Sagar and Grace',
  objectPosition: '50% 30%',
  mobileObjectPosition: '80% 50%',
};

/** Full-bleed photo for the left page of the open passport spread. */
export const PASSPORT_SPREAD_PHOTO = {
  src: '/images/dreams-playa-mujeres.jpg',
  alt: 'Sagar and Grace',
  objectPosition: '50% 50%',
};

/** Featured photos for landing polaroids and open passport spread. Replace with real engagement/couple images. */
export interface FeaturedPhoto {
  src: string;
  alt: string;
}

export const FEATURED_PHOTOS: FeaturedPhoto[] = [
  { src: '/images/dreams-playa-mujeres.jpg', alt: 'Dreams Playa Mujeres resort' },
  { src: '/images/hero-wedding-photo.avif', alt: 'Engagement photo 1' },
  { src: '/images/hero-wedding-photo.avif', alt: 'Engagement photo 2' },
  { src: '/images/hero-wedding-photo.avif', alt: 'Couple photo 1' },
  { src: '/images/hero-wedding-photo.avif', alt: 'Couple photo 2' },
  { src: '/images/hero-wedding-photo.avif', alt: 'Couple photo 3' },
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
