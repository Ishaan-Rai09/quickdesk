import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import Agent from '@/models/Agent';
import { requireAuth, getCurrentUser } from '@/lib/auth';

// Get single ticket by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;

  try {
    const ticket = await Ticket.findById(id).populate('category');
    
    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch ticket'
    }, { status: 500 });
  }
}

// Update ticket (Agents and Admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request, ['agent', 'admin']);
  
  if (!authResult) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = await context.params;

  const { status, priority, assignedToId, subject, description } = await request.json();

  try {
    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 });
    }

    const updateData: any = {};
    
    if (status !== undefined) {
      // Add status history
      if (status !== ticket.status) {
        ticket.statusHistory.push({
          from: ticket.status,
          to: status,
          updatedBy: {
            id: authResult.user.id,
            name: authResult.type === 'admin' ? 'Admin User' : `${authResult.user.email}`,
            email: authResult.user.email,
            role: authResult.type
          }
        });
      }
      updateData.status = status;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (subject !== undefined) {
      updateData.subject = subject;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (assignedToId !== undefined) {
      if (assignedToId) {
        const agent = await Agent.findById(assignedToId);
        if (!agent) {
          return NextResponse.json({
            success: false,
            error: 'Agent not found'
          }, { status: 400 });
        }
        updateData.assignedTo = {
          id: agent._id.toString(),
          name: `${agent.firstName} ${agent.lastName}`,
          email: agent.email,
          avatar: agent.avatar
        };
      } else {
        updateData.assignedTo = null;
      }
    }

    // Update the ticket
    Object.assign(ticket, updateData);
    await ticket.save();
    await ticket.populate('category');

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    console.error('Ticket update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update ticket'
    }, { status: 500 });
  }
}

// Delete ticket (Admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request, ['admin']);
  
  if (!authResult) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = await context.params;

  try {
    const ticket = await Ticket.findByIdAndDelete(id);
    
    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete ticket'
    }, { status: 500 });
  }
}
