Update the existing SapioMatch AI project and create a new internal Super Admin control panel.

IMPORTANT STRUCTURAL CHANGE:
Delete the separate pages previously created for:
- Institution Login
- Admin Login
- Super Admin Login

Keep the main User / Learner Login page.

Inside the User / Learner Login page, keep the small section:
“Not a learner?”

Inside that section, keep the three access options:
- Institution
- Admin
- Super Admin

For now, when the user clicks “Super Admin”, do NOT take them to a separate login page.
Instead, route them directly to a new internal page called:

“Super Admin Control Panel”

You may keep the Institution and Admin options visually visible as future access options, but only implement the Super Admin destination in full for now.

GENERAL DESIGN STYLE:
Keep everything consistent with the existing SapioMatch AI design system:
- dark futuristic AI SaaS theme
- deep navy / black background (#050816)
- electric blue (#3B82F6)
- vibrant purple (#8B5CF6)
- cyan accent (#22D3EE)
- glassmorphism cards
- glowing gradients
- subtle grid background
- neon borders
- Space Grotesk for headings
- Inter for body text
- premium internal dashboard look
- not a public landing page style

PAGE TO CREATE:
Create a desktop internal page called:
“Super Admin Control Panel”

MAIN LAYOUT:
Use a professional admin dashboard layout with:
1. Left collapsible / expandable sidebar
2. Top header bar
3. Main content area

TOP HEADER BAR:
At the top of the page include:
- page title: “Super Admin Control Panel”
- breadcrumb or small subtitle: “Governance / MIS”
- search bar
- notifications icon
- settings icon
- user avatar / profile chip labeled “Super Admin”
- optional live badge: “System Live”
- small timestamp: “Last updated 2 seconds ago”

LEFT SIDEBAR:
Create a left sidebar that is collapsible by default and expands when clicked.
Collapsed state:
- shows icons only
Expanded state:
- shows icons + full text labels
Use smooth futuristic styling, glassmorphism, subtle glow, and hover states.

Inside the sidebar include these exact items:

1. MIS
- single clickable menu item

2. Dashboard
- dropdown / expandable item
- when expanded it shows:
  - User Dashboards
  - Admins Dashboards
  - Campaign Dashboard

3. Update Users or Admins
- dropdown / expandable item
- when expanded it shows:
  - Add User
  - Delete User
  - Update / Modify User
  - Add Admin
  - Delete Admin
  - Update / Modify Admin

Make MIS the active selected section by default.

MAIN CONTENT AREA:
When MIS is selected, show a complete Management Information System dashboard.

MIS PAGE STRUCTURE:
Create the MIS page as a live-style analytics dashboard with mock data.
Even though the data is fake, make it look real, active, and live.

At the very top of the MIS content area, show:
Section title:
“MIS — Management Information System”
Small subtitle:
“Live platform analytics, user activity, conversions, and operational monitoring.”

SECTION 1 — KPI SUMMARY CARDS
Create 4 large KPI cards in one row.

Card 1:
Title: Total Website Visitors
Value: 24,860
Trend: +12.4% vs last month
Small note: “Live traffic across all pages”

Card 2:
Title: Total Clicks
Value: 81,420
Trend: +9.8% vs last month
Small note: “All tracked CTA and navigation clicks”

Card 3:
Title: Completed AI Match Journeys
Value: 6,920
Trend: +15.2% vs last month
Small note: “Users who completed the questionnaire”

Card 4:
Title: Confirmed Enrollments
Value: 842
Trend: +7.1% vs last month
Small note: “Users successfully enrolled in a program”

Style:
- glass cards
- soft glow
- small icon on each card
- mini sparkline at the bottom of each card
- green/red trend indicator badges

SECTION 2 — MAIN MULTI-LINE CHART
Create a large glass card containing a live-style multi-line chart.

Chart title:
“Visitors vs Logged-In Users vs Completed Matches vs Enrollments”

Subtitle:
“Monthly growth comparison across the full user journey”

Use a 12-month horizontal axis:
Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec

Use the following mock data:

Visitors:
Jan 4200
Feb 4800
Mar 5600
Apr 6100
May 6800
Jun 7600
Jul 8500
Aug 9100
Sep 9800
Oct 10600
Nov 11400
Dec 12300

Logged In:
Jan 1300
Feb 1500
Mar 1700
Apr 1950
May 2200
Jun 2480
Jul 2780
Aug 3010
Sep 3290
Oct 3560
Nov 3890
Dec 4200

Completed Matches:
Jan 820
Feb 980
Mar 1150
Apr 1320
May 1540
Jun 1780
Jul 2100
Aug 2380
Sep 2660
Oct 2920
Nov 3210
Dec 3550

Enrolled:
Jan 80
Feb 95
Mar 110
Apr 128
May 142
Jun 160
Jul 185
Aug 204
Sep 228
Oct 255
Nov 286
Dec 318

Render this as 4 separate colored lines with glowing points and a legend:
- Visitors = cyan
- Logged In = blue
- Completed Matches = purple
- Enrolled = orange or pink

Make it look like a real dashboard chart:
- visible axes
- subtle grid lines
- hover-style dots
- line legend at top
- “Live” badge in top right of chart card

SECTION 3 — USER JOURNEY FUNNEL
Create a funnel or staged conversion card.

Title:
“User Journey Funnel”

Show these stages:
- Website Visitors: 12,300
- Clicked “Find My Best Program”: 7,850
- Completed AI Questionnaire: 4,180
- Logged In / Registered: 2,940
- Contacted Institution: 1,080
- Enrolled: 318

Show percentage drop-off between stages.
Use a futuristic funnel visualization or stacked narrowing bars.
Add a note:
“Biggest drop-off occurs between program exploration and institution contact.”

SECTION 4 — LIVE ACTIVE ACCOUNTS TABLE
Create a live-status table.

Title:
“Live Active Accounts”

Subtitle:
“Current activity snapshot”

Columns:
Role | Active Now | Total Accounts | Status | Last Refresh

Rows:
Users | 182 | 2,640 | Live | 2 sec ago
Admins | 4 | 10 | Live | 2 sec ago
Super Admins | 1 | 3 | Live | 2 sec ago
Institutions | 23 | 145 | Live | 2 sec ago

Show each status with a green live dot and badge.
Make the table look like a real live monitoring table.

SECTION 5 — TOP PERFORMING PROGRAMS TABLE
Create a data table titled:
“Top Performing Programs”

Columns:
Program | Views | AI Matches | Leads | Enrollments

Rows:
Public Policy & Governance Master’s | 1,280 | 620 | 145 | 38
AI Business Analytics Diploma | 1,150 | 570 | 132 | 34
Cybersecurity Professional Certificate | 980 | 492 | 118 | 29
Global MBA | 910 | 448 | 101 | 24
Data Analytics Professional Diploma | 870 | 430 | 96 | 22

Add small trend arrows where appropriate.
Style it as a glass data table.

SECTION 6 — ADMIN WORKLOAD TABLE
Create another table titled:
“Admin Workload Monitoring”

Columns:
Admin Name | Pending Reviews | Approved Today | Rejected Today | Avg Review Time | Status

Rows:
Anita S. | 12 | 18 | 2 | 1.4 hrs | Active
Michael T. | 8 | 15 | 1 | 1.8 hrs | Active
Nora H. | 20 | 9 | 4 | 2.3 hrs | Active
David K. | 6 | 11 | 1 | 1.2 hrs | Active

Use green activity indicators and clean monitoring-table styling.

SECTION 7 — INSTITUTION APPROVAL STATUS
Create a smaller analytics block or card group titled:
“Institution Data Approval Status”

Show 4 metric cards:
- Pending Updates: 32
- Approved This Week: 118
- Rejected / Returned: 9
- Avg Approval Time: 1.8 days

Below that, show a mini table:
Institution | Pending Items | Last Submitted | Status

Rows:
Nova European Academy | 4 | 2 hrs ago | Under Review
Westbridge Business School | 3 | 5 hrs ago | Under Review
Crest Law Institute | 6 | 1 day ago | Pending
Metro Digital Academy | 2 | 45 min ago | Under Review

SECTION 8 — ALERTS / WARNINGS PANEL
Create a right-side or lower alerts panel titled:
“Live Alerts”

Show each alert as a colored notification card:

Alert 1:
“12 institution updates have been pending for more than 3 days.”

Alert 2:
“Drop-off rate increased by 8% after Question 4 in the AI questionnaire.”

Alert 3:
“8 institutions are running low on credits for lead access.”

Alert 4:
“3 failed admin login attempts detected in the last 24 hours.”

Alert 5:
“User traffic from Europe increased by 14% this week.”

Style:
- color-coded severity
- warning icons
- glass alert cards
- subtle blinking live indicator

EXTRA VISUAL DETAILS:
Make the MIS page feel truly operational and live:
- use “Live” badges
- “updated 2 seconds ago” text
- tiny status dots
- mini sparklines
- KPI trend arrows
- active row highlights
- hovering chart points
- glowing analytics accents

SIDEBAR BEHAVIOR:
Visually show that:
- the sidebar can collapse and expand
- Dashboard and Update Users or Admins can expand like accordion dropdowns
- MIS is selected by default

PROTOTYPE / INTERACTION:
Create clickable interactions where possible:
- Clicking the Super Admin option from the User Login page opens this Super Admin Control Panel
- Clicking the sidebar expand/collapse control visually shows the expanded sidebar state
- Clicking Dashboard expands its 3 submenu items
- Clicking Update Users or Admins expands its 6 submenu items
- MIS remains the main visible content page

IMPORTANT:
Do not recreate a Super Admin login page.
The Super Admin access option should now lead directly into the Super Admin dashboard page.
Do not build the Admin or Institution dashboards yet.
Only build the full Super Admin internal page and fully implement the MIS version inside it.

Make the final result feel like a premium enterprise AI control panel for a high-end education matching platform.