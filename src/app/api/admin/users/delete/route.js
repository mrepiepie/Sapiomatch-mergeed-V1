import { NextResponse } from 'next/server';
import { db } from '../../../../../services/db';

export async function POST(request) {
  try {
    const { email, mobile } = await request.json();
    if (!email || !mobile) {
      return NextResponse.json({ error: "Email and mobile are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(cleanEmail);
    
    if (!user || user.contactNumber !== mobile.trim()) {
      return NextResponse.json({ error: "Account not found with provided identifiers." }, { status: 404 });
    }

    db.deleteUser(user.id);
    return NextResponse.json({ success: true, message: "Account deletion confirmed." });
  } catch (err) {
    console.error('[Learnova API] Error in admin delete user route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
