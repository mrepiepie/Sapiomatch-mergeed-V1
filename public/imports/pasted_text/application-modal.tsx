Update the existing SapioMatch AI prototype so that every “View Application” button in the Institution Applications Overview / Applications table opens a detailed application form popup/modal showing the mock application form that the user submitted.

Do not redesign the page. Keep the exact current SapioMatch AI style:

* Dark navy / black dashboard background
* Glassmorphism table
* Neon blue / cyan / purple accents
* Rounded cards and buttons
* Soft glow effects
* Premium futuristic AI SaaS look
* Same typography, spacing, table style, and status badge style

The current table already shows rows like:

* Omar Khalid
* Sara Ahmed
* Lina Mansour
* Rami Haddad

Each row has a “View Application” button. These buttons must now work.

==================================================

1. BUTTON BEHAVIOR
   ==================================================

For every “View Application” button in the applications table:

When clicked, open a centered popup/modal overlay.

The modal should show the actual submitted application form details for that student using mockup data.

The background behind the modal should become darker/blurred.

Modal should include:

* Close X button in the top-right
* Application title
* Student name
* Institution name
* Programme name
* Submission date
* Current status badge
* Application outcome badge
* Full submitted form sections
* Uploaded documents placeholders
* Timeline
* Close button at the bottom

Do not make the button dead.

Do not navigate to a blank page.

Do not show a tiny tooltip.

It must open a proper large application form popup.

==================================================
2. MODAL DESIGN
===============

Modal style:

* Width: around 850px to 950px
* Max height: around 85% of screen height
* Scrollable inside if content is long
* Background: dark glassmorphism card
* Border: subtle cyan/purple neon border
* Border radius: 24px
* Shadow: soft blue/purple glow
* Overlay: dark blurred background
* Text: white headings, muted grey body text
* Status badges should match existing table badge colors

Modal header:

Title:
“Submitted Application Form”

Subtitle:
“Review the student’s submitted application details, documents, and admission status.”

Top-right:
Close X icon

Header info cards:

* Student Name
* Institution
* Programme
* Submission Date
* Status
* Application Outcome

==================================================
3. MOCK APPLICATION DATA — OMAR KHALID
======================================

When clicking “View Application” for Omar Khalid, show this data:

Student Name:
Omar Khalid

Email:
[omar@example.com](mailto:omar@example.com)

Phone:
+971 50 111 2233

Institution:
Global Future University

Programme:
MSc Public Policy

Submission Date:
02 Jun 2026

Status:
Under Review

Application Outcome:
Pending

Personal Information section:

* Full Name: Omar Khalid
* Date of Birth: 14 March 1999
* Nationality: Jordanian
* Email: [omar@example.com](mailto:omar@example.com)
* Phone Number: +971 50 111 2233
* Current Country of Residence: United Arab Emirates

Academic Background section:

* Highest Qualification: Bachelor’s Degree
* Previous Institution: Ajman University
* Graduation Year: 2025
* GPA / Grade: 3.6 / 4.0
* Field of Study: Computer Engineering

Programme Selection section:

* Preferred Programme: MSc Public Policy
* Study Mode: Hybrid
* Preferred Intake: September 2026
* Preferred Campus / Online Preference: Hybrid with limited campus attendance

Work Experience section:

* Current Job Title: Junior Technology Analyst
* Employer: Future Tech Solutions
* Years of Experience: 1–2 years
* Industry: Technology / Digital Services

Language Proficiency section:

* English Test: IELTS
* Score: 6.5
* Test Date: 12 May 2026

Documents section:

* Passport / ID: Uploaded
* Academic Certificate: Uploaded
* Transcript: Uploaded
* CV: Uploaded
* English Test Result: Uploaded

Personal Statement section:

“I am applying for the MSc Public Policy programme because I want to combine my technology background with policy, governance, and digital transformation. My goal is to build a career where I can support public-sector innovation and contribute to smarter digital services.”

Timeline:

* Submitted — 02 Jun 2026
* Received — 02 Jun 2026
* Under Review — 03 Jun 2026
* Final Decision — Pending

==================================================
4. MOCK APPLICATION DATA — SARA AHMED
=====================================

When clicking “View Application” for Sara Ahmed, show this data:

Student Name:
Sara Ahmed

Email:
[sara@example.com](mailto:sara@example.com)

Phone:
+971 55 432 1188

Institution:
London Executive University

Programme:
Executive MBA

Submission Date:
01 Jun 2026

Status:
Accepted

Application Outcome:
Successful

Personal Information section:

* Full Name: Sara Ahmed
* Date of Birth: 22 August 1994
* Nationality: Egyptian
* Email: [sara@example.com](mailto:sara@example.com)
* Phone Number: +971 55 432 1188
* Current Country of Residence: United Arab Emirates

Academic Background section:

* Highest Qualification: Bachelor’s Degree
* Previous Institution: University of Sharjah
* Graduation Year: 2016
* GPA / Grade: Very Good
* Field of Study: Business Administration

Programme Selection section:

* Preferred Programme: Executive MBA
* Study Mode: Hybrid
* Preferred Intake: August 2026
* Preferred Campus / Online Preference: Weekend campus sessions + online learning

Work Experience section:

* Current Job Title: Operations Manager
* Employer: Gulf Retail Group
* Years of Experience: 7 years
* Industry: Retail / Operations

Language Proficiency section:

* English Test: TOEFL
* Score: 92
* Test Date: 18 April 2026

Documents section:

* Passport / ID: Uploaded
* Academic Certificate: Uploaded
* Transcript: Uploaded
* CV: Uploaded
* English Test Result: Uploaded

Personal Statement section:

“I am applying for the Executive MBA to strengthen my strategic leadership, financial decision-making, and organizational management skills. I want to progress into a senior leadership position and contribute to business transformation.”

Timeline:

* Submitted — 01 Jun 2026
* Received — 01 Jun 2026
* Under Review — 02 Jun 2026
* Accepted — 04 Jun 2026

==================================================
5. MOCK APPLICATION DATA — LINA MANSOUR
=======================================

When clicking “View Application” for Lina Mansour, show this data:

Student Name:
Lina Mansour

Email:
[lina@example.com](mailto:lina@example.com)

Phone:
+971 52 778 9911

Institution:
Emirates Digital University

Programme:
Digital Governance Certificate

Submission Date:
30 May 2026

Status:
Pending

Application Outcome:
Pending

Personal Information section:

* Full Name: Lina Mansour
* Date of Birth: 09 January 1997
* Nationality: Lebanese
* Email: [lina@example.com](mailto:lina@example.com)
* Phone Number: +971 52 778 9911
* Current Country of Residence: United Arab Emirates

Academic Background section:

* Highest Qualification: Bachelor’s Degree
* Previous Institution: American University of Beirut
* Graduation Year: 2019
* GPA / Grade: 3.4 / 4.0
* Field of Study: Political Science

Programme Selection section:

* Preferred Programme: Digital Governance Certificate
* Study Mode: Online
* Preferred Intake: July 2026
* Preferred Campus / Online Preference: Fully online

Work Experience section:

* Current Job Title: Policy Research Assistant
* Employer: Regional Policy Centre
* Years of Experience: 3 years
* Industry: Policy / Research

Language Proficiency section:

* English Test: IELTS
* Score: 7.0
* Test Date: 20 March 2026

Documents section:

* Passport / ID: Uploaded
* Academic Certificate: Uploaded
* Transcript: Uploaded
* CV: Uploaded
* English Test Result: Uploaded

Personal Statement section:

“I want to study digital governance because I am interested in how governments and institutions can use digital platforms, data, and policy frameworks to improve public services and citizen engagement.”

Timeline:

* Submitted — 30 May 2026
* Received — Pending
* Under Review — Pending
* Final Decision — Pending

==================================================
6. MOCK APPLICATION DATA — RAMI HADDAD
======================================

When clicking “View Application” for Rami Haddad, show this data:

Student Name:
Rami Haddad

Email:
[rami@example.com](mailto:rami@example.com)

Phone:
+971 58 912 3000

Institution:
SkillBridge Online

Programme:
Leadership Certificate

Submission Date:
29 May 2026

Status:
Rejected

Application Outcome:
Rejected

Personal Information section:

* Full Name: Rami Haddad
* Date of Birth: 17 November 1992
* Nationality: Palestinian
* Email: [rami@example.com](mailto:rami@example.com)
* Phone Number: +971 58 912 3000
* Current Country of Residence: United Arab Emirates

Academic Background section:

* Highest Qualification: Diploma
* Previous Institution: Abu Dhabi Vocational Institute
* Graduation Year: 2014
* GPA / Grade: Good
* Field of Study: Business Support

Programme Selection section:

* Preferred Programme: Leadership Certificate
* Study Mode: Online
* Preferred Intake: June 2026
* Preferred Campus / Online Preference: Fully online

Work Experience section:

* Current Job Title: Team Supervisor
* Employer: Service Operations LLC
* Years of Experience: 8 years
* Industry: Customer Service / Operations

Language Proficiency section:

* English Test: Not submitted
* Score: Not available
* Test Date: Not available

Documents section:

* Passport / ID: Uploaded
* Academic Certificate: Uploaded
* Transcript: Not Uploaded
* CV: Uploaded
* English Test Result: Not Uploaded

Personal Statement section:

“I am interested in improving my leadership and communication skills to manage teams more effectively and prepare for future supervisory roles.”

Timeline:

* Submitted — 29 May 2026
* Received — 29 May 2026
* Under Review — 30 May 2026
* Rejected — 02 Jun 2026

==================================================
7. MODAL STRUCTURE
==================

Inside the popup, organize the application form in clear sections:

Section 1:
Application Summary

Show cards for:

* Student Name
* Institution
* Programme
* Submission Date
* Status
* Application Outcome

Section 2:
Personal Information

Section 3:
Academic Background

Section 4:
Programme Selection

Section 5:
Work Experience

Section 6:
Language Proficiency

Section 7:
Uploaded Documents

Show each document as a small file row/card with an icon and status:

* Uploaded
* Not Uploaded

Section 8:
Personal Statement

Section 9:
Application Timeline

Use a vertical timeline component.

At the bottom of the modal, add buttons:

* Close
* Download PDF placeholder
* Add Internal Note placeholder

The “Download PDF” and “Add Internal Note” buttons can be visual placeholders for now.

==================================================
8. STATUS COLORS
================

Use the same status badge style as the table.

Status colors:

Under Review:

* Cyan / blue badge

Pending:

* Amber / yellow badge

Accepted:

* Green badge

Successful:

* Blue or green badge

Rejected:

* Red badge

Uploaded:

* Green badge or check icon

Not Uploaded:

* Red or muted badge

==================================================
9. APPLY THIS TO ALL SIMILAR TABLES
===================================

Apply this same “View Application opens popup” behavior to all places where application tables exist, including:

* User Dashboard → My Applications
* Institution Dashboard → Applications
* Admin Dashboard → Institution Management
* Super Admin Dashboard → Institution Applications Overview
* Super Admin Dashboard → Manage Institutions if there is a View Applications action

Every “View Application” button should open a detailed modal with mock submitted application form data.

==================================================
10. FINAL CHECK
===============

Before finishing, confirm visually that:

* Every “View Application” button is clickable.
* Clicking it opens a large application form popup.
* The popup contains realistic mock form data.
* The modal matches the current SapioMatch AI dark futuristic design.
* The modal is readable and scrollable if needed.
* The background behind the modal is darkened/blurred.
* There is a close button.
* Status and outcome badges are visible.
* Uploaded document placeholders are visible.
* Application timeline is visible.
* No “View Application” button remains dead.
