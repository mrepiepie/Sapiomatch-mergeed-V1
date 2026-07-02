Update the existing SapioMatch AI prototype by adding the missing Application / Admission / Enrollment tracking system properly across the User Dashboard, Institution Dashboard, Admin Dashboard, and Super Admin Dashboard.

Do not redesign the whole website. Keep the existing SapioMatch AI visual style exactly as it is:

* Futuristic AI SaaS interface
* Dark navy / black background
* Electric blue, purple, and cyan accents
* Glassmorphism cards
* Neon borders
* Soft glow effects
* Animated futuristic background
* Premium dashboard look
* Space Grotesk headings
* Inter body text
* Rounded cards
* Glowing selected states
* Clean dashboard layout

Only add and connect the missing application/admission/enrollment logic and the required UI screens, tables, buttons, counters, modals, and dashboard sections.

==================================================

1. CORE APPLICATION / ENROLLMENT LOGIC
   ==================================================

Add this full flow:

1. A logged-in user completes the AI questionnaire.
2. The system shows recommended universities/institutions with match percentages.
3. The user clicks an institution card.
4. The user opens the institution profile/details page.
5. The user sees a prominent button:
   “Send Application Form Now”
   or
   “Fill Application Form”
6. When clicked, a popup application form opens.
7. The application form should be pre-filled with the user’s basic information.
8. When the user submits the form, this counts as a filled application for that specific institution.
9. The submitted application appears in:

   * User Dashboard → My Applications
   * Institution Dashboard → Applications
   * Admin Dashboard → Institution Management
   * Super Admin Dashboard → Manage Institutions / Applications Overview
10. The institution reviews the application.
11. The institution can update the application status to:

* Pending
* Received
* Under Review
* Accepted
* Rejected

12. Only Accepted applications increase the Successful Admissions / Enrollments counter.
13. Rejected applications increase only the Rejected Applications counter.
14. Rejected applications must not increase Successful Admissions / Enrollments.
15. Each institution can see only its own submitted applications.
16. Super Admin can see all applications and admission/enrollment results across all institutions.
17. Admin can search and view applications by institution, but should not be treated as the institution owner.

==================================================
2. USER SIDE — ADD APPLICATION FORM FLOW
========================================

Inside the logged-in User Dashboard / Explore Institutions flow, update each institution card to include:

* Institution name
* Match percentage
* Suggested programme
* Why this match
* Average fees
* Study mode
* View Institution button
* Fill Application Form button

Use these example match cards:

1. Global Future University — 94% Match
   Suggested programme: MSc Public Policy
   Reason: Strong fit for Law & Public Policy, hybrid study preference, Europe destination, and career promotion goal.

2. London Executive University — 89% Match
   Suggested programme: Executive Law Diploma
   Reason: Good match for executive education, UK/Europe preference, and professional advancement.

3. SkillBridge Online — 84% Match
   Suggested programme: Leadership Certificate
   Reason: Flexible online leadership certificates aligned with professional growth and low budget.

4. Emirates Digital University — 78% Match
   Suggested programme: Digital Governance Certificate
   Reason: Strong digital governance options, flexible study mode, and regional accessibility.

When the user clicks “View Institution,” open the institution profile page.

On the institution profile page, add a very clear primary button:

“Send Application Form Now”

or

“Fill Application Form”

This button must open the Application Form popup.

==================================================
3. APPLICATION FORM POPUP
=========================

Create a glassmorphism popup/modal for the application form.

Popup title:
“Application Form”

Subtitle:
“Your basic information has been pre-filled. Complete the remaining fields and submit your application.”

The form should include these fields:

Pre-filled user information:

* Full name: Alex Morgan
* Email: [alex@example.com](mailto:alex@example.com)
* Phone number: +971 50 555 1200
* Age: 29
* Current qualification: Bachelor’s Degree
* Field of interest: Law & Public Policy
* Preferred study mode: Hybrid
* Preferred destination: Europe

Application fields:

* Institution name
* Preferred programme
* Preferred start date
* Nationality
* Current country of residence
* Work experience
* Upload CV placeholder
* Upload academic transcript placeholder
* Upload passport / ID placeholder
* Personal statement / notes
* Consent checkbox

Buttons:

* Cancel
* Submit Application

When the user clicks Submit Application, show success message:

“Application submitted successfully.”

After submission, visually reflect that:

* The application is added to the user’s My Applications table.
* The application is added to the relevant institution’s Applications table.
* The filled application count for that institution increases.
* The initial application status should be Pending or Received.

==================================================
4. USER DASHBOARD — MY APPLICATIONS
===================================

Add or improve the User Dashboard page called:

“My Applications”

This page should show all applications submitted by the logged-in user.

Table columns:

* Institution
* Programme
* Submission date
* Status
* Action

Use this mock data:

1. Global Future University
   Programme: MSc Public Policy
   Submission date: 02 Jun 2026
   Status: Under Review
   Action: View Application

2. London Executive University
   Programme: Executive Law Diploma
   Submission date: 01 Jun 2026
   Status: Accepted / Successfully Enrolled
   Action: View Application

3. Emirates Digital University
   Programme: Digital Governance Certificate
   Submission date: 29 May 2026
   Status: Pending
   Action: View Application

4. SkillBridge Online
   Programme: Leadership Certificate
   Submission date: 27 May 2026
   Status: Rejected
   Action: View Application

Use clear colored status badges:

* Pending = amber
* Received = blue
* Under Review = cyan/blue
* Accepted / Successfully Enrolled = green
* Rejected = red

When clicking “View Application,” open a detail modal showing:

* Institution
* Programme
* Submitted user information
* Submission date
* Current status
* Timeline

Timeline stages:

* Submitted
* Received
* Under Review
* Accepted / Rejected

==================================================
5. INSTITUTION DASHBOARD — ADD APPLICATIONS SECTION
===================================================

In the Institution Dashboard sidebar, add or make sure there is a page called:

“Applications”

The institution should see only applications submitted to its own institution.

For the sample institution, use:

Global Future University

Create an Applications page with this title:

“Applications”

Subtitle:

“Review submitted applications and update student admission status.”

Table columns:

* Student name
* Email
* Phone
* Programme
* Submission date
* Status
* Action

Use this mock data:

1. Omar Khalid
   Email: [omar@example.com](mailto:omar@example.com)
   Phone: +971 50 111 2233
   Programme: MSc Public Policy
   Submission date: 02 Jun 2026
   Status: Under Review
   Action: View Application / Update Status

2. Sara Ahmed
   Email: [sara@example.com](mailto:sara@example.com)
   Phone: +971 55 432 1188
   Programme: Executive MBA
   Submission date: 01 Jun 2026
   Status: Accepted
   Action: View Application / Update Status

3. Lina Mansour
   Email: [lina@example.com](mailto:lina@example.com)
   Phone: +971 52 778 9911
   Programme: Law Diploma
   Submission date: 30 May 2026
   Status: Pending
   Action: View Application / Update Status

4. Rami Haddad
   Email: [rami@example.com](mailto:rami@example.com)
   Phone: +971 58 912 3000
   Programme: Digital Leadership Certificate
   Submission date: 29 May 2026
   Status: Rejected
   Action: View Application / Update Status

Clicking “View Application” should open a detail modal.

The application detail modal should include:

* Student personal information
* Email
* Phone
* Nationality
* Academic background
* Programme selected
* Work experience
* Uploaded documents placeholders
* Personal statement
* Current status
* Status update dropdown

Status update dropdown options:

* Pending
* Received
* Under Review
* Accepted
* Rejected

Buttons:

* Save Status
* Close

When status is saved, show:

“Status updated successfully.”

==================================================
6. INSTITUTION DASHBOARD — APPLICATION / ADMISSION COUNTERS
===========================================================

In Institution Dashboard → Institution Statistics, add the Application / Admission Summary as the first/top section.

This must appear before other statistics.

Create KPI cards or a table-style KPI component with:

1. Filled Applications
   Value: 126

2. Under Review
   Value: 42

3. Accepted / Successful Admissions
   Value: 38

4. Rejected Applications
   Value: 21

Add a small explanation below:

“Filled applications represent all submitted forms. Successful admissions increase only when an application is accepted.”

Important logic:

* Filled Applications = all submitted application forms for this institution.
* Under Review = applications currently being reviewed.
* Accepted / Successful Admissions = accepted applications only.
* Rejected Applications = rejected applications only.
* Rejected applications must not increase Successful Admissions.
* Each institution sees only its own application/admission statistics.

Also add this summary to the Institution Dashboard Overview as KPI cards:

* Applications Received: 126
* Successful Admissions: 38
* Under Review: 42
* Rejected Applications: 21

==================================================
7. ADMIN DASHBOARD — ADD INSTITUTION MANAGEMENT
===============================================

In the Admin Dashboard sidebar, add a dedicated section called:

“Institution Management”

This section is not a general MIS dashboard and not a reports page.

Admin Institution Management should allow Admin to:

* Search/select a university or institution name
* View all students who filled application forms for that institution
* Search students by name, email, or phone number
* Click a student name or View Application button to open the submitted application form

Top filters:

* Institution search dropdown
* Student search box
* Status filter
* Date range filter

Institution dropdown placeholder:

“Search or select institution…”

Student search placeholder:

“Search by student name, email, or phone number…”

Table columns:

* Student name
* Email
* Phone
* Institution
* Programme
* Submission date
* Application status
* View application

Use this mock data:

1. Omar Khalid — [omar@example.com](mailto:omar@example.com) — +971 50 111 2233 — Global Future University — MSc Public Policy — 02 Jun 2026 — Under Review — View Application

2. Sara Ahmed — [sara@example.com](mailto:sara@example.com) — +971 55 432 1188 — London Executive University — Executive MBA — 01 Jun 2026 — Accepted — View Application

3. Lina Mansour — [lina@example.com](mailto:lina@example.com) — +971 52 778 9911 — Emirates Digital University — Digital Governance Certificate — 30 May 2026 — Pending — View Application

4. Rami Haddad — [rami@example.com](mailto:rami@example.com) — +971 58 912 3000 — SkillBridge Online — Leadership Certificate — 29 May 2026 — Rejected — View Application

When clicking View Application, open an Admin Application Detail modal.

The Admin Application Detail modal should show:

* Student personal information
* Institution
* Programme
* Submitted form fields
* Uploaded documents placeholders
* Current application status
* Timeline

Admin should mainly view and search submitted applications. Admin should not replace the institution’s role in accepting or rejecting students.

==================================================
8. SUPER ADMIN — ADD MANAGE INSTITUTIONS APPLICATION / ENROLLMENT TABLE
=======================================================================

In the Super Admin Dashboard sidebar, add or improve a dedicated section called:

“Manage Institutions”

or

“Institution Management”

This section must include institution-level application/admission/enrollment data.

Do not place this table inside a generic Admins Dashboard.

The Super Admin Manage Institutions page should include filters:

* Institution / university name
* Number of filled application forms
* Number of successful admissions / accepted students
* Institution type
* Status
* Country / region

Main table columns:

* Institution name
* Type
* Country
* Filled application forms
* Under review
* Successful admissions / accepted students
* Rejected applications
* Credits balance
* Status
* Action

Use this mock data:

1. Global Future University
   Type: University
   Country: UK
   Filled application forms: 126
   Under review: 42
   Successful admissions / accepted students: 38
   Rejected applications: 21
   Credits balance: 12,400
   Status: Active
   Action: View Institution / View Applications / View Form / Manage Credits

2. London Executive University
   Type: University
   Country: UK
   Filled application forms: 98
   Under review: 31
   Successful admissions / accepted students: 29
   Rejected applications: 17
   Credits balance: 8,900
   Status: Active
   Action: View Institution / View Applications / View Form / Manage Credits

3. Emirates Digital University
   Type: University
   Country: UAE
   Filled application forms: 74
   Under review: 26
   Successful admissions / accepted students: 18
   Rejected applications: 14
   Credits balance: 15,000
   Status: Active
   Action: View Institution / View Applications / View Form / Manage Credits

4. Nexa Skills Academy
   Type: Academy
   Country: UAE
   Filled application forms: 56
   Under review: 19
   Successful admissions / accepted students: 12
   Rejected applications: 8
   Credits balance: 6,700
   Status: Active
   Action: View Institution / View Applications / View Form / Manage Credits

5. SkillBridge Online
   Type: Online Provider
   Country: Global
   Filled application forms: 143
   Under review: 55
   Successful admissions / accepted students: 44
   Rejected applications: 24
   Credits balance: 18,300
   Status: Active
   Action: View Institution / View Applications / View Form / Manage Credits

Important:

* Super Admin sees all institutions.
* Super Admin sees filled applications across all institutions.
* Super Admin sees successful admissions/enrollments across all institutions.
* Each institution sees only its own applications.
* Successful admissions/enrollments only increase when an application is accepted.
* Rejected applications do not increase successful admissions/enrollments.

==================================================
9. SUPER ADMIN — APPLICATIONS OVERVIEW
======================================

Add or improve a Super Admin page called:

“Institution Applications Overview”

This page should show all submitted applications across all institutions.

Filters:

* Institution
* Programme
* Status
* Date range
* Student name/email/phone

Table columns:

* Student name
* Institution
* Programme
* Submission date
* Status
* Application outcome
* Action

Use mock data from the application tables.

Action:

“View Application”

When clicked, open a full application detail modal showing all submitted application data.

==================================================
10. SUPER ADMIN — VIEW / UPDATE APPLICATION FORM
================================================

Add a Super Admin section called:

“View / Update Application Form”

This allows Super Admin to select an institution and manage that institution’s application form template.

Flow:

1. Super Admin opens View / Update Application Form.
2. Super Admin selects an institution from dropdown.
3. Super Admin sees the institution’s application form template.
4. Super Admin can edit standard fixed sections.
5. Super Admin can add optional extra sections using a dropdown and plus button.
6. Super Admin can delete optional sections.
7. Super Admin clicks Save.
8. Show success message:

“Form updated successfully.”

Institution dropdown options:

* Global Future University
* London Executive University
* Emirates Digital University
* Nexa Skills Academy
* Gulf Professional Academy
* SkillBridge Online
* FutureLearn Pro Institute

Standard fixed application form sections:

1. Personal Information
   Fields:

* Full name
* Date of birth
* Nationality
* Email
* Phone number
* Current country of residence

2. Academic Background
   Fields:

* Highest qualification
* Institution attended
* Graduation year
* GPA / grade
* Field of study

3. Programme Selection
   Fields:

* Preferred programme
* Study mode
* Intake / start date
* Campus / online preference

4. Work Experience
   Fields:

* Current job title
* Employer
* Years of experience
* Industry

5. English / Language Proficiency
   Fields:

* IELTS / TOEFL / equivalent
* Score
* Test date

6. Documents Upload
   Fields:

* Passport / ID
* Academic certificates
* Transcript
* CV
* Language test result

7. Personal Statement
   Fields:

* Motivation
* Career goals
* Why this programme

8. Declaration and Consent
   Fields:

* Confirmation checkbox
* Data consent checkbox
* Submit button

Optional extra sections dropdown:

* Scholarship / Financial Aid
* Visa Support Information
* Accommodation Preferences
* Emergency Contact
* Portfolio Upload
* Recommendation Letters
* Professional Certifications
* Employer Sponsorship
* Interview Availability
* Special Needs / Accessibility Support
* Guardian Information
* Previous Visa Refusal Details
* Additional Documents
* Custom Institution Questions

UI components:

* Institution dropdown
* Form section list
* Preview/edit panel
* Add optional section dropdown
* “+ Add Section” button
* Delete/remove icon for optional sections
* “Save Form Template” button

After save, show:

“Form updated successfully.”

==================================================
11. DASHBOARD SIDEBAR UPDATES
=============================

Update sidebars if needed.

User Dashboard sidebar should include:

* Dashboard Overview
* Explore Institutions
* Start AI Matching
* My Applications
* Profile
* Back to Home

Institution Dashboard sidebar should include:

* Overview
* Institution Statistics
* Applications
* Add Program
* Update Program
* Delete Program
* Requests
* Top Up Credits
* Secure Payment
* Back to Home

Admin Dashboard sidebar should include:

* Dashboard
* Campaign Dashboard
* Institution Management
* Add User
* Delete User
* Update / Modify User
* Approval Requests
* Reminders
* Back to Home

Super Admin Dashboard sidebar should include:

* Dashboard
* Admins Dashboards
* Campaign Dashboard
* Manage Institutions
* Institution Applications Overview
* User Management
* Admin Management
* Approval Requests
* Credit Rules
* Commercial Rules
* View / Update Application Form
* Back to Home

==================================================
12. IMPORTANT UI STYLE RULES
============================

Keep the existing SapioMatch AI theme:

* Dark futuristic AI SaaS style
* Animated background if already present
* Electric blue/purple/cyan accents
* Glassmorphism cards
* Neon borders
* Soft glow
* Rounded dashboard cards
* Premium data platform look
* Modern charts and tables
* Consistent status badges
* Clean modals
* Smooth UI hierarchy

Do not make the new application/enrollment pages look different from the rest of the website.

The new pages and sections must feel native to the existing design.

==================================================
13. SUCCESS MESSAGES
====================

Use these exact messages:

* “Application submitted successfully.”
* “Status updated successfully.”
* “Form updated successfully.”
* “Request submitted successfully.”

==================================================
14. FINAL CHECK
===============

Before finishing, make sure:

* User can submit an application form.
* User can see submitted applications in My Applications.
* Institution can see submitted applications.
* Institution can update application status.
* Accepted status increases Successful Admissions / Enrollments.
* Rejected status does not increase Successful Admissions / Enrollments.
* Admin can search institution applications.
* Super Admin can see applications/admissions/enrollments across all institutions.
* Super Admin can filter by institution name, filled applications, and successful admissions.
* Super Admin can manage application form templates.
* Each institution sees only its own application data.
* All new buttons are clickable.
* All pages match the original SapioMatch AI visual design.
