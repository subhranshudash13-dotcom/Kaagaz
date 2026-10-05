The functionality is no longer the main weakness; the product presentation is. The screenshot feels like a competent CRUD dashboard, not like a product that someone would remember from a competition.

I inspected the screenshot closely. The biggest problems are:

every action is presented as the same large card, creating visual monotony;
the orange accent is currently functioning more like a border than a brand language;
there is too much empty space above the actual information;
the navigation is overly pill-heavy;
the dashboard doesn't immediately communicate why Kaagaz is different;
the repeated Torrent/State Electricity Board entries make the data look synthetic and unfinished;
there is no strong visual hierarchy between urgent, important, and background information;
"Ask Kaagaz" is treated like a navigation destination rather than a meaningful capability;
there is no strong first-time experience;
most importantly, the UI doesn't visually tell the story of document → understanding → action.

The underlying functionality you've built is actually much stronger than the screenshot makes it appear.

Professional products such as Linear emphasize a clear product narrative, strong hierarchy, restrained UI, and purposeful workflows rather than filling the screen with cards. For document management, Paperless-ngx is also useful as a reference for information architecture: documents, metadata, filtering, document detail, provenance/history, and local processing are treated as first-class concepts.

So I would not tell Antigravity to "make the UI prettier." That's exactly how we end up with AI-slop gradients and glassmorphism.

We should give it a product redesign specification.

1. The new visual direction
Brand
Kaagaz

Life Admin Copilot

Brand personality:

Calm. Human. Intelligent. Assured.

Not:

futuristic AI / cyberpunk / enterprise SaaS / generic productivity app.

The visual metaphor should be:

Paper → clarity → action.

2. Color system

Your requested colors should absolutely become the core brand colors:

Role	Color	Hex
Primary brand	Burnt Orange	#FC6C26
Brand surface	Vanilla	#FFF4D6
Ink	Deep Navy	#172033
Background	Warm White	#F8F7F3
Surface	White	#FFFFFF
Secondary text	Slate	#667085
Border	Warm Gray	#E7E2D9
Success	Forest	#2F7D5C
Warning	Amber	#C67A1E
Danger	Brick	#B5473B
Muted surface	#F2EFE8	
Critical rule

Do not turn everything orange.

Orange should mean:

Kaagaz is asking you to notice something.

Use it for:

primary CTA
active states
important deadlines
key highlights
progress
small brand moments

Don't use it for every card border.

3. Typography

I recommend:

Headings

Manrope

font-family: Manrope
font-weight: 600–800
Body/UI

Inter

font-family: Inter
font-weight: 400–600
Data / dates / document metadata

IBM Plex Mono

Only for small technical/data elements such as:

DUE 10 OCT
₹2,481
12 DAYS
DOC-0048

This gives the product a subtle editorial/technical character without looking like a developer tool.

Type scale
Hero:
64–72px / 1.0

Page title:
40–48px

Section heading:
24–28px

Card title:
18–20px

Body:
15–16px

Metadata:
12–13px

Don't make everything huge.

The hierarchy should feel editorial.

4. The biggest dashboard change

Your current dashboard:

[ HUGE CARD ][ HUGE CARD ][ HUGE CARD ]

[ HUGE CARD ][ HUGE CARD ]

should become:

┌─────────────────────────────────────────────────────────────┐
│ Good morning, Rajesh                         + Upload        │
│ Here's what needs your attention today.                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐ ┌────────────────────────────┐
│                              │ │ YOUR MONTH                  │
│  5 things need attention     │ │                            │
│                              │ │ ₹4,981 due                 │
│  ● Overdue                   │ │ 3 documents processed      │
│  ● Coming up                │ │ 2 changes detected         │
│                              │ │                            │
│  Pay electricity bill        │ │        [mini visual]       │
│  Due in 2 days     ₹2,481   │ │                            │
│                              │ └────────────────────────────┘
│  Warranty expires            │
│  in 8 days                   │
│                              │
│  Submit notice               │
│  Due in 12 days              │
│                              │
│  View all →                  │
└──────────────────────────────┘
Why?

The user should scan a queue, not read five giant cards.

Linear is a good reference for this principle: information density is high, but hierarchy and spacing make the interface feel calm rather than cluttered.

5. New dashboard information hierarchy

The dashboard should answer five questions in order:

① What needs my attention?

Primary section.

② What changed?

Bill increase, renewal, new notice, etc.

③ What do I have?

Document overview.

④ What is coming?

Upcoming deadlines.

⑤ Can I ask something?

Ask Kaagaz.

That is much closer to the actual product philosophy:

WHAT IS THIS → WHAT MATTERS → WHAT CHANGED → WHAT DO I DO → WHEN?

6. Landing page — absolutely yes

I agree with you.

A serious product should not open directly into:

Good day, Rajesh.

A first-time visitor needs to understand Kaagaz in ~10 seconds.

I would make:

/

the marketing/product landing page.

Then:

/app

the actual application.

7. Landing page flow

Don't make it a generic:

"AI-powered document management platform."

Instead:

HERO
Small eyebrow
YOUR LIFE, IN ORDER.
Main headline

Your documents know what needs to happen next.

Supporting copy

Kaagaz reads the bills, warranties and notices you usually forget about — then turns them into clear dates, amounts, changes and actions.

CTA:

[ Try Kaagaz ]
[ See how it works ↓ ]

On the right:

Do not use a stock AI illustration.

Show an actual Kaagaz document transformation:

       ELECTRICITY BILL
       ────────────────

       Amount       ₹2,481
       Due          15 Oct
       Previous     ₹2,102

                ↓

       ┌─────────────────────┐
       │ PAY ELECTRICITY BILL│
       │                     │
       │ ₹2,481              │
       │ Due in 12 days      │
       │                     │
       │ ↑ ₹379 vs last bill │
       └─────────────────────┘

That is the product.

Not an abstract glowing AI brain.

8. Section 2 — "A document shouldn't end as a document"

This is where we explain the problem.

Three stages:

01
DROP IT IN

Your bill, warranty,
notice or receipt.


        ↓


02
KAAGAZ UNDERSTANDS

Important dates,
amounts, changes
and requirements.


        ↓


03
KNOW WHAT TO DO

Clear actions,
deadlines and history.

This should be visually beautiful but extremely restrained.

9. Section 3 — The transformation

This could become the signature visual of the website.

Left:

Before

A messy document.

Right:

After

A clean action timeline.

Example:

ELECTRICITY BILL

₹2,481

Due
15 October 2026

Previous
₹2,102

Change
↑ ₹379 · 18.0%

Then:

KAAGAZ SAYS

Pay ₹2,481
by 15 October.

Your bill is ₹379 higher
than the previous one.

This visually explains the entire product without needing paragraphs.

10. Section 4 — Why Kaagaz is different

This is where we showcase the architecture.

Heading

AI understands. You decide.

Three cards:

Local

Documents can be processed with local open models.

Explainable

Every important fact can be traced back to its source document.

Deterministic

Dates, urgency and financial comparisons are calculated by application code rather than guessed by an LLM.

This is one of the strongest technical aspects of your project.

Paperless-ngx is a useful conceptual reference here because it similarly emphasizes local document storage/processing and document metadata rather than treating documents merely as chat context.

11. Section 5 — Document types

Instead of boring cards:

Electricity
Warranty
Notice
Insurance
...

create a horizontal "paper trail":

Electricity bill ─── Warranty ─── Notice ─── Receipt
       │                  │            │
       ▼                  ▼            ▼
     PAY                RENEW        RESPOND

Each document type should have its own icon/mini-document preview.

12. Section 6 — Privacy

This needs to be a major part of the landing page.

Heading

Your paperwork is personal.

Then:

Local-first processing
Open models
No mandatory cloud AI
Your documents stay under your control

Don't overpromise "100% private" because the exact deployment configuration matters.

Instead explain the architecture honestly.

13. Section 7 — Ask Kaagaz

Only now introduce the assistant.

Example:

You:
Why was my electricity bill higher this month?

Kaagaz:

Your latest bill is ₹2,481,
compared with ₹2,102 previously.

That's an increase of ₹379
(18.0%).

Source:
October Electricity Bill

This is much more convincing than:

"Ask our AI anything."

14. Final CTA

Something simple:

Stop keeping your life in your head.

[ Organize my documents → ]

Then footer.

15. Application navigation

I would also change your current navigation.

Current:

Dashboard
Action Center
Document Vault
Ask Kaagaz

Better:

KAAGAZ

Home
Actions
Documents
────────
Ask Kaagaz

Right side:

+ Upload
Profile

Don't put everything inside giant pill containers.

16. "Ask Kaagaz" should not feel like a ChatGPT clone

This is extremely important.

Don't create:

      Ask anything...
      [ AI chat ]

Instead:

ASK KAAGAZ

What would you like to understand?

┌─────────────────────────────────────────┐
│ Why was my bill higher?                 │
└─────────────────────────────────────────┘

Try asking:

Why is my bill higher?
What expires next?
What do I need to pay this month?
Show me documents related to my warranty.

Then answers should show evidence.

17. Document Vault redesign

Your existing functionality is good.

But instead of:

[card] [card] [card]

use a document table/list:

DOCUMENTS                                  + Upload

────────────────────────────────────────────────────────

Electricity Bill
Torrent Power
Oct 2026
₹2,500
Due Oct 10                         COMING UP

────────────────────────────────────────────────────────

Electricity Bill
State Electricity Board
Oct 2026
₹2,481
↑ ₹379 vs previous                 COMING UP

────────────────────────────────────────────────────────

Samsung Warranty
Galaxy S25
Expires Jan 2028                   MONITORED

Clicking a row opens the beautiful detail view.

Paperless-ngx is a useful reference here because its document UI centers search/filter/list/detail workflows instead of forcing every document into a large card.

18. Your Review screen can become a killer feature

This is already one of the strongest parts technically.

Make it visually excellent:

┌──────────────────────────────────────────────────────────┐
│ REVIEW DOCUMENT                              1 of 1      │
│                                                          │
│ ┌──────────────────────┐  ┌───────────────────────────┐ │
│ │                      │  │ KAAGAZ FOUND              │ │
│ │                      │  │                           │ │
│ │     BILL PREVIEW     │  │ Provider                  │ │
│ │                      │  │ Torrent Power             │ │
│ │                      │  │                           │ │
│ │                      │  │ Amount                    │ │
│ │                      │  │ ₹2,500                    │ │
│ │                      │  │                           │ │
│ │                      │  │ Due date                  │ │
│ │                      │  │ 10 Oct 2026               │ │
│ │                      │  │                           │ │
│ │                      │  │ ✓ Confirmed               │ │
│ └──────────────────────┘  └───────────────────────────┘ │
│                                                          │
│               [ Confirm & Save ]                         │
└──────────────────────────────────────────────────────────┘

This should communicate:

"I can see exactly what the AI found, and I remain in control."

That is far more compelling than a normal upload modal.

19. Model integration tests

And yes — we absolutely should test the open-source model itself.

Your current:

9 passed

is good, but it doesn't prove that the actual model is working.

We need three testing layers.

Layer 1 — Unit tests

These don't require Ollama.

Test:

JSON parsing
schema validation
missing fields
invalid dates
invalid amounts
document classification mapping
rule engine
comparison engine

Example:

test_electricity_bill_schema
test_missing_due_date
test_invalid_amount
test_bill_comparison
test_urgency_calculation
20. Layer 2 — Ollama integration tests

These verify the actual runtime.

Example:

tests/integration/test_ollama.py

Test:

Ollama reachable?
        ↓
configured model exists?
        ↓
model responds?

For example:

def test_ollama_is_reachable():
    ...

def test_configured_model_exists():
    ...

def test_gemma_generates_response():
    ...

These should be clearly marked as:

@pytest.mark.ai

because they require Ollama.

21. Layer 3 — Real model extraction tests

This is the important one.

Create:

eval/
├── documents/
│   ├── electricity_bill_01.pdf
│   ├── warranty_01.pdf
│   └── notice_01.pdf
│
├── expected/
│   ├── electricity_bill_01.json
│   ├── warranty_01.json
│   └── notice_01.json
│
└── run_eval.py

Then:

document
 ↓
real Gemma
 ↓
structured output
 ↓
compare against expected values

For example:

{
  "provider": "Torrent Power",
  "amount": 2500,
  "due_date": "2026-10-10"
}

The test compares those fields against the ground truth.

22. Don't test exact LLM wording

This is a common mistake.

Don't write:

assert response == "The bill is due on..."

Instead test structured facts:

assert result.amount == 2500
assert result.due_date == date(2026, 10, 10)
assert result.provider == "Torrent Power"

That's much more robust.

23. Add a model readiness screen

This could be hidden under:

Settings → AI & Privacy

Show:

KAAGAZ AI

Local processing                         ✓

Ollama                                  ✓ Connected

Model                                   ✓ Gemma 4 E4B

Document understanding                  ✓ Ready

Last model test                         2 min ago

[ Run AI diagnostic ]

This makes your open-source AI integration visible and verifiable, rather than something buried in backend code.

24. The important part: don't fake "AI confidence"

I would actually remove the current generic:

confidence score

unless it is genuinely calculated.

Instead use:

Extracted
Needs review
Not found

or field-level provenance.

For example:

AMOUNT
₹2,481

Found in document
Page 1

That is much more trustworthy.

25. The complete new website flow

I'd make the product:

                  LANDING
                     │
          ┌──────────┴──────────┐
          │                     │
       Explore               Try Kaagaz
          │                     │
          ▼                     ▼
       Product                APP
                              │
                     ┌────────┼─────────┐
                     │        │         │
                   Home     Actions   Documents
                     │        │         │
                     │        │         │
                     └────┬───┴────┬────┘
                          │        │
                       Upload   Document
                          │       Detail
                          ▼
                        REVIEW
                          │
                     Confirm/Edit
                          │
                          ▼
                         VAULT
                          │
                          ▼
                     RULE ENGINE
                          │
             ┌────────────┼─────────────┐
             ▼            ▼             ▼
           Actions      Changes      Timeline
             │            │             │
             └────────────┴─────────────┘
                          │
                          ▼
                     ASK KAAGAZ

That is the product story.

26. One more major change: make the demo data believable

Your screenshot has:

Torrent Power ₹2500
Torrent Power ₹2500
State Electricity Board ₹2481
Torrent Power ₹2500
State Electricity Board ₹2481

This immediately makes it look like generated test data.

For the polished demo, create a coherent household story:

Electricity Bill
Torrent Power
₹2,481
↑ ₹379 vs last month
Due Oct 15


Home Insurance
HDFC ERGO
Renewal Dec 04


Laptop Warranty
Lenovo
Expires Nov 18


Municipal Notice
Property Tax
₹3,240
Due Oct 31

Then the dashboard actually feels like someone's life.

This is a small thing, but it dramatically affects perceived quality.

27. What I want Antigravity to do now

I would not ask it to "redesign the UI."

Give it this exact instruction:

Kaagaz — Product Experience & UI Evolution Master Prompt
KAAGAZ — PRODUCT EXPERIENCE EVOLUTION
Premium UI/UX + Landing Page + AI Verification

You have completed the core functional architecture of Kaagaz.

The backend currently has:

document ingestion
provisional extraction
review/confirmation
deterministic Action Center
bill comparison
Document Vault
provenance
Ask Kaagaz
persistence
automated tests

The current frontend is functional, but the visual product quality is not yet acceptable.

The objective of this phase is NOT merely to make the interface "prettier."

The objective is to make Kaagaz feel like a serious, memorable, human-centered product rather than a generic AI-generated dashboard.

1. READ BEFORE CHANGING ANYTHING

Read:

architectural_flow.md
Architecture.md
LLM_integration.md

Inspect the complete current frontend and backend.

Do not remove working functionality.

Do not rewrite the backend merely for visual reasons.

Do not change the AI architecture.

Preserve all existing API contracts unless a change is genuinely required.

2. CORE PRODUCT IDEA

Kaagaz is:

A Life Admin Copilot that turns household documents into things you need to know, remember, and do.

The experience should communicate:

DOCUMENT
→ UNDERSTAND
→ VERIFY
→ REMEMBER
→ ACT

The product should feel:

Calm
Human
Premium
Trustworthy
Editorial
Useful
Intelligent

It should NOT feel:

Generic SaaS
AI slop
Cyberpunk
Overly futuristic
Glassmorphism-heavy
Gradient-heavy
Template-generated
Enterprise compliance software
3. BRAND COLORS

Use this exact core palette.

Burnt Orange     #FC6C26
Vanilla          #FFF4D6
Deep Ink         #172033
Warm Background  #F8F7F3
White            #FFFFFF
Slate            #667085
Border           #E7E2D9
Forest           #2F7D5C
Amber            #C67A1E
Brick            #B5473B

Rules:

Burnt orange is the brand accent.
Vanilla is the supporting brand surface.
Deep Ink is the primary text.
Warm Background is the application canvas.
White is used for elevated content.
Orange must NOT be used as a border on every card.
Do not create a rainbow of status colors.
Status colors should be sparse and semantic.
4. TYPOGRAPHY

Use:

Primary display/UI font
Manrope

Weights:

600
700
800
Body/UI
Inter

Weights:

400
500
600
Data/metadata
IBM Plex Mono

Use this only for:

dates
amounts
document IDs
compact metadata
technical states

Do not use monospace for normal prose.

5. VISUAL LANGUAGE

Use:

generous but intentional whitespace
strong typography
subtle borders
restrained shadows
12–18px radii
editorial layouts
asymmetric composition where appropriate
strong alignment
large type only where it creates hierarchy
subtle motion

Avoid:

excessive rounded pills
excessive shadows
huge card grids
gradient blobs
glowing borders
floating glass cards
decorative AI illustrations
meaningless charts

The design should look designed by a strong product designer, not generated from a SaaS template.

6. INFORMATION HIERARCHY

The application should answer:

1. What needs my attention?
2. What changed?
3. What do I have?
4. What is coming?
5. What can Kaagaz explain?
7. NEW APPLICATION NAVIGATION

Replace the current oversized pill navigation with a quieter navigation system.

Structure:

KAAGAZ

Home
Actions
Documents

────────────

Ask Kaagaz

                    + Upload
                    Profile

Do not place the entire navigation inside one large rounded pill.

Active navigation should use subtle typography/accent treatment.

8. DASHBOARD REDESIGN

The current repeated large card grid is not acceptable.

Do NOT render every action as an equally sized card.

Create a dashboard with hierarchy.

Conceptually:

Good morning, Rajesh.

Here's what needs your attention today.

┌───────────────────────────────────┐
│ 5 things need your attention      │
│                                   │
│ OVERDUE                           │
│ Pay electricity bill       ₹2,481│
│ Due in 2 days                     │
│                                   │
│ COMING UP                         │
│ Warranty expires                  │
│ 8 days                            │
│                                   │
│ Submit property notice            │
│ 12 days                           │
│                                   │
│ View all actions →                │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│ THIS MONTH                        │
│                                   │
│ ₹4,981 upcoming                   │
│ 3 documents processed             │
│ 2 changes detected               │
└───────────────────────────────────┘

Use rows/list items for repeated actions.

Use cards only for information that benefits from grouping.

9. ACTION CENTER

Actions should have clear hierarchy:

DO NOW
COMING UP
MONITORED
COMPLETED

Use:

red/brick only for genuinely overdue items
burnt orange/amber for approaching deadlines
muted green for monitored/completed

Do not use orange borders around every action.

Each action should display:

Action
Amount if relevant
Deadline
Source document
Status

Allow completion without navigating away.

10. DOCUMENT VAULT

Redesign the Vault as a professional document list rather than a card grid.

Use:

DOCUMENT
TYPE
AMOUNT
DATE
STATUS

Rows should support:

filtering
search
sorting
opening detail
status

Use subtle category markers.

Do not overload each document with metadata.

11. DOCUMENT DETAIL

The document detail view should have:

Document preview
        +
Confirmed facts
        +
Provenance
        +
Actions
        +
Changes
        +
Timeline

The user should understand:

Where did this information come from?

Every important extracted field should be traceable to the source.

12. REVIEW WORKFLOW

Preserve the existing side-by-side verification workflow.

Improve its visual hierarchy.

Use:

LEFT
Document preview

RIGHT
KAAGAZ FOUND

Provider
Torrent Power

Amount
₹2,481

Due
15 Oct 2026

Source
Page 1

[ Confirm & Save ]

Do not make the review screen feel like an ordinary form.

It should feel like:

"Kaagaz is showing me what it understood, and I am approving it."

13. LANDING PAGE

Create a separate public landing page:

/

Application:

/app

The landing page must communicate the product within 10 seconds.

14. LANDING PAGE HERO

Use:

Eyebrow:

YOUR LIFE, IN ORDER.

Headline:

Your documents know
what needs to happen next.

Supporting text:

Kaagaz turns bills, warranties, notices and other paperwork
into clear dates, amounts, changes and actions.

CTA:

Try Kaagaz

Secondary:

See how it works

Do NOT use stock imagery.

The hero visual should show a real document transforming into an actionable insight.

15. LANDING PAGE SECTIONS

Build this sequence:

Hero
↓
The problem
↓
Document → Understanding → Action
↓
Interactive transformation example
↓
Core capabilities
↓
AI architecture / local processing
↓
Provenance & human verification
↓
Ask Kaagaz example
↓
Privacy
↓
Final CTA
16. HERO PRODUCT DEMONSTRATION

The visual centerpiece should show:

ELECTRICITY BILL

Amount      ₹2,481
Due         15 Oct
Previous    ₹2,102

transforming into:

PAY ELECTRICITY BILL

₹2,481

Due in 12 days

↑ ₹379
18.0% higher than previous bill

This should be a real UI component driven by application data where practical.

Do not create an abstract AI graphic.

17. "AI UNDERSTANDS. YOU DECIDE."

Make this a major section.

Explain:

Local
Documents can be processed using local open models.

Explainable
Important facts retain source provenance.

Deterministic
Dates, urgency and financial comparisons are calculated
by application code.

Do not make unverifiable privacy claims.

18. ASK KAAGAZ

Do not turn this into a generic ChatGPT clone.

The interface should offer contextual questions:

Why was my bill higher?

What expires next?

What do I need to pay this month?

Show me my warranty details.

Responses must show source documents.

Preserve the existing confirmed-facts-only architecture.

19. DEMO DATA QUALITY

The current repeated demo records make the application look unfinished.

Create a coherent synthetic household dataset.

Use clearly fictional/synthetic data such as:

Torrent Power
₹2,481
Due Oct 15

Home Insurance
₹8,240 annual premium
Renewal Dec 04

Laptop Warranty
Expires Nov 18

Property Tax Notice
₹3,240
Due Oct 31

Do NOT use real people's private documents.

Do NOT fabricate real-world claims.

The dataset should tell a coherent household story.

20. AI MODEL VERIFICATION

The current tests verify application behavior, but add explicit tests for the actual open-source AI stack.

Create:

backend/tests/integration/test_ollama.py

and:

eval/
├── documents/
├── expected/
├── run_eval.py
└── README.md
21. OLLAMA HEALTH TESTS

Implement tests for:

Ollama reachable
Configured model exists
Model responds

Example categories:

test_ollama_reachable()
test_configured_model_available()
test_gemma_generates_response()

Mark these as AI/integration tests so they can be skipped when local AI is unavailable.

22. REAL GEMMA EXTRACTION TEST

Create synthetic evaluation documents.

For every document:

document
→ real Gemma
→ structured JSON
→ Pydantic
→ expected-value comparison

Do not test exact natural-language responses.

Test facts:

provider
amount
due_date
document_type
warranty_expiry
deadline

Example:

assert result.amount == expected.amount
assert result.due_date == expected.due_date
23. MODEL READINESS COMMAND

Create a developer command that reports:

KAAGAZ AI DIAGNOSTIC

Ollama             ✓
Configured model   ✓
Model inference    ✓
Structured output  ✓
Schema validation  ✓

AI STATUS: READY

If something fails, report:

Ollama unavailable
Model missing
Inference failed
Invalid model output

Never fake readiness.

24. MODEL EVALUATION

Create an evaluation runner that measures:

Document classification accuracy
Field accuracy
Date accuracy
Amount accuracy
Missing-field behavior
Malformed-output rate
Latency

Do not invent benchmark results.

Only display measured results.

25. RESPONSIVE DESIGN

The application and landing page must work on:

Desktop
Tablet
Mobile

Do not simply shrink the desktop layout.

For mobile:

navigation becomes compact
action rows become stacked
document preview/review becomes vertical
CTA remains accessible
typography scales appropriately
26. MOTION

Use motion sparingly.

Allowed:

page fade/slide transitions
subtle list entrance
upload progress
confirmation transition
document-to-action transformation

Avoid:

constant floating elements
excessive parallax
spinning AI graphics
distracting hover animations

Motion should communicate state.

27. ACCESSIBILITY

Maintain:

keyboard navigation
semantic HTML
visible focus states
adequate contrast
accessible buttons
labels for inputs
reduced-motion support
28. ENGINEERING RULE

Do not rewrite working backend functionality simply to achieve visual changes.

Do not break existing:

upload
review
confirmation
action generation
comparison
vault
provenance
assistant

Run the complete test suite after the redesign.

29. ACCEPTANCE CRITERIA

The redesign is complete only when:

Product

The user can understand what Kaagaz does within seconds.

Visual

The application no longer resembles a generic dashboard template.

Dashboard

Actions have hierarchy rather than equal-sized cards.

Brand

Burnt orange + vanilla are recognizable without overwhelming the interface.

Landing

A first-time visitor can understand the product without entering the app.

AI

The real Ollama/Gemma integration has automated health/integration tests.

Trust

The product visibly communicates verification and provenance.

Engineering

Existing backend tests continue passing.

Build

Frontend production build succeeds.

30. FINAL TEST

After implementation run:

pytest
npm run build

and, when Ollama is available:

pytest -m ai

Then manually verify:

Landing
→ Try Kaagaz
→ Dashboard
→ Upload
→ Review
→ Confirm
→ Action Center
→ Document Vault
→ Document Detail
→ Ask Kaagaz

Do not stop after changing CSS.

The entire product journey must feel coherent.

31. DESIGN NORTH STAR

The final product should make someone think:

"This isn't another AI dashboard."

It should make them think:

"This understands the annoying paperwork I normally have to remember myself."

Build toward that feeling.

Do not add visual effects merely to make screenshots impressive.

Build a product whose usefulness is visually obvious.

One final strategic point

I would not chase "award-winning" by adding more features now.

You already have enough functionality.

Your strongest competition story is becoming:

Kaagaz turns passive documents into an active life-admin system — using local open-source AI to understand them, deterministic software to reason about deadlines and changes, and human verification to keep the user in control.

That's a genuinely coherent product thesis.

And the landing page should demonstrate that thesis, not tell people that Kaagaz is "AI-powered."