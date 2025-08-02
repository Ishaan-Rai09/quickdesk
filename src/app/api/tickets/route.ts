import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import Agent from '@/models/Agent';
import Category from '@/models/Category';
import { requireAuth, getCurrentUser, extractTokenFromRequest, extractTokenFromCookies, verifyToken } from '@/lib/auth';
import { TicketFilters, SortOption } from '@/types';

// Get tickets with filtering, sorting, and pagination
export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // Build query based on filters
  const query: any = {};

  // Status filter
  const status = searchParams.get('status');
  if (status) {
    query.status = { $in: status.split(',') };
  }

  // Priority filter
  const priority = searchParams.get('priority');
  if (priority) {
    query.priority = { $in: priority.split(',') };
  }

  // Category filter
  const category = searchParams.get('category');
  if (category) {
    query.category = { $in: category.split(',') };
  }

  // Search filter
  const search = searchParams.get('search');
  if (search) {
    query.$or = [
      { subject: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { ticketNumber: { $regex: search, $options: 'i' } }
    ];
  }

  // Check if this is an agent requesting all tickets
  const allTickets = searchParams.get('allTickets');
  const token = extractTokenFromRequest(request);
  
  if (allTickets === 'true' && token) {
    // This is an agent - don't filter by user
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    // User-specific filter (for end users)
    const clerkUser = await getCurrentUser();
    if (clerkUser) {
      query['user.id'] = clerkUser.id;
    }
  }

  // Assigned agent filter
  const assignedTo = searchParams.get('assignedTo');
  if (assignedTo) {
    query['assignedTo.id'] = assignedTo;
  }

  // Date range filter
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  // Sorting
  const sortField = searchParams.get('sortField') || 'lastActivity';
  const sortDirection = searchParams.get('sortDirection') || 'desc';
  const sort: any = {};
  sort[sortField] = sortDirection === 'asc' ? 1 : -1;

  try {
    const tickets = await Ticket.find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tickets'
    }, { status: 500 });
  }
}

// Create new ticket
export async function POST(request: NextRequest) {
  await dbConnect();

  // Check authentication - either Clerk user or agent/admin token
  let user = null;
  let userRole = 'user';
  
  // Try Clerk auth first (for end users)
  try {
    const clerkUser = await getCurrentUser();
    if (clerkUser) {
      user = {
        id: clerkUser.id,
        name: 'User', // Get from Clerk profile if available
        email: 'user@example.com', // Get from Clerk profile if available
        avatar: ''
      };
    }
  } catch (error) {
    console.log('Clerk auth failed, checking for token auth');
  }

  // If Clerk auth failed, check for agent/admin token
  if (!user) {
    const token = extractTokenFromRequest(request) || extractTokenFromCookies(request);
    if (token) {
      const payload = verifyToken(token);
      if (payload && (payload.role === 'agent' || payload.role === 'admin')) {
        user = {
          id: payload.id,
          name: payload.email.split('@')[0],
          email: payload.email,
          avatar: ''
        };
        userRole = payload.role;
      }
    }
  }

  // For development/demo, create a fallback user if no auth is found
  if (!user) {
    user = {
      id: 'demo-user-' + Date.now(),
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: ''
    };
  }

  const { question, description, tags, priority = 'medium', category } = await request.json();

  // Validate required fields
  if (!question || !description) {
    return NextResponse.json({
      success: false,
      error: 'Question and description are required'
    }, { status: 400 });
  }

  try {
    // Generate ticket number
    let ticketNumber = 'QD-000001'; // Default first ticket
    try {
      const lastTicket = await Ticket.findOne().sort({ createdAt: -1 }).lean();
      if (lastTicket && lastTicket.ticketNumber) {
        // Extract number from ticketNumber (format: QD-XXXXXX)
        const match = lastTicket.ticketNumber.match(/QD-(\d+)/);
        if (match) {
          const nextNumber = parseInt(match[1]) + 1;
          ticketNumber = `QD-${String(nextNumber).padStart(6, '0')}`;
        }
      }
    } catch (error) {
      console.error('Error getting last ticket number:', error);
      // Use timestamp-based fallback
      ticketNumber = `QD-${Date.now()}`;
    }

    // Get category if provided
    let categoryDoc = null;
    if (category) {
      categoryDoc = await Category.findById(category);
    }

    const ticket = new Ticket({
      ticketNumber,
      subject: question,
      description,
      priority,
      category: categoryDoc?._id,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      user
    });

    await ticket.save();

    // Populate category for response
    await ticket.populate('category');

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Ticket creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create ticket'
    }, { status: 500 });
  }
}
