import { NextResponse } from 'next/server';
import { db } from '../../../../services/db';

export async function GET() {
  try {
    const totalVisitors = db.getStatValue("total_visitors", 14205);
    const totalClicks = db.getStatValue("total_clicks", 9842);
    const completedMatches = db.getStatValue("completed_matches", 2431);

    const apps = db.getApplications();
    const enrollmentsDb = apps.filter(a => a.status === 'Accepted' || a.status === 'Approved').length;
    const totalEnrollments = db.getStatValue("confirmed_enrollments", 342) + enrollmentsDb;

    const users = db.getUsers();
    const getRoleCount = (role) => users.filter(u => u.role?.toLowerCase() === role.toLowerCase()).length;
    
    const learnersCount = getRoleCount("student") + getRoleCount("learner");
    const adminsCount = getRoleCount("admin");
    const superAdminsCount = getRoleCount("super_admin") || 1;
    const institutionsCount = getRoleCount("university") + getRoleCount("institution");

    const statsKpis = {
      visitors: { value: totalVisitors, trend: "+12%", isPositive: true },
      clicks: { value: totalClicks, trend: "+8.4%", isPositive: true },
      matches: { value: completedMatches, trend: "+15.6%", isPositive: true },
      enrollments: { value: totalEnrollments, trend: "+4.2%", isPositive: true }
    };

    const months = ["Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026"];
    const baseVisitors = [8000, 8500, 9200, 11000, 10500, 11500, 12000, 12500, 13000, 13800, 14205, totalVisitors % 15000 || 14205];
    
    const chartData = months.map((month, idx) => {
      const v = baseVisitors[idx];
      return {
        name: month,
        Visitors: v,
        "Logged In": Math.floor(v * 0.45),
        "Completed Matches": Math.floor(v * 0.18),
        Enrolled: Math.floor(v * 0.024)
      };
    });

    const accounts = [
      { role: "Learners", count: 2842 + learnersCount, status: "Active", lastActivity: "2 mins ago" },
      { role: "Admins", count: 12 + adminsCount, status: "Active", lastActivity: "12 mins ago" },
      { role: "Super Admins", count: 3 + superAdminsCount, status: "Active", lastActivity: "Just now" },
      { role: "Institutions", count: 7 + institutionsCount, status: "Active", lastActivity: "1 hour ago" }
    ];

    const alerts = [
      { id: 1, type: "warning", message: "Global Future University credit balance below threshold (Cost per lead: 500).", time: "5 mins ago" },
      { id: 2, type: "info", message: "New institution registration request pending verification.", time: "25 mins ago" },
      { id: 3, type: "error", message: "API latency spike observed on Match algorithm endpoint.", time: "1 hour ago" }
    ];

    return NextResponse.json({
      kpis: statsKpis,
      chartData: chartData,
      accounts: accounts,
      alerts: alerts
    });
  } catch (err) {
    console.error('[Learnova API] Error in GET stats route:', err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
