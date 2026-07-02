import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';

export async function POST() {
  try {
    db.incrementStat("total_clicks", 1);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[SapioMatch API] Error in track-click API:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
