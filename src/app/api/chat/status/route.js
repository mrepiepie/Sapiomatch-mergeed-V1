import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const hasServerKey = !!(apiKey && apiKey !== 'your_gemini_api_key_here');
    return NextResponse.json({ hasServerKey });
  } catch (err) {
    console.error('Error in chat status API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
