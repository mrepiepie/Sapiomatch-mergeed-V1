import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';
import { checkRateLimit } from '../../../../services/rateLimiter';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Limit login attempts: Max 10 per minute per IP to prevent brute-forcing
    if (!checkRateLimit(ip, 10)) {
      return NextResponse.json({ error: 'Too many login attempts. Please wait a minute before trying again.' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(trimmedEmail);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      contactNumber: user.contactNumber,
      plan: user.plan,
      credits: user.credits,
      universityName: user.universityName || ''
    });
  } catch (err) {
    console.error('Error in login api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
