import { NextResponse } from 'next/server';
import { db } from '../../../../../services/db';

export async function POST(request) {
  try {
    const { role, email, mobile } = await request.json();
    if (!role || !email || !mobile) {
      return NextResponse.json({ error: "Role, email, and mobile are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.getUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json({ error: "Account with this email already exists." }, { status: 400 });
    }

    db.addUser({
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      contactNumber: mobile.trim(),
      role: role.trim(),
      password: "password" // Default password
    });

    return NextResponse.json({ success: true, message: "Successfully added." });
  } catch (err) {
    console.error('[Learnova API] Error in admin add user route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
