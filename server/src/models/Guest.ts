import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'welcome' | 'haldi' | 'mehndi' | 'baraat' | 'wedding' | 'cocktail' | 'reception';
export type RsvpStatus = 'pending' | 'confirmed' | 'declined';

export interface IGuest extends Document {
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
  rsvpStatus: RsvpStatus;
  rsvpDate: Date | null;
  allowedPlusOne: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  events: [{
    type: String,
    enum: ['welcome', 'haldi', 'mehndi', 'baraat', 'wedding', 'cocktail', 'reception']
  }],
  dietaryRestrictions: {
    type: String,
    default: ''
  },
  plusOne: {
    name: String,
    dietaryRestrictions: String
  },
  songRequest: {
    type: String,
    default: ''
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'declined'],
    default: 'pending',
    index: true
  },
  rsvpDate: {
    type: Date,
    default: null
  },
  allowedPlusOne: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for common queries: sorting guests by status and update time
GuestSchema.index({ rsvpStatus: 1, updatedAt: -1 });

// Export the model
const Guest = mongoose.model<IGuest>('Guest', GuestSchema);
export default Guest;
