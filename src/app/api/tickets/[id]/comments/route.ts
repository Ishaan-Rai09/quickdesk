import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { requireAuth, getCurrentUser } from '@/lib/auth';

// Add comment to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const { content, isInternal = false } = await request.json();

  if (!content) {
    return NextResponse.json({
      success: false,
      error: 'Comment content is required'
    }, { status: 400 });
  }

  try {
    // Check authentication - both users and agents can comment
    const clerkUser = await getCurrentUser();
    const authResult = await requireAuth(request, ['agent', 'admin']);
    
    let author: any;
    
    if (clerkUser) {
      // End user commenting
      author = {
        id: clerkUser.id,
        name: 'User', // Placeholder - in real app, get from Clerk API
        email: 'user@example.com', // Placeholder - in real app, get from Clerk API
        role: 'user',
        avatar: ''
      };
    } else if (authResult) {
      // Agent or admin commenting
      author = {
        id: authResult.user.id,
        name: authResult.type === 'admin' ? 'Admin User' : authResult.user.email,
        email: authResult.user.email,
        role: authResult.type,
        avatar: undefined
      };
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticket = await Ticket.findById(params.id);
    
    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 });
    }

    // Allow all authenticated users to comment on tickets (public discussion)

    // Add comment
    const comment = {
      content,
      author,
      isInternal: author.role !== 'user' ? isInternal : false, // Users can't create internal comments
      createdAt: new Date(),
      updatedAt: new Date()
    };

    ticket.comments.push(comment);
    await ticket.save();

    return NextResponse.json({
      success: true,
      data: comment,
      message: 'Comment added successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Comment creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add comment'
    }, { status: 500 });
  }
}

// Get comments for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const ticket = await Ticket.findById(params.id).select('comments');
    
    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 });
    }

    // Filter out internal comments for end users
    const clerkUser = await getCurrentUser();
    const authResult = await requireAuth(request, ['agent', 'admin']);
    
    let comments = ticket.comments;
    
    // If it's an end user, filter out internal comments
    if (clerkUser && !authResult) {
      comments = ticket.comments.filter(comment => !comment.isInternal);
    }

    return NextResponse.json({
      success: true,
      data: comments
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch comments'
    }, { status: 500 });
  }
}
