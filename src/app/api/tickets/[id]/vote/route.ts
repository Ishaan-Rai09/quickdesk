import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { getCurrentUser, extractTokenFromRequest, verifyToken } from '@/lib/auth';

// Vote on a ticket
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;

  // Check authentication
  let user = null;
  
  // Try Clerk auth first
  try {
    const clerkUser = await getCurrentUser();
    if (clerkUser) {
      user = clerkUser;
    }
  } catch (error) {
    // Try token auth
    const token = extractTokenFromRequest(request);
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        user = payload;
      }
    }
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { voteType } = await request.json();
    
    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid vote type'
      }, { status: 400 });
    }

    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 });
    }

    // Initialize votes if they don't exist
    if (!ticket.votes) {
      ticket.votes = { upvotes: 0, downvotes: 0 };
    }

    // Remove previous vote if exists
    if (ticket.votes.userVote === 'up') {
      ticket.votes.upvotes = Math.max(0, ticket.votes.upvotes - 1);
    } else if (ticket.votes.userVote === 'down') {
      ticket.votes.downvotes = Math.max(0, ticket.votes.downvotes - 1);
    }

    // Add new vote if different from previous
    if (ticket.votes.userVote !== voteType) {
      if (voteType === 'up') {
        ticket.votes.upvotes += 1;
      } else {
        ticket.votes.downvotes += 1;
      }
      ticket.votes.userVote = voteType;
    } else {
      // Remove vote if clicking same vote type
      ticket.votes.userVote = undefined;
    }

    await ticket.save();

    return NextResponse.json({
      success: true,
      votes: ticket.votes,
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Voting error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to record vote'
    }, { status: 500 });
  }
}
