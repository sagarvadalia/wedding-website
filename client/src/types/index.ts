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
