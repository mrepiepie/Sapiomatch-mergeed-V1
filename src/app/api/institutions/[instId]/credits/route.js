import { NextResponse } from 'next/server';
import { db } from '../../../../../services/db';

export async function POST(request, { params }) {
  try {
    const { instId } = await params;
    if (!instId) {
      return NextResponse.json({ error: "Institution ID is required." }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    let amountStr = searchParams.get('amount');
    
    if (!amountStr) {
      // Try body
      try {
        const body = await request.json();
        amountStr = body.amount;
      } catch (e) {
        // No body or invalid json
      }
    }

    const amount = parseFloat(amountStr || 0);
    if (isNaN(amount) || amount === 0) {
      return NextResponse.json({ error: "Valid amount is required." }, { status: 400 });
    }

    const newBalance = db.updateInstitutionCredits(instId, amount);
    if (newBalance === false) {
      return NextResponse.json({ error: "Failed to update credits. Institution not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Credits updated successfully.",
      new_balance: newBalance
    });
  } catch (err) {
    console.error('[SapioMatch API] Error in POST credits route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
