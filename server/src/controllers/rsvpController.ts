import { Request, Response } from 'express';
import Guest from '../models/Guest.js';

export const submitRsvp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { inviteCode, attending, events, dietaryRestrictions, plusOne, songRequest } = req.body;
    
    const guest = await Guest.findOne({ inviteCode: inviteCode.toUpperCase() });
    
    if (!guest) {
      res.status(404).json({ error: 'Invite code not found' });
      return;
    }
    
    guest.rsvpStatus = attending ? 'confirmed' : 'declined';
    guest.events = events ?? [];
    guest.dietaryRestrictions = dietaryRestrictions ?? '';
    guest.plusOne = plusOne ?? null;
    guest.songRequest = songRequest ?? '';
    guest.rsvpDate = new Date();
    
    await guest.save();
    
    res.json({ 
      success: true, 
      message: 'RSVP submitted successfully',
      guest: {
        name: guest.name,
        email: guest.email,
        events: guest.events,
        rsvpStatus: guest.rsvpStatus
      }
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
};

export const getRsvpByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.params.code;
    
    if (!code) {
      res.status(400).json({ error: 'Invite code is required' });
      return;
    }
    
    const guest = await Guest.findOne({ inviteCode: code.toUpperCase() });
    
    if (!guest) {
      res.status(404).json({ error: 'Invite code not found' });
      return;
    }
    
    res.json({
      name: guest.name,
      email: guest.email,
      events: guest.events,
      dietaryRestrictions: guest.dietaryRestrictions,
      plusOne: guest.plusOne,
      songRequest: guest.songRequest,
      rsvpStatus: guest.rsvpStatus,
      allowedPlusOne: guest.allowedPlusOne
    });
  } catch (error) {
    console.error('Get RSVP error:', error);
    res.status(500).json({ error: 'Failed to retrieve RSVP' });
  }
};

export const updateRsvp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { attending, events, dietaryRestrictions, plusOne, songRequest } = req.body;
    
    const guest = await Guest.findById(id);
    
    if (!guest) {
      res.status(404).json({ error: 'Guest not found' });
      return;
    }
    
    guest.rsvpStatus = attending ? 'confirmed' : 'declined';
    if (events) guest.events = events;
    if (dietaryRestrictions !== undefined) guest.dietaryRestrictions = dietaryRestrictions;
    if (plusOne !== undefined) guest.plusOne = plusOne;
    if (songRequest !== undefined) guest.songRequest = songRequest;
    
    await guest.save();
    
    res.json({ 
      success: true, 
      message: 'RSVP updated successfully',
      guest
    });
  } catch (error) {
    console.error('Update RSVP error:', error);
    res.status(500).json({ error: 'Failed to update RSVP' });
  }
};
