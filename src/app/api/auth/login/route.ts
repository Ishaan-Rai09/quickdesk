import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Agent from '@/models/Agent';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database for real authentication
    await dbConnect();
    
    let userRole = null;
    let userInfo = null;

    // Auto-create users for development if they don't exist
    const totalUsers = await User.countDocuments();
    const totalAgents = await Agent.countDocuments();
    
    if (totalUsers === 0 && totalAgents === 0) {
      console.log('No users found, creating default users...');
      
      // Create default admin
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
      await User.create(defaultAdmin);
      console.log('Created default admin user');
      
      // Create default agent
      const agentPassword = 'agent123';
      const agentHashedPassword = await bcrypt.hash(agentPassword, 12);
      const defaultAgentData = {
        email: 'agent@quickdesk.com',
        firstName: 'Support',
        lastName: 'Agent',
        passwordHash: agentHashedPassword,
        isActive: true
      };
      await Agent.create(defaultAgentData);
      console.log('Created default agent user');
    }

    // First, check if it's an agent
    console.log('Checking for agent with email:', email.toLowerCase());
    const agent = await Agent.findOne({ email: email.toLowerCase() });
    console.log('Agent found:', !!agent);
    
    if (agent) {
      console.log('Agent details:', { email: agent.email, isActive: agent.isActive });
      const isValidPassword = await bcrypt.compare(password, agent.passwordHash);
      console.log('Password valid for agent:', isValidPassword);
      
      if (isValidPassword && agent.isActive) {
        console.log('Agent login successful');
        userRole = 'agent';
        userInfo = {
          id: agent._id.toString(),
          email: agent.email,
          firstName: agent.firstName,
          lastName: agent.lastName,
          role: 'agent'
        };
      }
    }
    
    // If not an agent, check if it's an admin user
    if (!userInfo) {
      console.log('Checking for admin user with email:', email.toLowerCase());
      const user = await User.findOne({ email: email.toLowerCase() });
      console.log('Admin user found:', !!user);
      
      if (user) {
        console.log('Admin user details:', { email: user.email, role: user.role, isActive: user.isActive });
        
        if (user.role === 'admin' && user.isActive) {
          console.log('Checking admin password. Expected: Admin@123456, Received:', password);
          // For admin users, we don't store password hash in User model
          // We'll check against the default admin password for now
          // In production, you might want to implement proper password hashing for admin users too
          if (password === 'Admin@123456') {
            console.log('Admin login successful');
            userRole = 'admin';
            userInfo = {
              id: user._id.toString(),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: 'admin'
            };
          } else {
            console.log('Admin password mismatch');
          }
        }
      }
    }
    
    if (!userInfo) {
      console.log('Login failed - no valid user found');
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('Login successful for:', userInfo.email, 'Role:', userRole);

    // Create JWT token
    const token = jwt.sign(
      { 
        id: userInfo.id,
        email: userInfo.email,
        role: userRole
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Create response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userInfo
      }
    });

    // Set httpOnly cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
