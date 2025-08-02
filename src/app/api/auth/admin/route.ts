import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, generateAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateAdminToken({ id: 'admin', email, role: 'admin' });
  
  return NextResponse.json({ 
    message: 'Admin login successful', 
    token,
    user: {
      id: 'admin',
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    }
  }, { status: 200 });
}
