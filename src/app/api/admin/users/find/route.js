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
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Account detected successfully.",
      user: {
        email: user.email,
        phone: user.contactNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[SapioMatch API] Error in admin find user route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
