import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Guest {
  _id: string;
  name: string;
  email: string;
  inviteCode: string;
  events: EventType[];
  dietaryRestrictions: string;
  plusOne: {
    name: string;
    dietaryRestrictions: string;
  } | null;
  songRequest: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  rsvpDate: string | null;
  allowedPlusOne: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventType = 'welcome' | 'mehndi' | 'baraat' | 'wedding' | 'reception' | 'afterparty';

export interface RsvpData {
  inviteCode: string;
  attending: boolean;
  events: EventType[];
  dietaryRestrictions?: string;
  plusOne?: {
    name: string;
    dietaryRestrictions: string;
  };
  songRequest?: string;
}

export interface Stats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  responseRate: string;
  eventCounts: Record<EventType, number>;
}

// RSVP API
export const rsvpApi = {
  lookup: (code: string) => 
    api.get<Guest>(`/rsvp/${code}`).then((res) => res.data),
  
  submit: (data: RsvpData) => 
    api.post('/rsvp', data).then((res) => res.data),
  
  update: (id: string, data: Partial<RsvpData>) => 
    api.put(`/rsvp/${id}`, data).then((res) => res.data),
};

// Admin API
export const adminApi = {
  getGuests: () => 
    api.get<Guest[]>('/admin/guests').then((res) => res.data),
  
  addGuest: (data: { name: string; email: string; allowedPlusOne?: boolean }) => 
    api.post('/admin/guests', data).then((res) => res.data),
  
  deleteGuest: (id: string) => 
    api.delete(`/admin/guests/${id}`).then((res) => res.data),
  
  getStats: () => 
    api.get<Stats>('/admin/stats').then((res) => res.data),
};

export default api;
