import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

// Get all users (admin only)
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Check admin authentication
    const authResult = await requireAuth(request, ['admin']);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return mock user data since we don't have a proper user model yet
    // In a real app, you would fetch from the database
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        active: true,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2', 
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        active: true,
        createdAt: new Date('2024-01-20'),
      },
      {
        id: '3',
        name: 'Support Agent',
        email: 'agent@quickdesk.com',
        role: 'agent',
        active: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '4',
        name: 'System Admin',
        email: 'admin@quickdesk.com',
        role: 'admin',
        active: true,
        createdAt: new Date('2024-01-01'),
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockUsers
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 });
  }
}
