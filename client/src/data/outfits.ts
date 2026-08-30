import type { EventType } from '@/types';

export interface OutfitSide {
  imageSrc: string;
  imageAlt: string;
  tips: string[];
}

export interface EventOutfitGuide {
  eventId: EventType;
  name: string;
  dressCode: string;
  accent: string;
  her: OutfitSide;
  him: OutfitSide;
}

export interface ShoppingStore {
  name: string;
  address: string;
  note: string;
  mapsQuery: string;
}

export type ShoppingAreaId = 'hicksville' | 'edison' | 'jackson-heights';

export interface ShoppingArea {
  id: ShoppingAreaId;
  label: string;
  blurb: string;
  stores: ShoppingStore[];
}

/** Local outfit reference images (Unsplash, free to use under the Unsplash License). */
export function outfitImagePath(eventId: EventType, side: 'her' | 'him'): string {
  return `/images/outfits/${eventId}-${side}.jpg`;
}

export function googleMapsSearchUrl(mapsQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
}

export const eventOutfitGuides: EventOutfitGuide[] = [
  {
    eventId: 'welcome',
    name: 'Welcome Dinner',
    dressCode: 'Resort Casual / Beach Attire',
    accent: 'from-ocean-sky to-ocean-caribbean',
    her: {
      imageSrc: outfitImagePath('welcome', 'her'),
      imageAlt: 'Reference: floral sundress with flat sandals for resort casual welcome dinner attire',
      tips: [
        'Flowy sundress or a nice blouse with linen pants',
        'Light fabrics — cotton, linen, or chiffon',
        'Sandals or dressy flats (sand-friendly)',
        'Ocean and tropical colors welcome',
      ],
    },
    him: {
      imageSrc: outfitImagePath('welcome', 'him'),
      imageAlt: 'Reference: floral Hawaiian shirt with linen pants and sandals for welcome dinner attire',
      tips: [
        'Linen shirt or lightweight button-down with chinos or linen pants',
        'Light fabrics — cotton or linen',
        'Boat shoes, loafers, or clean sneakers (sand-friendly)',
        'Ocean and tropical colors welcome',
      ],
    },
  },
  {
    eventId: 'haldi',
    name: 'Haldi Ceremony',
    dressCode: 'Yellow / White Attire (clothes may get stained!)',
    accent: 'from-gold to-sand-warm',
    her: {
      imageSrc: outfitImagePath('haldi', 'her'),
      imageAlt: 'Reference: yellow floral lehenga with marigold flower jewelry for the haldi ceremony',
      tips: [
        'Wear yellow, white, or light-colored clothing',
        'Expect turmeric stains — old clothes are perfect',
        'Skip jewelry you would be upset about staining',
        'Comfortable sandals you do not mind getting messy',
      ],
    },
    him: {
      imageSrc: outfitImagePath('haldi', 'him'),
      imageAlt: 'Reference: mustard yellow embroidered kurta pajama for the haldi ceremony',
      tips: [
        'Wear yellow, white, or light-colored kurta or casual shirt',
        'Expect turmeric stains — clothes you do not mind ruining',
        'Skip watches or accessories you want to keep pristine',
        'Comfortable sandals or slip-ons',
      ],
    },
  },
  {
    eventId: 'mehndi',
    name: 'Mehndi Ceremony',
    dressCode: 'Colorful Indian Attire',
    accent: 'from-coral to-gold',
    her: {
      imageSrc: outfitImagePath('mehndi', 'her'),
      imageAlt: 'Reference: royal blue mirror-embroidered lehenga for the mehndi ceremony',
      tips: [
        'Bright, colorful outfits — vibrant greens, pinks, blues, or oranges',
        'Lehengas, kurtas, salwar kameez, or sarees if you have them',
        'Bold Western dresses in bright colors are equally welcome',
        'Comfortable shoes for dancing',
      ],
    },
    him: {
      imageSrc: outfitImagePath('mehndi', 'him'),
      imageAlt: 'Reference: colorful kurta with vest for the mehndi ceremony',
      tips: [
        'Colorful kurta with churidar or linen pants',
        'Indo-western or bold Western shirts in bright colors',
        'Nehrus, bandhgalas, or a sharp casual look all work',
        'Comfortable shoes for dancing',
      ],
    },
  },
  {
    eventId: 'baraat',
    name: 'Baraat Procession',
    dressCode: 'Formal Indian Attire (usually worn again at the ceremony)',
    accent: 'from-ocean-deep to-ocean-caribbean',
    her: {
      imageSrc: outfitImagePath('baraat', 'her'),
      imageAlt: 'Reference: formal Indian lehenga for the baraat and wedding ceremony',
      tips: [
        'Most guests wear one formal Indian outfit for both the Baraat and the Wedding Ceremony',
        'This same outfit often works for Cocktail Hour and the Reception too',
        'Traditional formalwear — sarees, lehengas, or anarkalis',
        'Western formal or cocktail attire also works great',
        'Comfortable shoes — you will be dancing at the Baraat!',
      ],
    },
    him: {
      imageSrc: outfitImagePath('baraat', 'him'),
      imageAlt: 'Reference: wedding sherwani for the baraat and wedding ceremony',
      tips: [
        'Most guests wear one formal Indian outfit for both the Baraat and the Wedding Ceremony',
        'This same outfit often works for Cocktail Hour and the Reception too',
        'Sherwani, kurta pajama, or Indo-western formal',
        'Western suit or blazer with dress pants also works',
        'Comfortable dress shoes — you will be dancing at the Baraat!',
      ],
    },
  },
  {
    eventId: 'wedding',
    name: 'Wedding Ceremony',
    dressCode: 'Same as Baraat — Formal Indian Attire',
    accent: 'from-ocean-deep to-ocean-caribbean',
    her: {
      imageSrc: outfitImagePath('baraat', 'her'),
      imageAlt: 'Reference: same formal Indian lehenga worn at the baraat and wedding ceremony',
      tips: [
        'Wear the same outfit you chose for the Baraat — no need to change',
        'Traditional formalwear — sarees, lehengas, or anarkalis',
        'Western formal or elegant dresses also work',
        'Breathable fabrics help — the ceremony is outdoors',
      ],
    },
    him: {
      imageSrc: outfitImagePath('baraat', 'him'),
      imageAlt: 'Reference: same wedding sherwani worn at the baraat and wedding ceremony',
      tips: [
        'Wear the same outfit you chose for the Baraat — no need to change',
        'Sherwani, kurta pajama, or Indo-western formal',
        'Western suit or blazer with dress pants also works',
        'Breathable fabrics help — the ceremony is outdoors',
      ],
    },
  },
  {
    eventId: 'cocktail',
    name: 'Cocktail Hour',
    dressCode: 'Formal / Evening Wear (often worn again at reception)',
    accent: 'from-ocean-caribbean to-ocean-sky',
    her: {
      imageSrc: outfitImagePath('cocktail', 'her'),
      imageAlt: 'Reference: semi-formal cocktail evening gown for cocktail hour and reception',
      tips: [
        'Many guests wear one evening outfit for both Cocktail Hour and the Reception',
        'You can also reuse your Baraat/Wedding ceremony outfit — lehenga, saree, or indo-western works beautifully',
        'Cocktail dress or evening gown if you prefer a separate look',
        'Dressy heels, wedges, or formal flats',
      ],
    },
    him: {
      imageSrc: outfitImagePath('cocktail', 'him'),
      imageAlt: 'Reference: wedding guest suit for cocktail hour and reception',
      tips: [
        'Many guests wear one evening outfit for both Cocktail Hour and the Reception',
        'You can also reuse your Baraat/Wedding ceremony outfit — sherwani or kurta pajama is welcome',
        'Suit or blazer with dress pants if you prefer a separate look',
        'Dress shoes or polished loafers',
      ],
    },
  },
  {
    eventId: 'reception',
    name: 'Reception Dinner',
    dressCode: 'Same as Cocktail — Formal / Evening Wear',
    accent: 'from-ocean-caribbean to-ocean-sky',
    her: {
      imageSrc: outfitImagePath('cocktail', 'her'),
      imageAlt: 'Reference: same cocktail evening gown for cocktail hour and reception',
      tips: [
        'Wear the same outfit you chose for Cocktail Hour — no need to change',
        'Your ceremony lehenga, saree, or indo-western look is also perfect here',
        'Cocktail dress or evening gown if you went with a separate evening look',
        'Dressy heels, wedges, or formal flats',
      ],
    },
    him: {
      imageSrc: outfitImagePath('cocktail', 'him'),
      imageAlt: 'Reference: same wedding guest suit for cocktail hour and reception',
      tips: [
        'Wear the same outfit you chose for Cocktail Hour — no need to change',
        'Your ceremony sherwani or kurta pajama is also perfect here',
        'Suit or blazer if you went with a separate evening look',
        'Dress shoes or polished loafers',
      ],
    },
  },
];

export const proOutfitTips: string[] = [
  'Many events are outdoors — skip stilettos on grass and sand',
  'Cancun in April is warm (80°F+) — breathable fabrics are your friend',
  'Do not have Indian outfits? Colorful Western wear is welcome!',
];

export const shoppingAreas: ShoppingArea[] = [
  {
    id: 'hicksville',
    label: 'Hicksville, NY',
    blurb: 'South Broadway has several Indian clothing boutiques with tailoring on-site.',
    stores: [
      {
        name: 'Sai Bridal',
        address: '357 S Broadway, Unit 3, Hicksville, NY 11801',
        note: 'Wide selection for men and women; on-site tailoring and strong reviews for variety.',
        mapsQuery: 'Sai Bridal 357 S Broadway Hicksville NY',
      },
      {
        name: 'Chandigarh Fashion',
        address: '285-2 S Broadway, Hicksville, NY 11801',
        note: 'Family-run boutique with sarees, lehengas, and men\'s kurtas; in-house tailor.',
        mapsQuery: 'Chandigarh Fashion 285 S Broadway Hicksville NY',
      },
      {
        name: 'Samaira Bridal',
        address: '259 S Broadway, Hicksville, NY 11801',
        note: 'Bridal and formal Indian wear with personalized styling help.',
        mapsQuery: 'Samaira Bridal 259 S Broadway Hicksville NY',
      },
    ],
  },
  {
    id: 'edison',
    label: 'Edison / Iselin, NJ',
    blurb: 'Oak Tree Road is one of the largest Indian shopping corridors in the US.',
    stores: [
      {
        name: 'Nazranaa',
        address: 'Oak Tree Road area, Edison / Iselin, NJ',
        note: 'Large selection and custom options; often recommended for guests new to Indian wear.',
        mapsQuery: 'Nazranaa Oak Tree Road Edison NJ',
      },
      {
        name: 'Sajda',
        address: '1345 Oak Tree Rd, Iselin, NJ 08830',
        note: 'Designer lehengas and sarees with attentive, personalized service.',
        mapsQuery: 'Sajda 1345 Oak Tree Rd Iselin NJ',
      },
      {
        name: 'Pure Elegance',
        address: '1655 Oak Tree Rd, Edison, NJ 08820',
        note: 'Ethnic couture and party wear; strong for sarees and lehengas.',
        mapsQuery: 'Pure Elegance 1655 Oak Tree Rd Edison NJ',
      },
    ],
  },
  {
    id: 'jackson-heights',
    label: 'Jackson Heights, NY',
    blurb: '74th Street is a classic destination for Indian formal and bridal wear.',
    stores: [
      {
        name: "Rahul's Couture",
        address: '37-49 74th St, Jackson Heights, NY 11372',
        note: 'Highly rated for quality lehengas and sarees; honest, no-pressure service.',
        mapsQuery: "Rahul's Couture 37-49 74th St Jackson Heights NY",
      },
      {
        name: 'Bombay Bridal Boutique',
        address: '37-53 75th St, Jackson Heights, NY 11372',
        note: 'Long-standing family boutique with bridal, groom, and guest wear.',
        mapsQuery: 'Bombay Bridal Boutique 37-53 75th St Jackson Heights NY',
      },
    ],
  },
];

export const shoppingIntro =
  'These are popular, highly rated spots in tri-state Indian shopping corridors. Call ahead for hours and alteration timelines — and remember, colorful Western wear is always welcome too.';
