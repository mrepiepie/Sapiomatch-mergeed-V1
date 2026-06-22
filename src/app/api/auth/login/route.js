import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = db.getUserByEmail(email);
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
