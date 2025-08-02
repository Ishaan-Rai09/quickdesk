import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { hashPassword, verifyPassword, generateAgentToken, requireAuth, UserRole } from '@/lib/auth';

// Register a new agent
export async function POST(request: NextRequest) {
  await dbConnect();

  const { email, firstName, lastName, password } = await request.json();

  // Check if agent already exists
  const existingAgent = await Agent.findOne({ email });
  if (existingAgent) {
    return NextResponse.json({ error: 'Agent already exists' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const agent = new Agent({ email, firstName, lastName, passwordHash });
  await agent.save();

  return NextResponse.json({ message: 'Agent registered successfully' }, { status: 201 });
}

// Agent login
export async function PUT(request: NextRequest) {
  await dbConnect();

  const { email, password } = await request.json();

  const agent = await Agent.findOne({ email });
  if (!agent) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isValidPassword = await verifyPassword(password, agent.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateAgentToken({ id: agent.id, email: agent.email, role: 'agent' });
  return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
}

// Get all agents (Admin only)
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin']);

  if (!authResult || authResult.type !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await dbConnect();

  const agents = await Agent.find();
  return NextResponse.json({ agents }, { status: 200 });
}

// Middleware for protected routes
export async function requireAgentAuth(request: NextRequest) {
  return requireAuth(request, ['agent']);
}

