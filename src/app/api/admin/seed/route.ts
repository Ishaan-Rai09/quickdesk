import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Create default admin user
    const adminPassword = 'Admin@123456';
    const adminHashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const defaultAdmin = {
      clerkId: 'admin_default_001',
      email: 'admin@quickdesk.com',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true,
      notificationSettings: {
        email: true,
        sms: false
      }
    };

    // Create default agent user
    const agentPassword = 'Agent@123456';
    const agentHashedPassword = await bcrypt.hash(agentPassword, 12);
    
    const defaultAgent = {
      clerkId: 'agent_default_001',
      email: 'agent@quickdesk.com',
      firstName: 'Support',
      lastName: 'Agent',
      role: 'agent',
      isActive: true,
      notificationSettings: {
        email: true,
        sms: false
      }
    };

    // Check if users already exist
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    const existingAgent = await User.findOne({ email: defaultAgent.email });

    const results = [];

    if (!existingAdmin) {
      const admin = await User.create(defaultAdmin);
      results.push({
        type: 'admin',
        email: admin.email,
        password: adminPassword,
        created: true
      });
    } else {
      results.push({
        type: 'admin',
        email: existingAdmin.email,
        created: false,
        message: 'Admin already exists'
      });
    }

    if (!existingAgent) {
      const agent = await User.create(defaultAgent);
      results.push({
        type: 'agent',
        email: agent.email,
        password: agentPassword,
        created: true
      });
    } else {
      results.push({
        type: 'agent',
        email: existingAgent.email,
        created: false,
        message: 'Agent already exists'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Default users seed completed',
      data: results
    });

  } catch (error) {
    console.error('Seed default users error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed default users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
