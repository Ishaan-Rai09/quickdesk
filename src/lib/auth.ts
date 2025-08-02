import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export interface AgentTokenPayload {
  id: string;
  email: string;
  role: 'agent';
}

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: 'admin';
}

// Hash password for agents
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password for agents
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token for agents
export function generateAgentToken(payload: AgentTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Generate JWT token for admin
export function generateAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify JWT token
export function verifyToken(token: string): AgentTokenPayload | AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AgentTokenPayload | AdminTokenPayload;
  } catch (error) {
    return null;
  }
}

// Get current user from Clerk
export async function getCurrentUser() {
  try {
    const { userId } = auth();
    if (!userId) return null;
    
    // For API routes, we only get the userId, not the full user object
    // The full user object should be fetched on the client side
    return { id: userId };
  } catch (error) {
    return null;
  }
}

// Extract token from request headers
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Extract token from cookies
export function extractTokenFromCookies(request: NextRequest): string | null {
  const authToken = request.cookies.get('auth-token')?.value;
  const agentToken = request.cookies.get('agent-token')?.value;
  const adminToken = request.cookies.get('admin-token')?.value;
  return authToken || agentToken || adminToken || null;
}

// Admin credentials check (simulated)
export function validateAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@quickdesk.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  return email === adminEmail && password === adminPassword;
}

// Role-based access control
export type UserRole = 'user' | 'agent' | 'admin';

export function hasPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// Middleware helpers
export async function requireAuth(request: NextRequest, allowedRoles: UserRole[] = ['user', 'agent', 'admin']) {
  // Check for Clerk user (end users)
  const clerkUser = await getCurrentUser();
  if (clerkUser && allowedRoles.includes('user')) {
    return { type: 'user', user: clerkUser };
  }

  // Check for agent/admin token
  const token = extractTokenFromRequest(request) || extractTokenFromCookies(request);
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || !hasPermission(payload.role, allowedRoles)) {
    return null;
  }

  return { type: payload.role, user: payload };
}
