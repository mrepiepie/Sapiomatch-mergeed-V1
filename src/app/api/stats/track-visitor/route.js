import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';

export async function POST() {
  try {
    db.incrementStat("total_visitors", 1);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Learnova API] Error in track-visitor API:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
