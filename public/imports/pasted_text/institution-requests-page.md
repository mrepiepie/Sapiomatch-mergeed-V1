Update the SapioMatch AI Institution Dashboard by adding a new section in the left sidebar called:

Requests

This should be a normal single sidebar item, not a dropdown.

Update the sidebar structure to become:

Dashboard

* Institution Statistics

Activities

* Add Program / Course
* Delete Program / Course
* Update / Modify Program / Course

Requests

Top Up Credits

Important:

* “Requests” should open a dedicated Requests page.
* The Requests page is used only for tracking submitted requests.
* It is not used to submit new requests.
* Submission still happens from Add Program / Course, Delete Program / Course, Update / Modify Program / Course, and Top Up Credits.

---

REQUESTS PAGE

When the institution clicks:

Requests

Create a page titled:

Requests

Subtitle:

Track all submitted program, course, and credit requests, including their current approval or payment status.

Add a summary row of small KPI cards at the top:

1. Total Requests
   Value: 12

2. Pending Approval
   Value: 5

3. Approved
   Value: 4

4. Rejected
   Value: 1

5. Completed
   Value: 2

Use the same glassmorphism KPI card style used across the Institution Dashboard.

---

REQUESTS TABLE

Create a modern table with the following columns:

* Request ID
* Request Type
* Details
* Submitted Date
* Status

Use this mockup data:

1. Request ID: REQ-001
   Request Type: Add Program / Course
   Details: Add MBA in Digital Business
   Submitted Date: 02 Jun 2026
   Status: Pending Approval

2. Request ID: REQ-002
   Request Type: Update / Modify Program / Course
   Details: Update BBA course duration from 3 years to 4 years
   Submitted Date: 01 Jun 2026
   Status: Awaiting Review

3. Request ID: REQ-003
   Request Type: Delete Program / Course
   Details: Delete CRN 20455 — outdated elective course
   Submitted Date: 30 May 2026
   Status: Rejected

4. Request ID: REQ-004
   Request Type: Add Program / Course
   Details: Add Professional Diploma in Artificial Intelligence
   Submitted Date: 28 May 2026
   Status: Approved

5. Request ID: REQ-005
   Request Type: Top Up Credits
   Details: Add +2000 Credits
   Submitted Date: 27 May 2026
   Status: Completed

6. Request ID: REQ-006
   Request Type: Update / Modify Program / Course
   Details: Update tuition fee details for MBA in Finance
   Submitted Date: 26 May 2026
   Status: Pending Approval

7. Request ID: REQ-007
   Request Type: Add Program / Course
   Details: Add Cybersecurity Bachelor Degree
   Submitted Date: 24 May 2026
   Status: Approved

8. Request ID: REQ-008
   Request Type: Delete Program / Course
   Details: Delete CRN 11890 — discontinued short course
   Submitted Date: 22 May 2026
   Status: Awaiting Review

9. Request ID: REQ-009
   Request Type: Top Up Credits
   Details: Add +1000 Credits
   Submitted Date: 20 May 2026
   Status: Completed

10. Request ID: REQ-010
    Request Type: Update / Modify Program / Course
    Details: Update entry requirements for BBA in Marketing
    Submitted Date: 18 May 2026
    Status: Approved

11. Request ID: REQ-011
    Request Type: Add Program / Course
    Details: Add Weekend Executive Leadership Certificate
    Submitted Date: 16 May 2026
    Status: Pending Approval

12. Request ID: REQ-012
    Request Type: Update / Modify Program / Course
    Details: Update program description for Engineering Foundation Year
    Submitted Date: 14 May 2026
    Status: Pending Approval

---

STATUS BADGE DESIGN

Use clear status badges:

Pending Approval

* Amber / yellow badge

Awaiting Review

* Blue badge

Approved

* Green badge

Rejected

* Red badge

Completed

* Purple or cyan badge

The status badges should look modern, clean, and easy to scan.

---

REQUEST TRACKING LOGIC

Show the following logic visually:

Institution submits a request
→ System shows “Request submitted successfully.”
→ Request appears in the Requests table
→ Initial status becomes “Pending Approval”
→ Admin or Super Admin later changes the status to Approved, Rejected, Awaiting Review, or Completed

Add a small info note above or below the table:

“Requests submitted by your institution are reviewed by Admin or Super Admin before changes become visible on the platform.”

---

DESIGN STYLE

Keep the page consistent with the SapioMatch AI Institution Dashboard:

* Dark navy / black background
* Electric blue, purple, and cyan accents
* Glassmorphism cards
* Neon borders
* Premium futuristic SaaS dashboard style
* Space Grotesk headings
* Inter body text
* Clear readable table layout
* Smooth hover states on table rows
* Search/filter feel if possible

Optional:
Add small filters above the table:

* All
* Pending Approval
* Awaiting Review
* Approved
* Rejected
* Completed

Also add a search field:

“Search requests…”

---

GLOBAL NAVIGATION

The Requests page must include:

* Credit balance at the top right
* Back to Home or Exit Dashboard button
* Breadcrumb navigation

Use breadcrumb:

Home / Institution Dashboard / Requests

The credit balance should remain visible at the top right, for example:

🪙 6,250 Credits
