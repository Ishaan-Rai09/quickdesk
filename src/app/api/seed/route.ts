import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Agent from '@/models/Agent';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Check if data already exists
    const existingCategories = await Category.countDocuments();
    const existingAgents = await Agent.countDocuments();
    
    if (existingCategories > 0 && existingAgents > 0) {
      return NextResponse.json({
        success: true,
        message: 'Seed data already exists'
      });
    }

    // Create default categories
    const defaultCategories = [
      {
        name: 'Technical Support',
        description: 'Hardware and software technical issues',
        color: '#3B82F6'
      },
      {
        name: 'Billing',
        description: 'Billing and payment related queries',
        color: '#10B981'
      },
      {
        name: 'Account Management',
        description: 'Account settings and profile management',
        color: '#F59E0B'
      },
      {
        name: 'Bug Report',
        description: 'Report bugs and system issues',
        color: '#EF4444'
      },
      {
        name: 'Feature Request',
        description: 'Request new features and improvements',
        color: '#8B5CF6'
      },
      {
        name: 'General Inquiry',
        description: 'General questions and information',
        color: '#6B7280'
      }
    ];

    // Create categories if they don't exist
    if (existingCategories === 0) {
      await Category.insertMany(defaultCategories);
    }

    // Create demo agent if doesn't exist
    if (existingAgents === 0) {
      const passwordHash = await hashPassword('agent123');
      const demoAgent = new Agent({
        email: 'agent@quickdesk.com',
        firstName: 'Demo',
        lastName: 'Agent',
        passwordHash,
        isActive: true
      });
      await demoAgent.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Seed data created successfully',
      data: {
        categories: defaultCategories,
        agent: { email: 'agent@quickdesk.com', password: 'agent123' }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed categories'
    }, { status: 500 });
  }
}
