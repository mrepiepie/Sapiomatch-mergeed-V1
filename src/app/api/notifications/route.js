import { NextResponse } from 'next/server';
import { db } from '../../../services/db';

// GET notifications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
    }

    const notifications = db.getNotifications(email);
    return NextResponse.json(notifications);
  } catch (err) {
    console.error('Error in GET notifications API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST mark as read
export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    db.markNotificationsAsRead(email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in POST notifications API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
