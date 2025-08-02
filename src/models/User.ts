import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@/types';

export interface IUser extends Omit<User, '_id'>, Document {}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'agent', 'admin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// Note: email index is created by unique: true above
// Note: clerkId index is created by index: true above

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
