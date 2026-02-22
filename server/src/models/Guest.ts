import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'welcome' | 'haldi' | 'mehndi' | 'baraat' | 'wedding' | 'cocktail' | 'reception';
export type RsvpStatus = 'pending' | 'confirmed' | 'maybe' | 'declined';

export interface IMailingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

export interface IGuest extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  groupId: mongoose.Types.ObjectId;
  events: EventType[];
  dietaryRestrictions: string;
  plusOne: {
    name: string;
    dietaryRestrictions: string;
  } | null;
  songRequest: string;
  mailingAddress: IMailingAddress | null;
  rsvpStatus: RsvpStatus;
  rsvpDate: Date | null;
  allowedPlusOne: boolean;
  hasBooked: boolean;
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
    lowercase: true,
    trim: true,
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
  mailingAddress: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    stateOrProvince: String,
    postalCode: String,
    country: String
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
  },
  hasBooked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

GuestSchema.index({ firstName: 1, lastName: 1 });
GuestSchema.index({ rsvpStatus: 1, updatedAt: -1 });
GuestSchema.index({ email: 1 }, { unique: true, sparse: true });

const Guest = mongoose.model<IGuest>('Guest', GuestSchema);
export default Guest;
