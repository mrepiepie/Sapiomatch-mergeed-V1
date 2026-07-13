import { NextResponse } from 'next/server';
import { db } from '../../../services/db';
import { checkRateLimit } from '../../../services/rateLimiter';

// GET all contacts
export async function GET(request) {
  try {
    const list = db.getContacts();
    return NextResponse.json(list);
  } catch (err) {
    console.error('Error in GET contact API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST create contact
export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Limit contact inquiries: Max 5 per minute per IP
    if (!checkRateLimit(ip, 5)) {
      return NextResponse.json({ error: 'Too many contact messages. Please wait a minute before trying again.' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const { fullName, email, phone, inquiryType, message } = body;

    if (!fullName || !email || !inquiryType || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const newContact = db.addContact({
      fullName,
      email,
      phone: phone || '',
      inquiryType,
      message
    });

    return NextResponse.json({ success: true, contact: newContact }, { status: 201 });
  } catch (err) {
    console.error('Error in POST contact API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// DELETE contact
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID is required.' }, { status: 400 });
    }

    const deleted = db.deleteContact(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE contact API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
