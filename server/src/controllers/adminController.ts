import { Request, Response } from 'express';
import Guest from '../models/Guest.js';
import crypto from 'crypto';

const generateInviteCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const getAllGuests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json(guests);
  } catch (error) {
    console.error('Get all guests error:', error);
    res.status(500).json({ error: 'Failed to retrieve guests' });
  }
};

export const addGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, allowedPlusOne } = req.body;
    
    // Check if guest already exists
    const existingGuest = await Guest.findOne({ email });
    if (existingGuest) {
      res.status(400).json({ error: 'Guest with this email already exists' });
      return;
    }
    
    const guest = new Guest({
      name,
      email,
      inviteCode: generateInviteCode(),
      allowedPlusOne: allowedPlusOne ?? false,
      rsvpStatus: 'pending',
      events: []
    });
    
    await guest.save();
    
    res.status(201).json({
      success: true,
      message: 'Guest added successfully',
      guest
    });
  } catch (error) {
    console.error('Add guest error:', error);
    res.status(500).json({ error: 'Failed to add guest' });
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

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalGuests = await Guest.countDocuments();
    const confirmed = await Guest.countDocuments({ rsvpStatus: 'confirmed' });
    const declined = await Guest.countDocuments({ rsvpStatus: 'declined' });
    const pending = await Guest.countDocuments({ rsvpStatus: 'pending' });
    
    // Count guests per event
    const eventStats = await Guest.aggregate([
      { $match: { rsvpStatus: 'confirmed' } },
      { $unwind: '$events' },
      { $group: { _id: '$events', count: { $sum: 1 } } }
    ]);
    
    const eventCounts: Record<string, number> = {};
    eventStats.forEach((stat: { _id: string; count: number }) => {
      eventCounts[stat._id] = stat.count;
    });
    
    res.json({
      total: totalGuests,
      confirmed,
      declined,
      pending,
      responseRate: totalGuests > 0 ? ((confirmed + declined) / totalGuests * 100).toFixed(1) : 0,
      eventCounts
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
};
