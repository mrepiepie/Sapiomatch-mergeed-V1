import { NextResponse } from 'next/server';
import { db } from '../../../services/db';

// GET universities
export async function GET() {
  try {
    const list = db.getUniversities();
    return NextResponse.json(list);
  } catch (err) {
    console.error('Error in GET universities API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST create university partner
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const newUni = db.addUniversity({ name, email });
    return NextResponse.json({ success: true, university: newUni });
  } catch (err) {
    console.error('Error in POST universities API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
