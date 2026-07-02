Update the SapioMatch AI prototype by adding the full **logged-in User Dashboard**, the complete **Application / Admission Tracking Flow** across User, Institution, Admin, and Super Admin dashboards, and the **Apple Pay payment option** inside the Institution Dashboard Top Up Credits payment flow.

Keep the same SapioMatch AI visual identity across all new and updated pages:

* Futuristic AI SaaS interface
* Dark navy / black background
* Electric blue, purple, and cyan accents
* Glassmorphism cards
* Neon borders and soft glow effects
* Premium futuristic dashboard look
* Space Grotesk headings
* Inter body text
* Clean left-hand sidebar layouts
* Rounded cards, glowing buttons, modern tables, and clear status badges
* Rounded payment cards, glowing selected states, and clean payment UI

---

# PART A — USER DASHBOARD + APPLICATION / ADMISSION TRACKING FLOW

---

# 1. Core Logic to Implement

The missing system logic is:

**Filled Applications are different from Successful Admissions / Enrollments.**

Do not treat submitted applications as enrollments.

Use this logic:

1. Logged-in user completes AI questionnaire.
2. User receives recommended universities/institutions with match percentages.
3. User clicks an institution/university page.
4. User views full institution information.
5. User clicks a large button: **Send Application Form Now!** or **Fill Application Form**.
6. A popup application form opens.
7. Basic user information is auto-filled.
8. User completes and submits the application form.
9. This increases the **Filled Applications** count for that specific institution.
10. Institution reviews the application.
11. Institution can mark the application as:

* Under Review
* Accepted
* Rejected

12. Only **Accepted** applications increase the **Successful Admissions / Enrollments** counter.
13. Rejected applications increase the **Rejected Applications** counter.
14. Rejected applications must not increase the successful admissions/enrollments number.

Use mock/demo data only.

---

# 2. User Login Flow

Connect the existing public website login flow to the new User Dashboard.

Flow:

**Home → Login → Login as User → User Dashboard**

On the Login / Role Selection page, when the user clicks:

**Login as User**

Navigate directly to the new **User Dashboard**.

Do not send the user to:

* Admin Dashboard
* Institution Dashboard
* Super Admin Dashboard
* Public questionnaire page only
* Learning page

Use Figma prototype interaction:

* On click → Navigate to User Dashboard
* Transition: Instant or Dissolve

---

# 3. Logged-in User Dashboard

Create a new **User Dashboard** page.

The User Dashboard should use the same dashboard style as Admin, Super Admin, and Institution dashboards, but it should not be MIS-heavy.

The User Dashboard is for the normal logged-in student/professional.

## Left Sidebar Menu

Create a left-hand sidebar with these sections:

1. **Explore Institutions**
2. **Start AI Matching**
3. **My Applications**

Keep it clean, simple, and not crowded.

Do not include:

* Admin controls
* Institution controls
* Super Admin controls
* Credits
* Campaigns
* MIS statistics
* Approval requests
* Other users’ data

---

# 4. User Dashboard — Explore Institutions Page

The default user page after login should be **Explore Institutions**.

This page should show all institutions, including:

* Universities
* Academies
* Online platforms
* Institutions that match the AI results
* Institutions that do not match the AI results

Before the user completes AI matching, show general institution cards.

After the user completes AI matching, update this page with mock AI match percentages.

Use the same 7 institutions already created in the public Explore Institutions flow:

## Universities

1. University of Birmingham Dubai
2. Middlesex University Dubai
3. American University of Sharjah

## Academies

4. NADIA Training Institute
5. Astrolabs Academy

## Online Platforms

6. Coursera
7. Udemy

Each logged-in institution card should include:

* Institution name
* Institution type badge
* Location
* Distance from visitor
* Average fees
* Reputation score
* Available programs/courses
* Study mode
* Match percentage, only in the logged-in User Dashboard
* Tags
* Button: **View Institution**

Example match percentages:

* University of Birmingham Dubai — 94%
* American University of Sharjah — 91%
* Coursera — 89%
* Middlesex University Dubai — 86%
* Astrolabs Academy — 82%
* NADIA Training Institute — 74%
* Udemy — 69%

Important:

* Public Explore Institutions page should not show match scores.
* Logged-in User Dashboard Explore Institutions page can show match scores.
* Make it clear this is personalized after the AI questionnaire.

---

# 5. User Dashboard — Start AI Matching Page

Create a **Start AI Matching** page inside the User Dashboard.

This page should use the exact same questionnaire experience previously created for:

* Find My Best Programme
* Start AI Matching

Use the same questionnaire style and same loading effect.

The questionnaire should ask the same type of mock questions, such as:

* Age range
* Current education level
* Field of interest
* Career goal
* Preferred country or region
* Preferred study mode
* Budget range
* Start timeline
* Work experience

After the user completes the questionnaire:

1. Show the same futuristic AI loading effect.
2. Then show a result confirmation screen saying:

**Your AI matching results are ready.**

3. Show a large button:

**View My Matched Institutions**

When clicked:

* Navigate back to the User Dashboard **Explore Institutions** page.
* The Explore Institutions page should now show mock match percentages on institution cards.

Use Figma prototype interaction:

* On click → Navigate to Explore Institutions
* Transition: Instant or Dissolve

---

# 6. Logged-in Institution Detail Pages

When the logged-in user clicks an institution card from the User Dashboard Explore Institutions page, open a detailed institution page.

This page should include:

* Institution name
* Institution type
* Location
* Distance from visitor
* Average fees
* Reputation/ranking
* Study mode
* Programs/courses offered
* Overview/about section
* Why it may suit the user
* Match percentage
* AI recommendation summary
* Button: **Save Institution**
* Button: **Compare**
* Large button: **Send Application Form Now!**

The **Send Application Form Now!** button should be visually prominent, attractive, and easy to notice.

Use glowing neon styling and place it clearly near the top and/or after the main institution overview.

---

# 7. Application Form Popup

When the user clicks:

**Send Application Form Now!**

Open a popup/modal application form.

The popup should be styled as a futuristic glassmorphism modal.

The form should be partially auto-filled with basic user information.

Use mock user data:

* Full Name: Alex Rahman
* Email: [alex.rahman@email.com](mailto:alex.rahman@email.com)
* Phone Number: +971 50 123 4567
* Country: UAE
* Current Education Level: Bachelor’s Degree
* Work Experience: 3–5 years
* Preferred Study Mode: Hybrid / Online
* Preferred Field: Business, AI, Data Science

The form should also include editable fields such as:

* Selected Institution
* Selected Program / Course
* Intended Start Date
* Highest Qualification
* Current Employer, optional
* Short Statement / Motivation
* Upload Documents placeholder
* Consent checkbox

The modal should include buttons:

* **Submit Application**
* **Cancel**

After clicking **Submit Application**, show:

**Application submitted successfully.**

Show status badge:

**Received**

or

**Pending Review**

After submission:

* Add this application to the user’s **My Applications** page.
* Increase the institution’s **Filled Applications** count.
* Do not increase successful admissions/enrollments yet.

---

# 8. User Dashboard — My Applications Page

Create a **My Applications** page in the User Dashboard.

This page allows the user to view all applications they submitted.

Use a table or card-table layout.

Suggested columns:

* Institution Name
* Program / Course
* Submitted Date
* Application Status
* Last Update
* Action

Example mock rows:

| Institution                    | Program                           | Submitted Date | Status                           | Last Update | Action |
| ------------------------------ | --------------------------------- | -------------- | -------------------------------- | ----------- | ------ |
| University of Birmingham Dubai | Global MBA                        | 04 Jun 2026    | Received                         | 04 Jun 2026 | View   |
| American University of Sharjah | BSc Computer Science              | 03 Jun 2026    | Under Review                     | 04 Jun 2026 | View   |
| Coursera                       | AI & Machine Learning Certificate | 02 Jun 2026    | Accepted / Successfully Admitted | 05 Jun 2026 | View   |
| Middlesex University Dubai     | MSc Data Science                  | 01 Jun 2026    | Rejected                         | 03 Jun 2026 | View   |

Statuses should include:

* Submitted
* Received
* Under Review
* Accepted / Successfully Admitted
* Rejected

When the user clicks **View**, open a read-only application summary modal showing the submitted form information and current status.

---

# 9. Institution Dashboard Update — Applications & Admissions Overview

Update the existing Institution Dashboard.

Inside:

**Institution Dashboard → Institution Statistics**

Add the applications/admissions tracking section as the first and top item on the page.

This should appear before other charts/statistics.

Create a table-style KPI component titled:

**Applications & Admissions Overview**

Show the following counters for that institution only:

| Filled Applications | Under Review | Accepted Admissions | Rejected Applications |
| ------------------: | -----------: | ------------------: | --------------------: |
|                 128 |           46 |                  39 |                    18 |

Important logic:

* Filled Applications = all submitted application forms for this institution
* Under Review = applications currently being reviewed
* Accepted Admissions = applications accepted by this institution
* Rejected Applications = applications rejected by this institution

Below the KPI row, add a detailed application table.

Suggested columns:

* Student Name
* Email
* Phone
* Program Applied For
* Submitted Date
* Status
* Action

Example rows:

| Student Name | Email                                   | Phone            | Program                   | Submitted Date | Status       | Action    |
| ------------ | --------------------------------------- | ---------------- | ------------------------- | -------------- | ------------ | --------- |
| Sara Ahmed   | [sara@email.com](mailto:sara@email.com) | +971 50 111 2233 | Global MBA                | 03 Jun 2026    | Under Review | View Form |
| Omar Khaled  | [omar@email.com](mailto:omar@email.com) | +971 52 222 3344 | MSc Data Science          | 02 Jun 2026    | Accepted     | View Form |
| Lina Hassan  | [lina@email.com](mailto:lina@email.com) | +971 55 333 4455 | Cybersecurity Certificate | 01 Jun 2026    | Rejected     | View Form |

When the institution clicks **View Form**, open the submitted application form.

Inside the form view, provide actions:

* **Mark as Under Review**
* **Accept Application**
* **Reject Application**

After clicking **Accept Application**:

* Show: **Application accepted successfully.**
* Increase Accepted Admissions / Successful Admissions count.

After clicking **Reject Application**:

* Show: **Application rejected.**
* Increase Rejected Applications count.

If marked **Under Review**:

* Keep it under the Under Review counter.

Important:

* Each institution can only view and manage its own applications.
* Institutions cannot view applications submitted to other institutions.
* Institutions are responsible for accepting or rejecting applications.
* Successful admissions/enrollments are only counted after acceptance.

---

# 10. Super Admin Update — Manage Institutions Section

Update the existing Super Admin Dashboard sidebar.

Add or update a dedicated section called:

**Manage Institutions**

This section should contain the institution-level applications/admissions tracking.

Important:

Do not place this table inside the general Admins MIS Dashboard.

Do not place this inside the general Admin Dashboard.

This belongs inside:

**Super Admin → Manage Institutions**

Inside Manage Institutions, create a table showing all institutions and their application/admission performance.

Suggested table columns:

* Institution Name
* Institution Type
* Country
* Filled Application Forms
* Under Review
* Successful Admissions
* Rejected Applications
* Conversion Rate
* Last Updated
* Action

Example mock rows:

| Institution                    | Type            | Country | Filled Forms | Under Review | Successful Admissions | Rejected | Conversion Rate | Action       |
| ------------------------------ | --------------- | ------- | -----------: | -----------: | --------------------: | -------: | --------------: | ------------ |
| University of Birmingham Dubai | University      | UAE     |          128 |           46 |                    39 |       18 |             30% | View Details |
| American University of Sharjah | University      | UAE     |          102 |           30 |                    44 |       16 |             43% | View Details |
| Middlesex University Dubai     | University      | UAE     |           91 |           28 |                    33 |       20 |             36% | View Details |
| NADIA Training Institute       | Academy         | UAE     |           73 |           19 |                    29 |       14 |             40% | View Details |
| Astrolabs Academy              | Academy         | UAE     |           66 |           15 |                    25 |       12 |             38% | View Details |
| Coursera                       | Online Platform | Online  |          150 |           52 |                    68 |       20 |             45% | View Details |
| Udemy                          | Online Platform | Online  |          118 |           40 |                    51 |       19 |             43% | View Details |

Add filters/search controls above the table.

Super Admin should be able to filter by:

* Institution / university name
* Number of filled application forms
* Number of successful admissions / accepted students
* Institution type
* Status

Filter examples:

* Search institution name
* Minimum filled forms
* Maximum filled forms
* Minimum successful admissions
* Maximum successful admissions
* Institution type dropdown:

  * University
  * Academy
  * Online Platform

When clicking **View Details**, show an institution details panel with:

* Filled applications
* Under review
* Accepted / successful admissions
* Rejected applications
* Conversion rate
* Recent submitted applications
* Application status breakdown

Super Admin can view all institutions.

---

# 11. Super Admin — View / Update Application Form Builder

Inside the Super Admin Dashboard, under the Campaign Dashboard or Manage Institutions area, add a dropdown/page called:

**View / Update Application Form**

Preferred placement:

**Super Admin → Manage Institutions → View / Update Application Form**

The Super Admin should be able to select an institution and view/update that institution’s application form template.

Flow:

1. Super Admin opens **View / Update Application Form**.
2. Super Admin selects an institution from a dropdown.
3. The current application form template appears.
4. The form has fixed standard sections.
5. The Super Admin can add optional sections using a plus button.
6. The Super Admin can delete optional sections.
7. The Super Admin clicks **Save Form**.
8. Show confirmation:

**Form updated successfully.**

## Fixed Standard Application Sections

Create standard fixed sections common to university application forms:

1. **Personal Information**

   * Full name
   * Date of birth
   * Nationality
   * Gender
   * Country of residence

2. **Contact Information**

   * Email
   * Phone number
   * Address
   * Emergency contact

3. **Education Background**

   * Highest qualification
   * Institution attended
   * Graduation year
   * GPA / grade
   * Major / field of study

4. **Program Selection**

   * Institution
   * Program/course
   * Intake/start date
   * Study mode
   * Campus / online preference

5. **Work Experience**

   * Current employer
   * Job title
   * Years of experience
   * Professional background

6. **Supporting Documents**

   * Passport / ID upload placeholder
   * Transcript upload placeholder
   * CV upload placeholder
   * Certificate upload placeholder

7. **Declaration / Consent**

   * Accuracy confirmation
   * Data consent
   * Submit confirmation checkbox

## Optional Extra Sections

Create an **Add Section** dropdown with a plus button.

Optional sections should include:

* English Language Test
* Passport / Emirates ID Details
* Scholarship Information
* Parent / Guardian Information
* Visa Status
* Employment Information
* Portfolio Upload
* Statement of Purpose
* Recommendation Details
* Emergency Contact
* Accommodation Request
* Financial Sponsor Details
* Special Needs / Accessibility Support
* Previous University Transfer Details

When the Super Admin selects one optional section and clicks plus:

* Add that section into the form template.
* Show it as an editable section card.
* Allow the section to be removed.
* Keep fixed standard sections locked and not removable.

After clicking **Save Form**, show:

**Form updated successfully.**

---

# 12. Admin Dashboard Update — Institution Management

Update the Admin Dashboard sidebar.

Add an **Institution Management** dropdown section.

Inside it, create a page called:

**View Institution Applications**

This page allows Admin to search and view applications submitted to a selected institution.

Important:

This page should not be inside the Admin MIS Dashboard.

It should be under:

**Admin → Institution Management → View Institution Applications**

Admin flow:

1. Admin opens **View Institution Applications**.
2. Admin searches/selects an institution or university name.
3. Admin sees all students who filled application forms for that institution.
4. Admin can search students using a single text box.
5. The search box should support searching by:

   * Student name
   * Email
   * Phone number

Suggested page elements:

* Institution search/dropdown
* Student search text box
* Application status filter
* Applications table

Suggested table columns:

* Student Name
* Email
* Phone
* Institution
* Program / Course
* Submitted Date
* Status
* Action

Example rows:

| Student Name | Email | Phone | Institution | Program | Submitted Date | Status | Action |
|---|---|---|---|---|---|---|
| Sara Ahmed | [sara@email.com](mailto:sara@email.com) | +971 50 111 2233 | University of Birmingham Dubai | Global MBA | 03 Jun 2026 | Under Review | View Form |
| Omar Khaled | [omar@email.com](mailto:omar@email.com) | +971 52 222 3344 | University of Birmingham Dubai | MSc Data Science | 02 Jun 2026 | Accepted | View Form |
| Lina Hassan | [lina@email.com](mailto:lina@email.com) | +971 55 333 4455 | University of Birmingham Dubai | Cybersecurity Certificate | 01 Jun 2026 | Rejected | View Form |

When Admin clicks the student name or **View Form**:

* Open a read-only application form modal.
* Show all submitted application details.
* Show current application status.
* Show institution name and program.

Important:

* Admin can view submitted application forms.
* Admin can search and monitor application submissions.
* Admin should not edit campaign details.
* Admin should not manage other admins.
* Admin should not directly accept/reject applications unless explicitly added later.
* Institution remains responsible for accepting/rejecting applications.
* Super Admin can view all institution-level results.

---

# 13. Application Status Rules

Use consistent status badges across User, Institution, Admin, and Super Admin dashboards.

Statuses:

* Submitted
* Received
* Under Review
* Accepted
* Successfully Admitted
* Rejected

Use clear colors/states:

* Received / Submitted: neutral blue
* Under Review: amber/yellow
* Accepted / Successfully Admitted: green/cyan
* Rejected: red/pink

Important counting logic:

* Submitted form → Filled Applications +1
* Under Review → Under Review +1
* Accepted → Successful Admissions +1
* Rejected → Rejected Applications +1
* Rejected does not increase Successful Admissions
* Submitted/Received does not increase Successful Admissions

---

# 14. Navigation Requirements

Make sure all new pages are connected in prototype mode.

## User Flow

* Home → Login → Login as User → User Dashboard
* User Dashboard → Explore Institutions
* User Dashboard → Start AI Matching
* Start AI Matching → Questionnaire → Loading → View My Matched Institutions
* View My Matched Institutions → Explore Institutions
* Explore Institutions → Institution Detail Page
* Institution Detail Page → Send Application Form Now → Application Form Popup
* Submit Application → Application Submitted Success
* My Applications → View submitted applications

## Institution Flow

* Institution Dashboard → Institution Statistics
* Institution Statistics → Applications & Admissions Overview
* Application table → View Form
* View Form → Accept / Reject / Mark Under Review

## Super Admin Flow

* Super Admin Dashboard → Manage Institutions
* Manage Institutions → Filter application/admission table
* Manage Institutions → View Details
* Manage Institutions → View / Update Application Form
* View / Update Application Form → Select Institution → Add/Delete Optional Sections → Save Form

## Admin Flow

* Admin Dashboard → Institution Management
* Institution Management → View Institution Applications
* View Institution Applications → Search institution
* Search student by name/email/phone
* Click student name or View Form → Read-only application form modal

---

# 15. Final Expected Result for User Dashboard and Application / Admission Tracking

The prototype should clearly show:

1. Logged-in User Dashboard with:

   * Explore Institutions
   * Start AI Matching
   * My Applications

2. Logged-in AI matching flow:

   * Same questionnaire
   * Same loading effect
   * Button to return to Explore Institutions
   * Updated match percentages in Explore Institutions

3. Institution detail pages with:

   * Full institution information
   * Match percentage for logged-in users
   * Big **Send Application Form Now!** button
   * Popup application form with auto-filled user details

4. Application submission logic:

   * Submitted form increases Filled Applications
   * Submitted form appears in My Applications
   * Submitted form appears in Institution Dashboard

5. Institution Dashboard update:

   * Institution Statistics page starts with Applications & Admissions Overview
   * Table-style counters
   * Application list
   * Institution can accept/reject/mark under review
   * Accepted increases Successful Admissions
   * Rejected increases Rejected Applications

6. Super Admin update:

   * Dedicated **Manage Institutions** section
   * Application/admission table across all institutions
   * Filters by institution name, filled forms, and successful admissions
   * View Details panel
   * View / Update Application Form builder

7. Admin update:

   * Institution Management dropdown
   * View Institution Applications page
   * Search/select institution
   * Search students by name/email/phone
   * Click student to view submitted form

8. Clear separation:

   * Filled Applications are not admissions
   * Successful Admissions only count accepted applications
   * Institution sees only its own applications
   * Admin can view/search application forms
   * Super Admin sees all institution-level results
   * Public users do not see match percentages
   * Logged-in users can see match percentages

---

# PART B — APPLE PAY UPDATE FOR INSTITUTION DASHBOARD TOP UP CREDITS

---

# 16. Add Apple Pay to Institution Dashboard Payment Flow

Update the **SapioMatch AI Institution Dashboard** payment flow by adding **Apple Pay** as a payment option in the **Top Up Credits / Secure Payment** section.

Use the uploaded Apple Pay image as the Apple Pay logo/button visual.

Keep the same SapioMatch AI dashboard visual style:

* Futuristic AI SaaS interface
* Dark navy / black background
* Electric blue, purple, and cyan accents
* Glassmorphism cards
* Neon borders and soft glow effects
* Premium futuristic dashboard look
* Space Grotesk headings
* Inter body text
* Rounded cards, glowing selected states, and clean payment UI

---

# 17. Where Apple Pay Should Be Added

Add Apple Pay inside the **Institution Dashboard** credit top-up payment flow.

Apple Pay should appear in:

* Top Up Credits page
* Secure Payment page
* Payment method selection area
* Payment Success page as the selected payment method if chosen

The institution flow should be:

**Institution Dashboard → Top Up Credits → Select Credit Package / Custom Amount → Secure Payment → Select Apple Pay → Pay with Apple Pay → Payment Success**

---

# 18. Keep Existing Top-Up Logic

Do not remove or replace the existing credit top-up structure.

Keep:

* Current balance card
* +1000 credits card
* +2000 credits card
* +3000 credits card
* Add custom amount section
* Request Top-Up / Continue to Payment button
* Secure Payment page
* Payment Success page
* Credit balance visible at the top right

Example credit balance display:

**🪙 6,250 Credits**

This credit balance should remain visible on:

* Top Up Credits
* Secure Payment
* Payment Success

---

# 19. Secure Payment Page — Payment Methods

On the **Secure Payment** page, create a payment method selection section.

Payment methods should include:

* Credit / Debit Card
* Apple Pay
* Bank Transfer / Manual Payment

Apple Pay should be shown as a premium payment method card/button.

Suggested layout:

**Payment Method**

[ Credit / Debit Card ] [ Apple Pay ] [ Bank Transfer ]

---

# 20. Use the Uploaded Apple Pay Image

Use the uploaded Apple Pay image directly inside the Apple Pay payment option.

Important:

* Use the uploaded Apple Pay image as the visual logo/button.
* Do not recreate the Apple Pay logo manually.
* Do not redraw the Apple Pay logo.
* Do not distort, stretch, crop, or recolor the logo.
* Keep the Apple Pay image clear and readable.
* Place the logo inside a rounded payment method card.
* If the image has a light background, place it neatly within the card so it remains visible against the dark dashboard UI.

---

# 21. Apple Pay Payment Card Design

Design the Apple Pay option as:

* Rounded glassmorphism card
* Dark transparent background
* Subtle neon border
* Apple Pay logo centered
* Label: **Apple Pay**
* Hover state with blue/cyan glow
* Selected state with stronger electric blue/cyan border
* Selected checkmark badge when chosen

When Apple Pay is selected:

* Highlight the Apple Pay card
* Show a checkmark or active badge
* Change the main payment button to:

**Pay with Apple Pay**

---

# 22. Mock Apple Pay Payment Flow

This is only a UI prototype. Do not create a real payment integration.

When the institution selects Apple Pay and clicks:

**Pay with Apple Pay**

Show a futuristic loading/confirmation modal:

**Processing Apple Pay Payment...**

Then show the Payment Success page.

---

# 23. Payment Success Page

On the Payment Success page, show:

* Success icon
* Title: **Payment Successful**
* Message: **Credits added successfully.**
* Top-up amount
* Credits added
* Updated credit balance
* Payment method: **Apple Pay**
* Button: **Back to Institution Dashboard**
* Button: **View Credit History**

Example:

**Payment Method:** Apple Pay
**Credits Added:** +2,000
**Updated Balance:** 🪙 8,250 Credits

---

# 24. Important Restrictions for Apple Pay

Do not create a real Apple Pay integration.

Do not ask for:

* Real Apple Pay credentials
* Card details inside Apple Pay
* Payment gateway keys
* Real banking information

This should be a mock/demo payment UI only.

Do not remove:

* Credit / Debit Card option
* Bank Transfer / Manual Payment option
* Existing credit package cards
* Existing custom amount section

Apple Pay should be added as an additional payment option, not as a replacement.

---

# 25. Final Expected Result for Apple Pay

The Institution Dashboard payment flow should now include:

* Apple Pay payment option
* Uploaded Apple Pay image used as the logo/button visual
* Clear Apple Pay selected state
* **Pay with Apple Pay** button
* Mock processing modal
* Payment Success page showing Apple Pay as payment method
* Existing credit top-up logic preserved
* Existing credit balance display preserved
* Premium SapioMatch AI futuristic dashboard style maintained

---

# FINAL OVERALL EXPECTED RESULT

The final SapioMatch AI prototype should include:

1. A complete logged-in User Dashboard.
2. A working user AI matching flow.
3. Logged-in institution pages with match percentages.
4. A clear application form popup flow.
5. User-side My Applications tracking.
6. Institution-side Applications & Admissions Overview at the top of Institution Statistics.
7. Institution-side ability to view, accept, reject, and mark applications under review.
8. Super Admin Manage Institutions section with application/admission tracking and filters.
9. Super Admin View / Update Application Form builder.
10. Admin Institution Management page to search institutions and view submitted student forms.
11. Clear separation between Filled Applications and Successful Admissions.
12. Apple Pay added to Institution Dashboard Top Up Credits / Secure Payment flow.
13. Uploaded Apple Pay image used directly as the Apple Pay logo/button visual.
14. All designs should remain visually consistent with SapioMatch AI’s premium futuristic SaaS style.
