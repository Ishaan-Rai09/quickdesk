import mongoose, { Schema, Document } from 'mongoose';
import { Agent } from '@/types';

export interface IAgent extends Omit<Agent, '_id'>, Document {}

const AgentSchema = new Schema<IAgent>(
  {
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
      default: 'agent',
      enum: ['agent'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// Note: email index is created by unique: true above
AgentSchema.index({ isActive: 1 });

export default mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
