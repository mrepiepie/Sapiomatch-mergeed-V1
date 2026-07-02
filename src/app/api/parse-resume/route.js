import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Standard simulation response
    return NextResponse.json({
      name: "Sanji",
      age: "24",
      education: "Bachelor's degree",
      field: "Law & Public Policy",
      goal: "Get promoted",
      format: "Hybrid",
      budget: "Low budget / affordable options only",
      experience: "3–5 years"
    });
  } catch (err) {
    console.error('[SapioMatch API] Error in parse-resume route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
