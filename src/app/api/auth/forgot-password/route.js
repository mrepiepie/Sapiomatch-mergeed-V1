import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json({ error: "No account registered with this email address." }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: `A password reset link and instructions have been simulated and sent to ${cleanEmail}.`
    });
  } catch (err) {
    console.error('[SapioMatch API] Error in forgot-password API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
