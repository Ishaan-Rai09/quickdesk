import mongoose, { Schema, Document } from 'mongoose';
import { Ticket, TicketStatus, TicketPriority } from '@/types';

export interface ITicket extends Omit<Ticket, '_id'>, Document {}

// Subdocument schemas
const AttachmentSchema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'agent', 'admin'] },
    avatar: { type: String },
  },
  attachments: [AttachmentSchema],
  isInternal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const StatusUpdateSchema = new Schema({
  from: { type: String, required: true, enum: ['open', 'in-progress', 'resolved', 'closed'] },
  to: { type: String, required: true, enum: ['open', 'in-progress', 'resolved', 'closed'] },
  updatedBy: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'agent', 'admin'] },
  },
  createdAt: { type: Date, default: Date.now },
});

const TicketSchema = new Schema<ITicket>(
  {
    ticketNumber: {
      type: String,
      required: false,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String },
    },
    assignedTo: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
      avatar: { type: String },
    },
    attachments: [AttachmentSchema],
    comments: [CommentSchema],
    statusHistory: [StatusUpdateSchema],
    votes: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
      userVote: { type: String, enum: ['up', 'down'] },
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// Note: ticketNumber index is created by unique: true above
TicketSchema.index({ 'user.id': 1 });
TicketSchema.index({ 'assignedTo.id': 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ category: 1 });
TicketSchema.index({ lastActivity: -1 });
TicketSchema.index({ createdAt: -1 });

// Middleware to update lastActivity on save
TicketSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});


export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);
