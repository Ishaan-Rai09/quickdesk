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

    // Fetch real users data from the database
    const users = await User.find();

    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 });
  }
}
