import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Guest from '../models/Guest.js';
import Group from '../models/Group.js';
import { getRsvpByDate, isRsvpOpen } from '../config.js';
import { sendRsvpReminder, sendTravelReminder } from '../services/emailService.js';
import { loggers, enrichWideEvent } from '../utils/logger.js';

const log = loggers.app;

export const getAllGuests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const guests = await Guest.find()
      .populate('groupId', 'name')
      .sort({ groupId: 1, createdAt: 1 })
      .lean();
    const serialized = guests.map((g) => {
      const row = g as Record<string, unknown>;
      const group = row.groupId as { _id: mongoose.Types.ObjectId; name?: string } | null;
      const groupIdStr = group ? String(group._id) : String(row.groupId);
      return {
        ...row,
        _id: String(row._id),
        groupId: groupIdStr,
        groupName: group?.name ?? ''
      };
    });
    res.json(serialized);
  } catch (error) {
    log.error({ err: error }, 'Get all guests error');
    res.status(500).json({ error: 'Failed to retrieve guests' });
  }
};

function normalizeMailingAddress(ma: unknown): { addressLine1: string; addressLine2?: string; city: string; stateOrProvince: string; postalCode: string; country: string } | null {
  if (!ma || typeof ma !== 'object') return null;
  const a = ma as Record<string, unknown>;
  const line1 = typeof a.addressLine1 === 'string' ? a.addressLine1.trim() : '';
  const city = typeof a.city === 'string' ? a.city.trim() : '';
  const state = typeof a.stateOrProvince === 'string' ? a.stateOrProvince.trim() : '';
  const postal = typeof a.postalCode === 'string' ? a.postalCode.trim() : '';
  const country = typeof a.country === 'string' ? a.country.trim() : '';
  if (!line1 && !city && !state && !postal && !country) return null;
  const result: { addressLine1: string; addressLine2?: string; city: string; stateOrProvince: string; postalCode: string; country: string } = {
    addressLine1: line1,
    city,
    stateOrProvince: state,
    postalCode: postal,
    country
  };
  const line2 = typeof a.addressLine2 === 'string' ? a.addressLine2.trim() : '';
  if (line2) result.addressLine2 = line2;
  return result;
}

export const addGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, groupId, allowedPlusOne, hasBooked, mailingAddress } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !groupId) {
      res.status(400).json({ error: 'firstName, lastName, and groupId are required' });
      return;
    }

    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : undefined;

    if (trimmedEmail) {
      const existingGuest = await Guest.findOne({ email: trimmedEmail });
      if (existingGuest) {
        res.status(400).json({ error: 'Guest with this email already exists' });
        return;
      }
    }

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(400).json({ error: 'Group not found' });
      return;
    }

    const guestData: Record<string, unknown> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      groupId: new mongoose.Types.ObjectId(groupId),
      allowedPlusOne: allowedPlusOne ?? false,
      hasBooked: hasBooked ?? false,
      rsvpStatus: 'pending',
      events: []
    };
    if (trimmedEmail) {
      guestData.email = trimmedEmail;
    }
    const ma = normalizeMailingAddress(mailingAddress);
    if (ma) guestData.mailingAddress = ma;

    const guest = new Guest(guestData);
    await guest.save();

    const populated = await Guest.findById(guest._id).populate('groupId', 'name').lean();
    res.status(201).json({
      success: true,
      message: 'Guest added successfully',
      guest: populated
    });
  } catch (error) {
    log.error({ err: error }, 'Add guest error');
    res.status(500).json({ error: 'Failed to add guest' });
  }
};

export const updateGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, groupId, allowedPlusOne, hasBooked, mailingAddress } = req.body;

    const guest = await Guest.findById(id);
    if (!guest) {
      res.status(404).json({ error: 'Guest not found' });
      return;
    }

    if (firstName !== undefined) guest.firstName = String(firstName).trim();
    if (lastName !== undefined) guest.lastName = String(lastName).trim();
    if (email !== undefined) {
      const newEmail = String(email).trim().toLowerCase();
      if (newEmail !== guest.email) {
        const existing = await Guest.findOne({ email: newEmail });
        if (existing) {
          res.status(400).json({ error: 'Another guest already has this email' });
          return;
        }
        guest.email = newEmail;
      }
    }
    if (groupId !== undefined) {
      const groupIdStr =
        typeof groupId === 'string' ? groupId : (groupId && typeof groupId === 'object' && '_id' in groupId ? String((groupId as { _id: unknown })._id) : undefined);
      if (!groupIdStr) {
        res.status(400).json({ error: 'Invalid groupId' });
        return;
      }
      const group = await Group.findById(groupIdStr);
      if (!group) {
        res.status(400).json({ error: 'Group not found' });
        return;
      }
      guest.groupId = new mongoose.Types.ObjectId(groupIdStr);
    }
    if (allowedPlusOne !== undefined) guest.allowedPlusOne = Boolean(allowedPlusOne);
    if (hasBooked !== undefined) guest.hasBooked = Boolean(hasBooked);
    if (mailingAddress !== undefined) guest.mailingAddress = normalizeMailingAddress(mailingAddress);

    await guest.save();
    const populated = await Guest.findById(guest._id).populate('groupId', 'name').lean();
    res.json({
      success: true,
      message: 'Guest updated successfully',
      guest: populated
    });
  } catch (error) {
    log.error({ err: error }, 'Update guest error');
    res.status(500).json({ error: 'Failed to update guest' });
  }
};

export const deleteGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const guest = await Guest.findByIdAndDelete(id);

    if (!guest) {
      res.status(404).json({ error: 'Guest not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Guest deleted successfully'
    });
  } catch (error) {
    log.error({ err: error }, 'Delete guest error');
    res.status(500).json({ error: 'Failed to delete guest' });
  }
};

// ---- Groups ----

export const getAllGroups = async (_req: Request, res: Response): Promise<void> => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 }).lean();
    const guestCounts = await Guest.aggregate([
      {
        $group: {
          _id: '$groupId',
          count: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'confirmed'] }, 1, 0] } },
          maybe: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'maybe'] }, 1, 0] } },
          declined: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'declined'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'pending'] }, 1, 0] } }
        }
      }
    ]);
    const countMap = new Map(guestCounts.map((c: { _id: mongoose.Types.ObjectId; count: number; confirmed: number; maybe: number; declined: number; pending: number }) => [String(c._id), c]));

    const result = groups.map((g) => {
      const row = g as { _id: mongoose.Types.ObjectId; name?: string; createdAt: Date };
      const c = countMap.get(String(row._id)) ?? { count: 0, confirmed: 0, maybe: 0, declined: 0, pending: 0 };
      return {
        _id: String(row._id),
        name: row.name,
        createdAt: row.createdAt,
        guestCount: c.count,
        confirmed: c.confirmed,
        maybe: c.maybe,
        declined: c.declined,
        pending: c.pending
      };
    });
    res.json(result);
  } catch (error) {
    log.error({ err: error }, 'Get all groups error');
    res.status(500).json({ error: 'Failed to retrieve groups' });
  }
};

export const getGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id).lean();
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }
    const guests = await Guest.find({ groupId: new mongoose.Types.ObjectId(id) }).sort({ createdAt: 1 }).lean();
    res.json({
      ...(group as Record<string, unknown>),
      _id: String((group as { _id: mongoose.Types.ObjectId })._id),
      guests
    });
  } catch (error) {
    log.error({ err: error }, 'Get group error');
    res.status(500).json({ error: 'Failed to retrieve group' });
  }
};

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const group = new Group({ name: name?.trim() ?? '' });
    await group.save();
    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      group: group.toObject()
    });
  } catch (error) {
    log.error({ err: error }, 'Create group error');
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const updateGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const group = await Group.findByIdAndUpdate(id, { name: name?.trim() ?? '' }, { new: true });
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }
    res.json({
      success: true,
      message: 'Group updated successfully',
      group: group.toObject()
    });
  } catch (error) {
    log.error({ err: error }, 'Update group error');
    res.status(500).json({ error: 'Failed to update group' });
  }
};

export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }
    await Guest.deleteMany({ groupId: group._id });
    await Group.findByIdAndDelete(id);
    res.json({
      success: true,
      message: 'Group and its guests deleted successfully'
    });
  } catch (error) {
    log.error({ err: error }, 'Delete group error');
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalGuests = await Guest.countDocuments();
    const totalGroups = await Group.countDocuments();
    const confirmed = await Guest.countDocuments({ rsvpStatus: 'confirmed' });
    const maybe = await Guest.countDocuments({ rsvpStatus: 'maybe' });
    const declined = await Guest.countDocuments({ rsvpStatus: 'declined' });
    const pending = await Guest.countDocuments({ rsvpStatus: 'pending' });
    const responded = confirmed + maybe + declined;
    const responseRate = totalGuests > 0 ? ((responded / totalGuests) * 100).toFixed(1) : '0';

    const rsvpBy = getRsvpByDate();

    const eventStats = await Guest.aggregate([
      { $match: { rsvpStatus: { $in: ['confirmed', 'maybe'] } } },
      { $unwind: '$events' },
      { $group: { _id: '$events', count: { $sum: 1 } } }
    ]);
    const eventCounts: Record<string, number> = {};
    eventStats.forEach((stat: { _id: string; count: number }) => {
      eventCounts[stat._id] = stat.count;
    });

    const groupAgg = await Guest.aggregate([
      { $group: { _id: '$groupId', statuses: { $push: '$rsvpStatus' }, count: { $sum: 1 } } }
    ]);
    let groupsWithResponse = 0;
    let groupsFullyDeclined = 0;
    let groupsMixed = 0;
    for (const g of groupAgg) {
      const statuses = g.statuses as string[];
      const hasResponded = statuses.some((s) => s !== 'pending');
      const allDeclined = statuses.every((s) => s === 'declined');
      const hasConfirmedOrMaybe = statuses.some((s) => s === 'confirmed' || s === 'maybe');
      const hasDeclined = statuses.some((s) => s === 'declined');
      if (hasResponded) groupsWithResponse++;
      if (allDeclined && statuses.length > 0) groupsFullyDeclined++;
      if (hasConfirmedOrMaybe && hasDeclined) groupsMixed++;
    }

    const plusOneTotal = await Guest.countDocuments({ allowedPlusOne: true });
    const plusOneWithGuest = await Guest.countDocuments({
      allowedPlusOne: true,
      'plusOne.name': { $exists: true, $regex: /\S/ }
    });

    const dietaryCount = await Guest.countDocuments({
      dietaryRestrictions: { $exists: true, $regex: /\S/ }
    });

    const hasBookedCount = await Guest.countDocuments({ hasBooked: true });

    enrichWideEvent(res, {
      business: {
        operation: 'admin_stats',
        guest_count: totalGuests,
        group_count: totalGroups,
        confirmed,
        declined,
        pending,
        response_rate: responseRate,
      },
    });

    res.json({
      total: totalGuests,
      totalGroups,
      confirmed,
      maybe,
      declined,
      pending,
      responseRate,
      rsvpOpen: isRsvpOpen(),
      rsvpByDate: rsvpBy ? rsvpBy.toISOString().slice(0, 10) : null,
      eventCounts,
      groupsWithResponse,
      groupsWithoutResponse: totalGroups - groupsWithResponse,
      groupsFullyDeclined,
      groupsMixed,
      plusOneAllowed: plusOneTotal,
      plusOneWithGuest,
      plusOneComingAlone: plusOneTotal - plusOneWithGuest,
      dietaryCount,
      hasBookedCount
    });
  } catch (error) {
    log.error({ err: error }, 'Get stats error');
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
};

export const sendRsvpReminderHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { guestIds } = req.body as { guestIds: string[] };
    const result = await sendRsvpReminder(guestIds);

    enrichWideEvent(res, {
      business: {
        operation: 'send_rsvp_reminder',
        reminder_type: 'rsvp',
        guest_count: guestIds.length,
        sent: result.sent,
        skipped: result.skipped,
      },
    });

    res.json(result);
  } catch (error) {
    log.error({ err: error }, 'Send RSVP reminder error');
    res.status(500).json({
      sent: 0,
      skipped: 0,
      errors: [{ guestId: '', name: '', email: '', reason: error instanceof Error ? error.message : 'Failed to send RSVP reminders' }]
    });
  }
};

export const sendTravelReminderHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { guestIds } = req.body as { guestIds: string[] };
    const result = await sendTravelReminder(guestIds);

    enrichWideEvent(res, {
      business: {
        operation: 'send_travel_reminder',
        reminder_type: 'travel',
        guest_count: guestIds.length,
        sent: result.sent,
        skipped: result.skipped,
      },
    });

    res.json(result);
  } catch (error) {
    log.error({ err: error }, 'Send travel reminder error');
    res.status(500).json({
      sent: 0,
      skipped: 0,
      errors: [{ guestId: '', name: '', email: '', reason: error instanceof Error ? error.message : 'Failed to send travel reminders' }]
    });
  }
};
