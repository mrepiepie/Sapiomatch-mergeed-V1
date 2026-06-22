import { NextResponse } from 'next/server';
import { db } from '../../../services/db';

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
    const body = await request.json();
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
