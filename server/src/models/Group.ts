import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

const Group = mongoose.model<IGroup>('Group', GroupSchema);
export default Group;
