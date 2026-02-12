import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { LookupGroupDto } from '@/lib/api';

const STORAGE_KEY = 'wedding_rsvp_guest';

interface GuestContextValue {
  group: LookupGroupDto | null;
  setGroup: (group: LookupGroupDto | null) => void;
  logout: () => void;
  displayName: string;
}

const GuestContext = createContext<GuestContextValue | null>(null);

function loadStored(): LookupGroupDto | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LookupGroupDto;
    if (!parsed || !parsed._id || !Array.isArray(parsed.guests)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStored(group: LookupGroupDto | null): void {
  try {
    if (group) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function GuestProvider({ children }: { children: ReactNode }) {
  const [group, setGroupState] = useState<LookupGroupDto | null>(loadStored);

  useEffect(() => {
    saveStored(group);
  }, [group]);

  const setGroup = useCallback((next: LookupGroupDto | null) => {
    setGroupState(next);
  }, []);

  const logout = useCallback(() => {
    setGroupState(null);
    saveStored(null);
  }, []);

  const displayName =
    group?.name?.trim() ||
    (group?.guests?.[0]
      ? `${group.guests[0].firstName} ${group.guests[0].lastName}`
      : '');

  const value: GuestContextValue = {
    group,
    setGroup,
    logout,
    displayName,
  };

  return (
    <GuestContext.Provider value={value}>{children}</GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) {
    throw new Error('useGuest must be used within GuestProvider');
  }
  return ctx;
}

export function useGuestOptional() {
  return useContext(GuestContext);
}
