export interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'agent' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  notificationSettings: {
    email: boolean;
    sms: boolean;
  };
}

export interface Agent {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'agent';
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin';
  isActive: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'agent' | 'admin';
    avatar?: string;
  };
  attachments?: Attachment[];
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusUpdate {
  _id: string;
  from: TicketStatus;
  to: TicketStatus;
  updatedBy: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'agent' | 'admin';
  };
  createdAt: Date;
}

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: Category;
  tags: string[];
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  attachments: Attachment[];
  comments: Comment[];
  statusHistory: StatusUpdate[];
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
  };
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  averageResponseTime: number;
  userSatisfactionRate: number;
}

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: string[];
  assignedTo?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface SortOption {
  field: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'lastActivity';
  direction: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  categoryId: string;
  priority: TicketPriority;
  attachments?: File[];
}

export interface UpdateTicketData {
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  categoryId?: string;
  assignedToId?: string;
}

export interface CreateCommentData {
  content: string;
  isInternal?: boolean;
  attachments?: File[];
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  ticketUpdates: boolean;
  statusChanges: boolean;
  newComments: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  notificationSettings: NotificationSettings;
}
