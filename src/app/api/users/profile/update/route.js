import { NextResponse } from 'next/server';
import { db } from '../../../../../services/db';

export async function POST(request) {
  try {
    const { id, email, phone, password, plan, credits } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const users = db.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const updates = {};

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== user.email.toLowerCase()) {
        const existing = db.getUserByEmail(cleanEmail);
        if (existing) {
          return NextResponse.json({ error: "Email is already in use by another account." }, { status: 400 });
        }
      }
      updates.email = cleanEmail;
    }

    if (phone !== undefined) {
      updates.contactNumber = phone.trim();
    }

    if (password && password.trim()) {
      updates.password = password.trim();
    }

    if (plan !== undefined) {
      updates.plan = plan;
    }

    if (credits !== undefined) {
      updates.credits = Number(credits);
    }

    const updatedUser = db.updateUser(user.email, updates);
    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.contactNumber,
        role: updatedUser.role,
        plan: updatedUser.plan,
        credits: updatedUser.credits
      }
    });
  } catch (err) {
    console.error('[Learnova API] Error in profile update API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
