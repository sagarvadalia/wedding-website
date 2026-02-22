import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type EventType = 'welcome' | 'haldi' | 'mehndi' | 'baraat' | 'wedding' | 'cocktail' | 'reception';

export interface Guest {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  groupId: string;
  groupName?: string;
  events: EventType[];
  dietaryRestrictions: string;
  plusOne: {
    name: string;
    dietaryRestrictions: string;
  } | null;
  songRequest: string;
  mailingAddress: MailingAddressDto | null;
  rsvpStatus: 'pending' | 'confirmed' | 'maybe' | 'declined';
  rsvpDate: string | null;
  allowedPlusOne: boolean;
  hasBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  _id: string;
  name?: string;
  createdAt?: string;
  guestCount?: number;
  confirmed?: number;
  maybe?: number;
  declined?: number;
  pending?: number;
}

export interface GroupWithGuests extends Group {
  guests: Guest[];
}

export interface LookupResponse {
  groups: LookupGroupDto[];
  rsvpOpen: boolean;
  rsvpByDate: string | null;
}

export interface MailingAddressDto {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

export interface LookupGuestDto {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  rsvpStatus: string;
  events: string[];
  dietaryRestrictions: string;
  plusOne: { name: string; dietaryRestrictions: string } | null;
  songRequest: string;
  mailingAddress: MailingAddressDto | null;
  allowedPlusOne: boolean;
  rsvpDate: string | null;
}

export interface LookupGroupDto {
  _id: string;
  name?: string;
  guests: LookupGuestDto[];
}

export interface RsvpStatusResponse {
  rsvpOpen: boolean;
  rsvpByDate: string | null;
}

export interface GroupRsvpGuestPayload {
  guestId: string;
  attending: boolean | 'maybe';
  email?: string;
  events?: EventType[];
  dietaryRestrictions?: string;
  plusOne?: { name: string; dietaryRestrictions: string } | null;
  songRequest?: string;
  mailingAddress?: MailingAddressDto | null;
}

export interface GroupRsvpPayload {
  groupId: string;
  guests: GroupRsvpGuestPayload[];
}

export interface Stats {
  total: number;
  totalGroups: number;
  confirmed: number;
  maybe: number;
  declined: number;
  pending: number;
  responseRate: string;
  rsvpOpen: boolean;
  rsvpByDate: string | null;
  eventCounts: Record<string, number>;
  groupsWithResponse: number;
  groupsWithoutResponse: number;
  groupsFullyDeclined: number;
  groupsMixed: number;
  plusOneAllowed: number;
  plusOneWithGuest: number;
  plusOneComingAlone: number;
  dietaryCount: number;
  hasBookedCount: number;
}

export const rsvpApi = {
  lookup: (firstName: string, lastName: string) =>
    api
      .get<LookupResponse>('/rsvp/lookup', { params: { firstName, lastName } })
      .then((res) => res.data),

  status: () =>
    api.get<RsvpStatusResponse>('/rsvp/status').then((res) => res.data),

  submit: (data: GroupRsvpPayload) =>
    api.post('/rsvp', data).then((res) => res.data),
};

export const adminApi = {
  getGuests: () => api.get<Guest[]>('/admin/guests').then((res) => res.data),
  addGuest: (data: {
    firstName: string;
    lastName: string;
    email?: string;
    groupId: string;
    allowedPlusOne?: boolean;
    mailingAddress?: MailingAddressDto | null;
  }) => api.post<{ success: boolean; guest: Guest }>('/admin/guests', data).then((res) => res.data),
  updateGuest: (
    id: string,
    data: Partial<{ firstName: string; lastName: string; email: string; groupId: string; allowedPlusOne: boolean; hasBooked: boolean; mailingAddress: MailingAddressDto | null }>
  ) => api.put<{ success: boolean; guest: Guest }>(`/admin/guests/${id}`, data).then((res) => res.data),
  deleteGuest: (id: string) => api.delete(`/admin/guests/${id}`).then((res) => res.data),

  getGroups: () => api.get<Group[]>('/admin/groups').then((res) => res.data),
  getGroup: (id: string) => api.get<GroupWithGuests>(`/admin/groups/${id}`).then((res) => res.data),
  createGroup: (data: { name?: string }) =>
    api.post<{ success: boolean; group: Group }>('/admin/groups', data).then((res) => res.data),
  updateGroup: (id: string, data: { name?: string }) =>
    api.put<{ success: boolean; group: Group }>(`/admin/groups/${id}`, data).then((res) => res.data),
  deleteGroup: (id: string) => api.delete(`/admin/groups/${id}`).then((res) => res.data),

  getStats: () => api.get<Stats>('/admin/stats').then((res) => res.data),
};

export default api;
