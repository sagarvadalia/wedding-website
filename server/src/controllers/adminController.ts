import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Guest from '../models/Guest.js';
import Group from '../models/Group.js';
import { getRsvpByDate, isRsvpOpen } from '../config.js';

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
    console.error('Get all guests error:', error);
    res.status(500).json({ error: 'Failed to retrieve guests' });
  }
};

export const addGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, groupId, allowedPlusOne, hasBooked } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !groupId) {
      res.status(400).json({ error: 'firstName, lastName, email, and groupId are required' });
      return;
    }

    const existingGuest = await Guest.findOne({ email: email.trim().toLowerCase() });
    if (existingGuest) {
      res.status(400).json({ error: 'Guest with this email already exists' });
      return;
    }

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(400).json({ error: 'Group not found' });
      return;
    }

    const guest = new Guest({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      groupId: new mongoose.Types.ObjectId(groupId),
      allowedPlusOne: allowedPlusOne ?? false,
      hasBooked: hasBooked ?? false,
      rsvpStatus: 'pending',
      events: []
    });

    await guest.save();

    const populated = await Guest.findById(guest._id).populate('groupId', 'name').lean();
    res.status(201).json({
      success: true,
      message: 'Guest added successfully',
      guest: populated
    });
  } catch (error) {
    console.error('Add guest error:', error);
    res.status(500).json({ error: 'Failed to add guest' });
  }
};

export const updateGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, groupId, allowedPlusOne, hasBooked } = req.body;

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

    await guest.save();
    const populated = await Guest.findById(guest._id).populate('groupId', 'name').lean();
    res.json({
      success: true,
      message: 'Guest updated successfully',
      guest: populated
    });
  } catch (error) {
    console.error('Update guest error:', error);
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
    console.error('Delete guest error:', error);
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
    console.error('Get all groups error:', error);
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
    console.error('Get group error:', error);
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
    console.error('Create group error:', error);
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
    console.error('Update group error:', error);
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
    console.error('Delete group error:', error);
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
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
};
