import { NextResponse } from 'next/server';
import { db } from '../../../services/db';

export async function GET(request) {
  try {
    const catalog = db.getCatalog();
    return NextResponse.json(catalog);
  } catch (err) {
    console.error('Error in GET catalog api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { countries, subjects } = body;

    if (!countries || !subjects) {
      return NextResponse.json({ error: 'Countries and Subjects lists are required.' }, { status: 400 });
    }

    const updatedCatalog = db.updateCatalog({ countries, subjects });
    return NextResponse.json({ success: true, catalog: updatedCatalog });
  } catch (err) {
    console.error('Error in POST catalog api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
