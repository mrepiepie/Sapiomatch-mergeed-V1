Create the **Institution Dashboard** for SapioMatch AI.

This dashboard should open when the user goes to:

Login Page → scroll to “Not a learner?” → click “Institution”

For the current prototype, clicking “Institution” should directly navigate to the Institution Dashboard.

Use the same SapioMatch AI visual style already used across the platform:

* Futuristic AI SaaS interface
* Dark navy / black background
* Electric blue, purple, and cyan accents
* Glassmorphism cards
* Neon borders
* Soft glowing buttons
* Premium dashboard look
* Secure fintech-style payment visuals where payment is shown
* Space Grotesk for headings
* Inter for body text
* Floating particles, gradients, and subtle AI-style visuals

The Institution Dashboard must have:

1. A left-hand sidebar menu
2. A top header
3. A main content area
4. A clear “Back to Home” or “Exit Dashboard” button
5. Breadcrumb navigation where useful
6. A credit balance display always visible at the top right

Users should never feel trapped inside the dashboard.

---

SIDEBAR STRUCTURE

Create a left sidebar with this structure:

Dashboard

* Institution Statistics

Activities

* Add Program / Course
* Delete Program / Course
* Update / Modify Program / Course

Top Up Credits

* +1000 Credits
* +2000 Credits
* +3000 Credits
* Add Custom Amount

The sidebar should be expandable/collapsible.

Collapsed state:

* Show icons only

Expanded state:

* Show icons + full text labels

Use dropdown behavior for Dashboard, Activities, and Top Up Credits.

---

GLOBAL CREDIT BALANCE DISPLAY

Add a credit balance display that is always visible at the top right of the Institution Dashboard header.

It should appear on every Institution Dashboard page, including:

* Institution Statistics
* Add Program / Course
* Delete Program / Course
* Update / Modify Program / Course
* Top Up Credits
* Payment Page
* Payment Success Page

Design it as a small premium rectangle/pill.

Example:

🪙 4,250 Credits

Use a coin symbol or coin icon beside the credit number.

The credit balance should look important and clickable, but not too large. It should stay fixed in the top-right header area at all times.

---

PAGE 1: INSTITUTION STATISTICS

When the user clicks:

Dashboard → Institution Statistics

Create a page titled:

Institution Dashboard — Statistics & Visibility

Subtitle:

Track your institution reach, visitor activity, search visibility, and program engagement on SapioMatch AI.

At the top of the page, add a strong ranking card:

“You are #7 most reached institution this month”

Below it, add a smaller explanation:

Ranking is based on institution profile visits, ad clicks, program views, search appearances, and user engagement.

Also show a small “Ranking Logic” card or tooltip-style box explaining:

Institution Reach Ranking is calculated from:

* Number of profile visitors
* Number of ad clicks
* Number of program/course views
* Number of search result appearances
* Number of users who saved or contacted the institution

---

VISITOR STATISTICS KPI CARDS

Add KPI cards in a premium glassmorphism flashcard style.

Cards should include:

1. Visitors Today
   Example value: 148
   Trend: +12% compared to yesterday

2. Visitors This Week
   Example value: 1,240
   Trend: +8% compared to last week

3. Visitors This Month
   Example value: 5,860
   Trend: +18% compared to last month

4. Program Views This Month
   Example value: 3,420
   Trend: +14%

5. Ad Clicks This Month
   Example value: 920
   Trend: +9%

6. Contact Requests
   Example value: 86
   Trend: +6%

Important definition:

Visitors means actual users who clicked on the institution ad, institution profile, or institution/program listing.

---

VISITOR GROWTH CHART

Add a large line chart titled:

Institution Visitor Growth

The chart should show daily visitors over the last 30 days.

The line should visually show whether visitors are growing, decreasing, or stable.

Under the chart, add an AI-style summary message card:

“Your institution visibility increased by 18% this month, mainly driven by higher searches for business and MBA-related programs.”

Make the summary message look intelligent and modern, like an AI insight.

---

TOP 10 POPULAR SEARCH ITEMS

Add a section titled:

Top 10 Popular Search Items

This section should show what users are searching before reaching or discovering the institution.

Use a ranked glassmorphism table with these columns:

* Rank
* Search Item
* Searches
* Trend

Use these example rows:

1. MBA courses in Sharjah — 1,240 — Up
2. BBA courses in Ajman — 1,110 — Up
3. AI diploma UAE — 980 — Stable
4. Cybersecurity bachelor degree — 870 — Up
5. Affordable MBA programs — 760 — Down
6. Business administration courses — 720 — Up
7. Engineering programs UAE — 690 — Stable
8. Online management diploma — 610 — Up
9. Weekend courses for professionals — 540 — Stable
10. Short professional certificates — 490 — Down

Use color indicators:

* Green for Up
* Blue or neutral for Stable
* Amber/red for Down

---

PAGE 2: ADD PROGRAM / COURSE REQUEST

When the user clicks:

Activities → Add Program / Course

Create a page titled:

Add Program / Course Request

Subtitle:

Submit a new program or course to be reviewed before publication.

Add this field:

* Enter Course CRN or Program Name

Use placeholder text:

“Enter course CRN or program name…”

Add a button:

Submit Request

After the user clicks “Submit Request”, show this success message:

“Request submitted successfully.”

Also show a small status badge:

“Pending Approval”

Add an information note:

“Submitted programs or courses will not appear publicly until reviewed and approved by Admin or Super Admin.”

Important:

The institution cannot directly publish a program or course. It can only submit a request.

---

PAGE 3: DELETE PROGRAM / COURSE REQUEST

When the user clicks:

Activities → Delete Program / Course

Create a page titled:

Delete Program / Course Request

Subtitle:

Submit a deletion request for an existing program or course.

Add these fields:

1. Enter Course CRN or Program Name
   Placeholder:
   “Enter course CRN or program name…”

2. Reason for Deletion
   Placeholder:
   “Explain why this program or course should be deleted…”

Add a button:

Submit Request

After the user clicks “Submit Request”, show this success message:

“Request submitted successfully.”

Also show a small status badge:

“Pending Approval”

Add a caution note:

“Deletion requests require review to protect data accuracy and avoid accidental removal of active programs.”

Use amber/red warning accents on this page, but keep the overall futuristic SaaS style.

---

PAGE 4: UPDATE / MODIFY PROGRAM / COURSE REQUEST

When the user clicks:

Activities → Update / Modify Program / Course

Create a page titled:

Update / Modify Program / Course Request

Subtitle:

Submit changes to an existing program or course for review and approval.

Add these fields:

1. Enter Course CRN or Program Name
   Placeholder:
   “Enter course CRN or program name…”

2. Reason for Update
   Placeholder:
   “Explain why this update is needed…”

3. Requested Update Details
   Placeholder:
   “Enter the new program name, updated course title, revised description, duration, fee, entry requirement, or any other requested change…”

Add a button:

Submit Request

After the user clicks “Submit Request”, show this success message:

“Request submitted successfully.”

Also show a small status badge:

“Pending Approval”

Add an information note:

“Requested changes will only become visible after approval by Admin or Super Admin.”

---

APPROVAL LOGIC TO SHOW IN THE UI

Make it clear across all Activities pages that:

* Institutions can submit requests
* Institutions cannot directly publish changes
* Add / Delete / Update requests must be approved by Admin or Super Admin
* After submission, the request status becomes “Pending Approval”

Use small status badges such as:

Pending Approval
Submitted
Awaiting Review

The success message for all activity submissions must be:

“Request submitted successfully.”

The message should appear as a modern success toast, modal, or confirmation card with a green success icon.

---

PAGE 5: TOP UP CREDITS

When the institution clicks:

Top Up Credits

Create a page titled:

Top Up Credits

Subtitle:

Add credits to your institution account to access platform services, campaigns, and learner engagement features.

Show the current balance at the top of the page:

Current Balance: 🪙 4,250 Credits

Create credit top-up option cards:

1. +1000 Credits
2. +2000 Credits
3. +3000 Credits
4. Add Custom Amount

For “Add Custom Amount”, show an input box.

Placeholder:

“Enter custom credit amount…”

After the institution selects an amount, show a button:

Request Top-Up

When the institution clicks “Request Top-Up”, navigate to the Payment Page.

---

PAGE 6: SECURE CREDIT PAYMENT

Create a secure-looking payment page.

Page title:

Secure Credit Payment

Subtitle:

Complete your card payment to add credits to your institution balance.

Show a secure payment visual area with:

* Lock icon
* “Secure Payment”
* “Encrypted card transaction”
* Card payment only

Do not add Apple Pay, Google Pay, bank transfer, or PayPal.

Only include card payment.

Add a payment summary card.

Example:

Selected Credits: +1000 Credits
Current Balance: 4,250 Credits
New Balance After Payment: 5,250 Credits

The selected credits should change visually depending on the selected amount:

* +1000 Credits
* +2000 Credits
* +3000 Credits
* Custom amount

Add card payment fields:

1. Card Number
   Placeholder:
   “1234 5678 9012 3456”

2. Expiry Date
   Placeholder:
   “MM / YY”

3. CVV
   Placeholder:
   “123”

4. Cardholder Name
   Placeholder:
   “Name on card”

Add a primary button:

Pay Now

---

PAGE 7: PAYMENT SUCCESS STATE

After clicking “Pay Now”, show a success confirmation.

Message:

“Payment successful. Credits added to your balance.”

Also show:

Previous Balance: 4,250 Credits
Credits Added: +1000 Credits
Updated Balance: 5,250 Credits

The credit balance in the top-right header should automatically update after successful payment.

For prototype purposes, this is fake payment logic and only needs to be visually represented.

Add a button:

Back to Institution Dashboard

---

CREDIT SYSTEM DESIGN NOTES

The credit system should feel professional and secure, like a fintech/SaaS payment flow.

Use:

* Coin icon
* Lock icon
* Secure payment badge
* Green success state
* Glassmorphism payment cards
* Neon blue/purple highlights
* Clean payment form
* Clear credit balance update animation or visual transition if possible

Make sure the credit balance stays visible at all times in the top-right dashboard header.

---

GLOBAL NAVIGATION RULE

Every page inside the Institution Dashboard must include one of the following:

* Back to Home
* Exit Dashboard
* Back to Previous Page
* Breadcrumb navigation

Use breadcrumbs such as:

Home / Institution Dashboard / Institution Statistics

Home / Institution Dashboard / Activities / Add Program

Home / Institution Dashboard / Activities / Delete Program

Home / Institution Dashboard / Activities / Update Program

Home / Institution Dashboard / Top Up Credits

Home / Institution Dashboard / Top Up Credits / Secure Payment

Home / Institution Dashboard / Top Up Credits / Payment Success

The “Back to Home” or “Exit Dashboard” button should take the user back to the public homepage.

The user should never feel trapped inside the dashboard.

---

FINAL OUTPUT EXPECTATION

Generate the full Institution Dashboard UI with:

* Left sidebar
* Top header
* Main content area
* Credit balance always visible in the top-right header
* Institution Statistics page
* Ranking card
* Visitor KPI cards
* Visitor growth line chart
* AI summary message under chart
* Top 10 Popular Search Items table
* Activities dropdown
* Add Program / Course Request page
* Delete Program / Course Request page
* Update / Modify Program / Course Request page
* Universal “Request submitted successfully.” message
* Request approval logic
* New Top Up Credits sidebar section
* Preset credit options: +1000, +2000, +3000
* Custom credit amount option
* Request Top-Up button
* Secure card-only payment page
* Pay Now button
* Payment success state
* Automatic visual update of credit balance after successful payment
* Back / Exit navigation
* Breadcrumb navigation

Make the design look like a premium, futuristic, AI-powered SaaS dashboard, consistent with SapioMatch AI.
