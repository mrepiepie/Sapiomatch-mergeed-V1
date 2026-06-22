Create the **SapioMatch AI Admin Dashboard** interface and connect it correctly to the public website login flow.

Keep the same overall visual style used across the SapioMatch AI dashboards:

* Futuristic AI SaaS interface
* Dark navy / black background
* Electric blue, purple, and cyan accents
* Glassmorphism cards
* Neon borders and soft glow effects
* Premium futuristic dashboard look
* Space Grotesk for headings
* Inter for body text
* Clean left-hand sidebar layout
* Consistent spacing, padding, rounded corners, and hover/active states

---

## 1. Login Navigation Requirement

Make sure the **Admin Dashboard** is accessible from the main public website login flow.

From the public website:

* User clicks **Login**
* The Login / Role Selection page opens
* The Login page should show role-based login cards:

  * Login as User
  * Login as Institution
  * Login as Admin
  * Login as Super Admin

When the user clicks **Login as Admin**, navigate directly to the **Admin Dashboard**.

Important:

* Do not create a separate “Learning” page before the Admin Dashboard.
* Do not route Admin through any student/user learning flow.
* Do not show questionnaire pages before the Admin Dashboard.
* Admin login should go directly to the Admin Dashboard interface.
* Use Figma prototype interaction:

  * On click → Navigate to Admin Dashboard
  * Transition: Instant or Dissolve

---

## 2. Overall Admin Dashboard Purpose

The Admin Dashboard is an operational dashboard.

The Admin can:

* View user MIS and user activity
* View institution and campaign visibility data
* View current institution credits
* Send reminders to institutions
* Request add/delete/update actions for users
* Track approval requests sent to the Super Admin

Important restrictions:

* Admin cannot view, add, delete, update, or manage other admins.
* Admin cannot directly apply add/delete/update changes.
* Admin cannot edit or control institution campaign details.
* Campaign details remain the responsibility of the institution itself.
* Sensitive approval remains under the Super Admin.

---

## 3. Left Sidebar Menu Structure

Create the left sidebar with this exact structure:

### Dashboard

Dropdown section containing:

* Admin Dashboard
* Campaign Dashboard

### User Management

Dropdown section containing:

* Add User
* Delete User
* Update / Modify User

### Approval Requests

Single normal sidebar item/button.

### Reminders

Single normal sidebar item/button.

Do not create a Reports section.

Do not create an Admin Management section.

---

## 4. Admin Dashboard Page

The **Admin Dashboard** page should focus on users MIS.

This page should show everything related to platform users.

Include futuristic KPI cards such as:

* Total Users
* Active Users
* New Users This Month
* Completed Questionnaires
* Average Matching Score
* Saved Programs
* High-Intent Users
* Inactive Users

Include dashboard visuals such as:

* User growth chart
* Matching activity chart
* Top preferred countries
* Top program categories / fields of study
* Recent user activity table

Include a user table with mock data.

Suggested table columns:

* User Name
* Email
* Country
* User Type
* Matching Status
* Last Active
* Status

Important:

* Do not show admins in this page.
* Do not include any admin management features.
* This page is for platform users only.

---

## 5. Campaign Dashboard Page

The **Campaign Dashboard** page should focus on institutions and campaign visibility.

This page should show everything related to institutions.

Include futuristic KPI cards such as:

* Total Institutions
* Active Institutions
* Pending Institutions
* Institutions With Active Campaigns
* Institutions With Low Credits
* Total Leads Accessed
* Credit Usage
* Recent Top-Ups

Include visuals such as:

* Institution activity chart
* Credit usage chart
* Lead access chart
* Campaign visibility overview
* Institution engagement table

Include an institution table with mock data.

Suggested table columns:

* Institution Name
* Country
* Current Credits
* Campaign Status
* Leads Accessed
* Last Top-Up
* Last Reminder Sent
* Status

Add a section where Admin can select a specific institution / university / organization.

When an institution is selected, show a detailed institution card with:

* Institution name
* Current credit balance
* Campaign status
* Leads accessed
* Credits consumed
* Last top-up date
* Last reminder sent
* Reminder status

Important restrictions:

* Admin can view campaign information, but cannot edit campaign details.
* Do not include buttons for editing campaign details.
* Do not allow Admin to change campaign budget, campaign content, campaign targeting, lead pricing, credit rules, or campaign settings.
* Campaign management remains the responsibility of the institution itself.

---

## 6. Add User Page

Create an **Add User** page under User Management.

This page should contain a form for the Admin to request adding a new user.

Include fields such as:

* Full Name
* Email Address
* Phone Number
* Country
* User Type
* Notes / Reason for Adding User

Important:

The Admin cannot directly create the user.

The main action button should be:

**Send Approval Request to Super Admin**

After clicking, show:

**Approval request sent successfully.**

Also show a status badge:

**Pending Super Admin Approval**

---

## 7. Delete User Page

Create a **Delete User** page under User Management.

This page should allow the Admin to select a user and request deletion.

Include:

* Search / Select User
* User summary card
* User name
* Email
* Country
* Current status
* Reason for deletion
* Confirmation checkbox

Main action button:

**Send Approval Request to Super Admin**

After clicking, show:

**Approval request sent successfully.**

Status badge:

**Pending Super Admin Approval**

Important:

* Admin cannot directly delete the user.
* The deletion only becomes active after Super Admin approval.

---

## 8. Update / Modify User Page

Create an **Update / Modify User** page under User Management.

This page should allow the Admin to select a user and request changes.

Include:

* Search / Select User
* Current user details
* Editable requested fields
* Reason for modification
* Before vs After comparison card

Main action button:

**Send Approval Request to Super Admin**

After clicking, show:

**Approval request sent successfully.**

Status badge:

**Pending Super Admin Approval**

Important:

* Admin cannot directly update the user.
* The update only becomes active after Super Admin approval.

---

## 9. Approval Requests Page

Create an **Approval Requests** page.

This page should show all approval requests submitted by the Admin to the Super Admin.

Include a table with mock data.

Suggested table columns:

* Request ID
* Request Type
* Target Type
* Target Name
* Submitted Date
* Submitted By
* Status
* Super Admin Decision
* Notes

Request types can include:

* Add User
* Delete User
* Update / Modify User
* Add Institution
* Delete Institution
* Update / Modify Institution

Statuses should include:

* Pending Super Admin Approval
* Approved
* Rejected
* Sent Back for Revision

Use clear futuristic status badges.

---

## 10. Reminders Page

Create a **Reminders** page focused on institution reminders.

The Admin can send operational reminders to institutions.

Include:

* Select Institution dropdown/search
* Institution current credit balance
* Institution campaign status
* Last reminder sent
* Reminder type dropdown
* Message template preview
* Optional custom note field
* Send Reminder button
* Reminder history table

Reminder type options:

* Low Credit Balance
* Campaign Credits Running Low
* Pending Top-Up
* Incomplete Institution Profile
* Missing Academic Data
* General Reminder

When the Admin clicks **Send Reminder**, show:

**Reminder sent successfully.**

Add a status badge:

**Sent**

Reminder history table columns:

* Date
* Institution Name
* Reminder Type
* Sent To
* Status
* Sent By

Important:

* Sending reminders does not require Super Admin approval.
* Reminders are operational communication only.
* Admin cannot change credits, pricing, campaign details, or commercial rules from the Reminders page.

---

## 11. Institution Add / Delete / Update Logic

Even though the sidebar does not need separate Institution Management pages at this stage, the system logic should still recognize that Admin may request institution changes from the Campaign Dashboard or relevant institution action areas.

If any Add Institution, Delete Institution, or Update / Modify Institution action is shown, it must follow this rule:

* Admin can prepare the request.
* Admin cannot apply the change directly.
* The action button must say:

**Send Approval Request to Super Admin**

After clicking, show:

**Approval request sent successfully.**

Status badge:

**Pending Super Admin Approval**

---

## 12. Final Requirements

The final Admin Dashboard should clearly communicate:

* Admin login flow is: Home → Login → Login as Admin → Admin Dashboard
* Admin Dashboard = everything about users MIS
* Campaign Dashboard = everything about institutions and campaign visibility
* User Management = add/delete/update user requests
* Approval Requests = tracking requests sent to Super Admin
* Reminders = sending and tracking institution reminders
* No Reports section
* No Admin Management section
* Admin cannot view other admins
* Admin cannot edit campaign details
* Admin cannot directly apply sensitive changes
* Super Admin approval is required for add/delete/update actions
* The UI must remain premium, futuristic, clean, and consistent with the rest of SapioMatch AI
