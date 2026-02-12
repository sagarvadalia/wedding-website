import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'welcome' | 'haldi' | 'mehndi' | 'baraat' | 'wedding' | 'cocktail' | 'reception';
export type RsvpStatus = 'pending' | 'confirmed' | 'maybe' | 'declined';

export interface IGuest extends Document {
  firstName: string;
  lastName: string;
  email: string;
  groupId: mongoose.Types.ObjectId;
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
  firstName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
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
    enum: ['pending', 'confirmed', 'maybe', 'declined'],
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

GuestSchema.index({ firstName: 1, lastName: 1 });
GuestSchema.index({ rsvpStatus: 1, updatedAt: -1 });

const Guest = mongoose.model<IGuest>('Guest', GuestSchema);
export default Guest;
