import { NextResponse } from 'next/server';
import { db } from '../../../services/db';

export async function GET(request) {
  try {
    const list = db.getUsers();
    // Map to safe public user data (excluding passwords for security best practices)
    const safeList = list.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      contactNumber: u.contactNumber,
      plan: u.plan,
      credits: u.credits,
      universityName: u.universityName || ''
    }));
    return NextResponse.json(safeList);
  } catch (err) {
    console.error('Error in GET users api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    db.deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE user api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, updates } = body;

    if (!email) {
      return NextResponse.json({ error: 'User email is required.' }, { status: 400 });
    }

    const updatedUser = db.updateUser(email, updates);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error in PUT user api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
