import { NextResponse } from 'next/server';
import { db } from '../../../../../services/db';

export async function GET(request, { params }) {
  try {
    const { institutionId } = await params;
    if (!institutionId) {
      return NextResponse.json({ error: "Institution ID is required." }, { status: 400 });
    }
    const template = db.getFormTemplate(institutionId);
    return NextResponse.json(template);
  } catch (err) {
    console.error('[SapioMatch API] Error in GET templates route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
