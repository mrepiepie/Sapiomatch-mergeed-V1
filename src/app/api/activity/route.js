import { NextResponse } from 'next/server';
import { db } from '../../../services/db';

export async function GET(request) {
  try {
    const users = db.getUsers() || [];
    const applications = db.getApplications() || [];
    const contacts = db.getContacts() || [];
    const aiInteractions = db.getAiInteractions() || [];

    // Map each record to an activity log format
    const userLogs = users.map(u => {
      const ts = u.id.startsWith('usr_') && !['usr_1', 'usr_2', 'usr_3', 'usr_4'].includes(u.id)
        ? parseInt(u.id.split('_')[1])
        : new Date("2026-06-13").getTime();
      return {
        id: u.id,
        type: 'auth',
        text: u.role === 'Student'
          ? `New student account registered: ${u.email}`
          : `New university partner portal registered: ${u.universityName || u.name} (${u.email})`,
        timestamp: ts
      };
    });

    const appLogs = applications.map(a => {
      const ts = a.id.startsWith('app_') && a.id !== 'app_1'
        ? parseInt(a.id.split('_')[1])
        : new Date(a.date || "2026-06-13").getTime();
      return {
        id: a.id,
        type: 'application',
        text: `${a.studentName} submitted application for ${a.courseName} at ${a.universityName}`,
        timestamp: ts
      };
    });

    const contactLogs = contacts.map(c => {
      const ts = c.id.startsWith('con_') && c.id !== 'con_1'
        ? parseInt(c.id.split('_')[1])
        : new Date(c.date || "2026-06-13").getTime();
      return {
        id: c.id,
        type: 'inquiry',
        text: `Partnership inquiry received from ${c.fullName} (${c.inquiryType})`,
        timestamp: ts
      };
    });

    const aiLogs = aiInteractions.map(ai => {
      const ts = ai.id.startsWith('ai_')
        ? parseInt(ai.id.split('_')[1])
        : new Date(ai.date || "2026-06-13").getTime();
      return {
        id: ai.id,
        type: 'match',
        text: `Gemini AI Chat: "${ai.prompt.substring(0, 60)}${ai.prompt.length > 60 ? '...' : ''}"`,
        timestamp: ts
      };
    });

    // Combine and sort descending
    const allLogs = [...userLogs, ...appLogs, ...contactLogs, ...aiLogs];
    allLogs.sort((a, b) => b.timestamp - a.timestamp);

    // Calculate traffic statistics
    const getTrafficValue = (hoursAgo) => {
      const timeMs = Date.now() - hoursAgo * 3600 * 1000;
      
      const countInHour = 
        users.filter(u => {
          const ts = u.id.startsWith('usr_') && !['usr_1', 'usr_2', 'usr_3', 'usr_4'].includes(u.id) ? parseInt(u.id.split('_')[1]) : 0;
          return ts > timeMs - 3600*1000 && ts <= timeMs;
        }).length +
        applications.filter(a => {
          const ts = a.id.startsWith('app_') && a.id !== 'app_1' ? parseInt(a.id.split('_')[1]) : 0;
          return ts > timeMs - 3600*1000 && ts <= timeMs;
        }).length +
        contacts.filter(c => {
          const ts = c.id.startsWith('con_') && c.id !== 'con_1' ? parseInt(c.id.split('_')[1]) : 0;
          return ts > timeMs - 3600*1000 && ts <= timeMs;
        }).length +
        aiInteractions.filter(ai => {
          const ts = ai.id.startsWith('ai_') ? parseInt(ai.id.split('_')[1]) : 0;
          return ts > timeMs - 3600*1000 && ts <= timeMs;
        }).length;
      
      const date = new Date(timeMs);
      const hour = date.getHours();
      const timeFactor = Math.sin(((hour - 8) / 24) * 2 * Math.PI); // -1 to 1
      const baseTraffic = Math.floor(130 + timeFactor * 45); // 85 to 175
      
      return Math.max(90, baseTraffic + countInHour * 15);
    };

    const trafficHistory = [6, 5, 4, 3, 2, 1, 0].map(h => getTrafficValue(h));
    const liveVisitors = trafficHistory[6];

    return NextResponse.json({
      logs: allLogs,
      liveVisitors,
      trafficHistory
    });
  } catch (err) {
    console.error('Error in GET activity API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
