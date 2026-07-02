import { NextResponse } from 'next/server';
import { db } from '../../../../../../services/db';

export async function POST(request, { params }) {
  try {
    const { institutionId } = await params;
    if (!institutionId) {
      return NextResponse.json({ error: "Institution ID is required." }, { status: 400 });
    }
    const { optional_sections } = await request.json();
    db.updateFormTemplate(institutionId, optional_sections || []);
    return NextResponse.json({ success: true, message: "Form updated successfully." });
  } catch (err) {
    console.error('[SapioMatch API] Error in POST templates update route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
