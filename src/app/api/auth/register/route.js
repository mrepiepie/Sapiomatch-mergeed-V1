import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';
import { checkRateLimit } from '../../../../services/rateLimiter';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Limit registrations: Max 5 per minute per IP
    if (!checkRateLimit(ip, 5)) {
      return NextResponse.json({ error: 'Too many registration requests. Please wait a minute before trying again.' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, password, contactNumber, role } = body;
    
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const existingUser = db.getUserByEmail(trimmedEmail);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 409 });
    }

    const newUser = db.addUser({
      name,
      email: trimmedEmail,
      password,
      contactNumber: contactNumber || '',
      role
    });

    return NextResponse.json({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      contactNumber: newUser.contactNumber,
      plan: newUser.plan,
      credits: newUser.credits
    });
  } catch (err) {
    console.error('Error in register api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
