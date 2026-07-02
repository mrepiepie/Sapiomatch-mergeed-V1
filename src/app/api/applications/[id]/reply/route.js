import { NextResponse } from 'next/server';
import { db } from '../../../../../services/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { replyText, meetingLink, meetingDate, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required.' }, { status: 400 });
    }

    let updatedApp = null;

    if (replyText || meetingLink || meetingDate) {
      updatedApp = db.updateApplicationReply(id, replyText || '', meetingLink || '', meetingDate || '');
    }

    if (status) {
      updatedApp = db.updateApplicationStatus(id, status);
    }

    if (!updatedApp) {
      return NextResponse.json({ error: 'Application not found or update failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (err) {
    console.error('Error in application reply api:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
