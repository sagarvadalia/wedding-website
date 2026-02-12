export type EventType = 'welcome' | 'haldi' | 'mehndi' | 'baraat' | 'wedding' | 'cocktail' | 'reception';

export interface WeddingEvent {
  id: EventType;
  name: string;
  date: string;
  time: string;
  location: string;
  dressCode: string;
  description: string;
  stampTheme: 'beach' | 'haldi' | 'henna' | 'elephant' | 'mandap' | 'cocktail' | 'celebration';
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Activity {
  name: string;
  description: string;
  image?: string;
  link?: string;
  category: 'resort' | 'excursion' | 'dining' | 'shopping';
}

/** Wedding party / cast member for "The Cast" page */
export interface CastMember {
  id: string;
  name: string;
  role: string;
  /** Optional photo URL; placeholder used if empty */
  photo?: string;
  /** Short, fun explainer blurb (comedic bend) */
  blurb: string;
}
