import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';

export async function POST(request) {
  try {
    const { name, email, password, contactNumber, role } = await request.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required.' }, { status: 400 });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 409 });
    }

    const newUser = db.addUser({
      name,
      email,
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
