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

    // Simple hardcoded authentication - no database required
    let userRole = null;
    let userInfo = null;

    // Check for agent credentials
    if (email === 'agent@quickdesk.com' && password === 'agent123') {
      userRole = 'agent';
      userInfo = {
        id: 'agent-1',
        email: 'agent@quickdesk.com',
        firstName: 'Support',
        lastName: 'Agent',
        role: 'agent'
      };
    }
    // Check for admin credentials
    else if (email === 'admin@quickdesk.com' && password === 'admin123') {
      userRole = 'admin';
      userInfo = {
        id: 'admin-1',
        email: 'admin@quickdesk.com',
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin'
      };
    }
    else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

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
