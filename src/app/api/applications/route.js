import { NextResponse } from 'next/server';
import { db } from '../../../services/db';

// GET applications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const email = searchParams.get('email');
    const universityName = searchParams.get('universityName');

    const allApps = db.getApplications();

    if (role === 'Student') {
      const filtered = allApps.filter(app => app.studentEmail?.toLowerCase() === email?.toLowerCase());
      return NextResponse.json(filtered);
    } else if (role === 'University') {
      const filtered = allApps.filter(app => app.universityName?.toLowerCase() === universityName?.toLowerCase());
      return NextResponse.json(filtered);
    } else if (role === 'Admin') {
      return NextResponse.json(allApps);
    }

    return NextResponse.json({ error: 'Unauthorized or missing role parameter.' }, { status: 401 });
  } catch (err) {
    console.error('Error in GET applications API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST submit application
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      studentName,
      studentEmail,
      studentContact,
      cgpa,
      sop,
      universityName,
      courseName,
      counselorPreference,
      chatSlot
    } = body;

    if (!studentEmail || !universityName || !courseName) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Verify student credits
    const student = db.getUserByEmail(studentEmail);
    if (!student) {
      return NextResponse.json({ error: 'Student account not found.' }, { status: 404 });
    }

    if (student.role !== 'Admin' && student.credits < 2) {
      return NextResponse.json({ error: 'Insufficient credits. You need 2 credits to submit an application.' }, { status: 400 });
    }

    // Deduct credits (unless super admin doing a test submission)
    if (student.role !== 'Admin') {
      db.updateUser(studentEmail, { credits: Math.max(0, student.credits - 2) });
    }

    const newApp = db.addApplication({
      studentName: studentName || student.name,
      studentEmail,
      studentContact: studentContact || student.contactNumber,
      cgpa: cgpa || '',
      sop: sop || '',
      universityName,
      courseName,
      counselorPreference: counselorPreference || 'No Counselor',
      chatSlot: chatSlot || '',
      status: 'Under Review'
    });

    return NextResponse.json({
      success: true,
      application: newApp,
      creditsRemaining: student.credits - (student.role !== 'Admin' ? 2 : 0)
    });
  } catch (err) {
    console.error('Error in POST application API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
