import { NextResponse } from 'next/server';
import { getDynamicMatches } from '../../../services/matchEngine';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const answers = body.answers || body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: "Answers are required to match." }, { status: 400 });
    }

    const matches = getDynamicMatches(answers);
    return NextResponse.json({ success: true, matches });
  } catch (err) {
    console.error("[Learnova API Route] Error calculating matches:", err);
    return NextResponse.json({ error: "Internal server error calculating matches." }, { status: 500 });
  }
}
