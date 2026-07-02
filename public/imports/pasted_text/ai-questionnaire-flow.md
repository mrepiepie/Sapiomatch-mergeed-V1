Create a new AI questionnaire experience for the existing SapioMatch AI platform.

This experience starts when the user clicks the homepage button:

“Find My Best Program”

The goal is to create a ChatGPT-style / WhatsApp-style AI advisor flow where the AI asks the user questions one by one, and the user answers each question. Since Figma has no real logic, simulate the flow using separate frames/pages.

The platform context:
SapioMatch AI is a futuristic AI-powered education matching platform that helps students, working professionals, and future learners find the best universities, academies, training providers, and professional programs based on their goals, background, budget, preferred location, delivery mode, and career direction.

The current design style:
Dark futuristic AI SaaS platform.
Use deep navy / black background, electric blue, vibrant purple, cyan accents, glassmorphism cards, glowing gradients, subtle grid patterns, neon borders, floating particles, AI orb visuals, and modern premium UI.
The design should match the existing SapioMatch AI theme, but this questionnaire section should be cleaner and more conversational.

Important UX concept:
The questionnaire should look like the user is chatting with an AI education advisor.
Do not make it look like a normal form.
It should look like a conversation screen.

Main layout:
Create a full-page AI chat interface.

Left or top area:

* SapioMatch AI logo
* Small label: “AI Program Advisor”
* Progress indicator: “Question X of 9”
* Optional mini profile card showing: “Working Professional Profile”

Main center area:
A chat window with stacked messages.

Very important:
Previous questions and answers must remain visible as the flow progresses, just like WhatsApp or ChatGPT.
Each new frame should show the previous AI questions and user answers above, then add the next new AI question or user answer below.
The previous messages should not disappear.

Message styling:
AI messages:

* Left-aligned
* Glassmorphism dark card
* Small AI avatar / glowing robot icon
* Text in white / light grey
* Optional typing indicator before the next question

User messages:

* Right-aligned
* Gradient bubble using cyan, blue, and purple
* Text in white
* Small user avatar or initials

Use smooth futuristic visuals:

* Glowing AI orb beside the chat
* Small animated-thinking robot illustration or placeholder
* Subtle floating particles
* Thin grid background
* Neon border around chat container
* Soft gradient glow behind the interface

Questionnaire flow:
Create the following frames/pages.

Frame 1: AI Advisor Welcome
Title:
“Let’s find your best-fit program.”

AI message:
“Hi, I’m your SapioMatch AI advisor. I’ll ask you a few quick questions to understand your background, goals, budget, study preferences, and career direction. Ready to start?”

Button:
“Start Matching”

Frame 2: Question 1
Progress: Question 1 of 9
AI asks:
“How old are you?”
Show answer option or input-style button:
“29”

Frame 3: Answer 1
Show previous AI question and user answer:
AI: “How old are you?”
User: “29”
Then show AI response:
“Great — that helps me understand your current learning and career stage.”

Frame 4: Question 2
Show previous chat history:
AI: “How old are you?”
User: “29”
AI: “Great — that helps me understand your current learning and career stage.”
Then AI asks:
“What is your highest completed education level?”
Show answer option:
“Bachelor’s degree”

Frame 5: Answer 2
Show all previous messages plus:
User: “Bachelor’s degree”
AI response:
“Perfect. I’ll focus on programs suitable for someone with an undergraduate academic background.”

Frame 6: Question 3
AI asks:
“What field are you interested in studying?”
Answer option:
“Law & Public Policy”

Frame 7: Answer 3
User: “Law & Public Policy”
AI response:
“Good choice. I’ll look for programs connected to policy, governance, regulation, legal studies, and public-sector leadership.”

Frame 8: Question 4
AI asks:
“What is your main goal?”
Answer option:
“Get promoted”

Frame 9: Answer 4
User: “Get promoted”
AI response:
“Understood. I’ll prioritize programs that support career advancement, leadership growth, and professional credibility.”

Frame 10: Question 5
AI asks:
“Where would you prefer to study?”
Answer option:
“Europe”

Frame 11: Answer 5
User: “Europe”
AI response:
“Great. I’ll focus on European study options and internationally recognized programs.”

Frame 12: Question 6
AI asks:
“Which study format works best for you?”
Answer option:
“Hybrid”

Frame 13: Answer 6
User: “Hybrid”
AI response:
“Hybrid learning is a strong fit for working professionals because it combines flexibility with structured academic interaction.”

Frame 14: Question 7
AI asks:
“What is your approximate budget range?”
Answer option:
“Low budget / affordable options only”

Frame 15: Answer 7
User: “Low budget / affordable options only”
AI response:
“Got it. I’ll prioritize affordable options, flexible payment possibilities, and value-for-money programs.”

Frame 16: Question 8
AI asks:
“When do you want to start?”
Answer option:
“Within 6 months”

Frame 17: Answer 8
User: “Within 6 months”
AI response:
“Thanks. I’ll focus on programs with upcoming intakes or flexible enrollment windows.”

Frame 18: Question 9
AI asks:
“How many years of work experience do you have?”
Answer option:
“3–5 years”

Frame 19: Answer 9
User: “3–5 years”
AI response:
“Excellent. This confirms you are a working professional, so I’ll focus on programs designed for career growth, promotion readiness, and practical professional development.”

Frame 20: AI Thinking / Loading Page
This page should show the full conversation summary or a compact version of it, then show the AI processing.

Headline:
“Analyzing your profile…”

Subtext:
“SapioMatch AI is comparing your goals, education background, budget, study format, preferred region, and work experience against available programs.”

Include a visible loading circle animation or animated-looking loader.
Even if Figma cannot animate it, design it as if it is animated:

* Circular loading ring
* Glowing AI orb
* Thinking robot illustration
* Animated dots: “Analyzing…”
* Floating particles
* Data streams moving into the AI orb

Show small processing steps:

* “Checking academic eligibility…”
* “Matching field of interest…”
* “Filtering by budget…”
* “Prioritizing hybrid programs…”
* “Comparing European institutions…”
* “Evaluating career advancement fit…”

Frame 21: Final Match Results Page
Headline:
“Your AI match is ready.”

Subtext:
“Based on your profile, SapioMatch AI found programs that fit a 29-year-old working professional with a bachelor’s degree, 3–5 years of experience, interest in Law & Public Policy, a promotion goal, a Europe preference, hybrid study format, affordable budget, and a 6-month start timeline.”

Show a user profile summary card:

* Age: 29
* Highest Education: Bachelor’s degree
* Field: Law & Public Policy
* Goal: Get promoted
* Preferred Region: Europe
* Format: Hybrid
* Budget: Affordable options
* Start Timeline: Within 6 months
* Work Experience: 3–5 years

Show 3 recommended program cards:

1. “Public Policy & Governance Master’s Program”
   Match Score: 94%
   Reasons:

* Strong fit for promotion goal
* Relevant to Law & Public Policy
* Available in hybrid format
* Suitable for working professionals

2. “European Law & Regulation Professional Diploma”
   Match Score: 89%
   Reasons:

* Affordable professional qualification
* Strong regional relevance
* Practical for career advancement
* Flexible learning format

3. “Leadership in Public Administration Certificate”
   Match Score: 84%
   Reasons:

* Good for promotion readiness
* Shorter completion timeline
* Suitable for 3–5 years experience
* Budget-friendly option

Add action buttons:

* “View Program Details”
* “Compare Programs”
* “Save My Results”
* “Talk to an Advisor”

Also add a final AI note:
“These recommendations are based on your current answers. You can refine your profile anytime to improve your match results.”

Navigation / prototype behavior:
Connect frames with click interactions:
Start Matching → Question 1
Answer 29 → Answer 1
Continue → Question 2
Bachelor’s degree → Answer 2
Continue → Question 3
Law & Public Policy → Answer 3
Continue → Question 4
Get promoted → Answer 4
Continue → Question 5
Europe → Answer 5
Continue → Question 6
Hybrid → Answer 6
Continue → Question 7
Low budget / affordable options only → Answer 7
Continue → Question 8
Within 6 months → Answer 8
Continue → Question 9
3–5 years → Answer 9
Continue → AI Thinking / Loading Page
View Results → Final Match Results Page

Visual requirements:
Keep the page elegant and not overcrowded.
The chat history should stack vertically, but if there are many messages, show them inside a scrollable-looking chat container.
Use a thin progress bar at the top of the chat.
Use strong but clean spacing.
The AI should feel alive through:

* AI avatar
* Thinking robot or glowing orb
* Typing dots
* Loading circle
* Data stream visual
* Soft animated-style gradients

Do not use a basic survey form layout.
Do not show all questions at once.
Do not remove previous questions and answers from later frames.
Make the full flow feel like an AI conversation that gradually builds the user profile.
