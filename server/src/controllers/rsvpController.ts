import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Guest, { type EventType } from '../models/Guest.js';
import Group from '../models/Group.js';
import { getRsvpByDate, isRsvpOpen } from '../config.js';
import { sendRsvpConfirmation } from '../services/emailService.js';
import { loggers } from '../utils/logger.js';

const log = loggers.app;

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
  allowedPlusOne: boolean;
  rsvpDate: string | null;
}

export interface LookupGroupDto {
  _id: string;
  name?: string;
  guests: LookupGuestDto[];
}

function guestToDto(o: Record<string, unknown>): LookupGuestDto {
  const dto: LookupGuestDto = {
    _id: String(o._id),
    firstName: (o.firstName as string) ?? '',
    lastName: (o.lastName as string) ?? '',
    rsvpStatus: (o.rsvpStatus as string) ?? 'pending',
    events: (o.events as string[]) ?? [],
    dietaryRestrictions: (o.dietaryRestrictions as string) ?? '',
    plusOne: (o.plusOne as LookupGuestDto['plusOne']) ?? null,
    songRequest: (o.songRequest as string) ?? '',
    allowedPlusOne: (o.allowedPlusOne as boolean) ?? false,
    rsvpDate: o.rsvpDate ? new Date(o.rsvpDate as string).toISOString() : null
  };
  if (typeof o.email === 'string' && o.email) {
    dto.email = o.email;
  }
  return dto;
}

/**
 * GET /api/rsvp/lookup?firstName=Jane&lastName=Smith
 * Returns one or more groups (with guests) matching the name. Multiple groups if same name in different groups.
 */
export const lookupByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const firstName = (typeof req.query.firstName === 'string' ? req.query.firstName : '').trim();
    const lastName = (typeof req.query.lastName === 'string' ? req.query.lastName : '').trim();

    if (!firstName || !lastName) {
      res.status(400).json({ error: 'firstName and lastName are required' });
      return;
    }

    const guestsMatchingName = await Guest.find({
      firstName: { $regex: new RegExp(`^${escapeRegex(firstName)}$`, 'i') },
      lastName: { $regex: new RegExp(`^${escapeRegex(lastName)}$`, 'i') }
    }).lean();

    if (guestsMatchingName.length === 0) {
      res.status(404).json({ error: 'No guest found with that name' });
      return;
    }

    const groupIds = [...new Set(guestsMatchingName.map((g) => String((g as { groupId: mongoose.Types.ObjectId }).groupId)))];
    const groups = await Group.find({ _id: { $in: groupIds } }).lean();
    const allGuestsInGroups = await Guest.find({ groupId: { $in: groupIds } }).sort({ createdAt: 1 }).lean();

    const groupMap = new Map<string, { _id: string; name?: string; guests: LookupGuestDto[] }>();
    for (const g of groups) {
      const id = String((g as { _id: mongoose.Types.ObjectId })._id);
      groupMap.set(id, {
        _id: id,
        name: (g as { name?: string }).name,
        guests: []
      });
    }
    for (const g of allGuestsInGroups) {
      const row = g as Record<string, unknown>;
      const gid = String(row.groupId);
      const group = groupMap.get(gid);
      if (group) {
        group.guests.push(guestToDto(row));
      }
    }

    const result: LookupGroupDto[] = Array.from(groupMap.values());
    const rsvpBy = getRsvpByDate();

    res.json({
      groups: result,
      rsvpOpen: isRsvpOpen(),
      rsvpByDate: rsvpBy ? rsvpBy.toISOString().slice(0, 10) : null
    });
  } catch (error) {
    console.error('Lookup error:', error);
    res.status(500).json({ error: 'Failed to lookup guest' });
  }
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * GET /api/rsvp/status
 * Returns whether RSVP is open and the deadline date.
 */
export const getRsvpStatus = (_req: Request, res: Response): void => {
  try {
    const rsvpBy = getRsvpByDate();
    res.json({
      rsvpOpen: isRsvpOpen(),
      rsvpByDate: rsvpBy ? rsvpBy.toISOString().slice(0, 10) : null
    });
  } catch (error) {
    console.error('RSVP status error:', error);
    res.status(500).json({ error: 'Failed to get RSVP status' });
  }
};

type AttendingPayload = boolean | 'maybe';

const EVENT_TYPES: EventType[] = ['welcome', 'haldi', 'mehndi', 'baraat', 'wedding', 'cocktail', 'reception'];

function toEventTypes(arr: unknown): EventType[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter((e): e is EventType => typeof e === 'string' && EVENT_TYPES.includes(e as EventType));
}

interface GuestUpdatePayload {
  guestId: string;
  attending: AttendingPayload;
  email?: string;
  events?: string[];
  dietaryRestrictions?: string;
  plusOne?: { name: string; dietaryRestrictions: string } | null;
  songRequest?: string;
}

/**
 * POST /api/rsvp
 * Body: { groupId, guests: [{ guestId, attending, events?, dietaryRestrictions?, plusOne?, songRequest? }] }
 * Same for submit and edit. Rejects if rsvpOpen is false.
 */
export const submitRsvp = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isRsvpOpen()) {
      res.status(403).json({ error: 'RSVP has closed' });
      return;
    }

    const { groupId, guests: guestsPayload } = req.body as {
      groupId?: string;
      guests?: GuestUpdatePayload[];
    };

    if (!groupId || !Array.isArray(guestsPayload) || guestsPayload.length === 0) {
      res.status(400).json({ error: 'groupId and guests array are required' });
      return;
    }

    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    const group = await Group.findById(groupObjectId);
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    const guestIds = guestsPayload.map((g) => g.guestId).filter(Boolean);
    const guestsInGroup = await Guest.find({ _id: { $in: guestIds }, groupId: groupObjectId });
    if (guestsInGroup.length !== guestIds.length) {
      res.status(400).json({ error: 'All guestIds must belong to the group' });
      return;
    }

    const now = new Date();
    for (const payload of guestsPayload) {
      const guest = guestsInGroup.find((g) => String(g._id) === payload.guestId);
      if (!guest) continue;

      if (payload.email !== undefined) {
        const trimmedEmail = payload.email.trim().toLowerCase();
        if (trimmedEmail) {
          const existing = await Guest.findOne({ email: trimmedEmail, _id: { $ne: guest._id } });
          if (existing) {
            res.status(400).json({ error: `Email "${trimmedEmail}" is already in use by another guest` });
            return;
          }
          guest.email = trimmedEmail;
        }
      }

      const status = attendingToStatus(payload.attending);
      guest.rsvpStatus = status;
      guest.rsvpDate = now;
      if (payload.events !== undefined) guest.events = toEventTypes(payload.events);
      if (payload.dietaryRestrictions !== undefined) guest.dietaryRestrictions = payload.dietaryRestrictions;
      if (payload.plusOne !== undefined) guest.plusOne = payload.plusOne ?? null;
      if (payload.songRequest !== undefined) guest.songRequest = payload.songRequest;
      await guest.save();
    }

    res.json({
      success: true,
      message: 'RSVP submitted successfully'
    });

    sendRsvpConfirmation(groupId).catch((err) => {
      log.error({ err, groupId }, 'RSVP confirmation email failed');
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
};

function attendingToStatus(attending: AttendingPayload | undefined): 'pending' | 'confirmed' | 'maybe' | 'declined' {
  if (attending === true) return 'confirmed';
  if (attending === 'maybe') return 'maybe';
  if (attending === false) return 'declined';
  return 'pending';
}
