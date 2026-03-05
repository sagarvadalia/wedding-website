import mongoose, { Document, Schema } from 'mongoose';

export interface IGuestbookEntry extends Document {
  name: string;
  message: string;
  photo?: string;
  audioClip?: string;
  hasPhoto: boolean;
  hasAudioClip: boolean;
  createdAt: Date;
}

const GuestbookEntrySchema = new Schema<IGuestbookEntry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    photo: {
      type: String,
    },
    audioClip: {
      type: String,
    },
    hasPhoto: {
      type: Boolean,
      default: false,
    },
    hasAudioClip: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

GuestbookEntrySchema.pre('save', function () {
  this.hasPhoto = !!this.photo;
  this.hasAudioClip = !!this.audioClip;
});

GuestbookEntrySchema.index({ createdAt: -1 });

const GuestbookEntry = mongoose.model<IGuestbookEntry>('GuestbookEntry', GuestbookEntrySchema);
export default GuestbookEntry;
