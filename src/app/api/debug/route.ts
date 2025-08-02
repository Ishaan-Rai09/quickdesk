import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Agent from '@/models/Agent';

export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@quickdesk.com' });
    console.log('Admin user found:', adminUser ? 'Yes' : 'No');

    // Check if agent user exists
    const agentUser = await Agent.findOne({ email: 'agent@quickdesk.com' });
    console.log('Agent user found:', agentUser ? 'Yes' : 'No');

    // Get all users and agents count
    const userCount = await User.countDocuments();
    const agentCount = await Agent.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        database: 'Connected',
        adminExists: !!adminUser,
        agentExists: !!agentUser,
        userCount,
        agentCount,
        adminUser: adminUser ? {
          id: adminUser._id,
          email: adminUser.email,
          role: adminUser.role,
          isActive: adminUser.isActive
        } : null,
        agentUser: agentUser ? {
          id: agentUser._id,
          email: agentUser.email,
          isActive: agentUser.isActive
        } : null
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
