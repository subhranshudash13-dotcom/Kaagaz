KAAGAZ — Complete Architecture & Execution Blueprint

Project: Kaagaz — Life Admin Copilot
Challenge: Hacktoberfest 2026 — Build for a Friend
Primary goal: Build a genuinely useful, privacy-first life-admin system for one real person, powered by open-source AI at its core.
Execution target: Antigravity should be able to use this document as the single source of truth for implementation.

0. PRODUCT NORTH STAR

One-line product

Kaagaz turns messy household documents into clear, actionable things a person needs to know, remember, and do.

The problem

People accumulate:

electricity bills

insurance policies

warranties

receipts

school/college notices

service documents

subscriptions

government letters

invoices

certificates

bank/financial paperwork

The problem is not simply that these documents are hard to read.

The real problem is:

Important information is trapped inside documents, while the user thinks in terms of tasks, deadlines, money, and decisions.

Kaagaz bridges that gap.

Input

PDF
Image
Scanned document
Photograph of paperwork

Transformation

DOCUMENT
   ↓
UNDERSTAND
   ↓
EXTRACT VERIFIED FACTS
   ↓
DETECT IMPORTANT DATES / MONEY / REQUIREMENTS
   ↓
COMPARE WITH PREVIOUS DOCUMENTS
   ↓
GENERATE DETERMINISTIC ACTIONS
   ↓
SURFACE WHAT NEEDS ATTENTION

Output

"What do I need to do?"
"What is changing?"
"What is due?"
"What am I missing?"
"What should I remember?"

1. PRODUCT PRINCIPLES

These are non-negotiable.

1.1 AI is the understanding layer, not the authority layer

The open model may:

classify a document

read text/images

extract fields

identify candidate facts

explain extracted information

answer questions over confirmed document data

The model must NOT silently decide:

due dates

urgency

financial deltas

reminders

whether a deadline has passed

whether a document is complete

Those are calculated by application code.

This follows the core architecture from the supplied build guide: the model extracts fields; deterministic rules create events/actions.

1.2 Human confirmation is mandatory before persistence

Every uploaded document goes through:

UPLOAD
→ PROCESS
→ REVIEW
→ CONFIRM
→ SAVE

Never:

UPLOAD
→ AI
→ PERMANENTLY SAVE

The review screen is a trust feature.

1.3 Privacy is a product feature

The strongest open-AI story is:

Your family's paperwork can stay on your machine.

No closed AI API should be required for the core flow.

1.4 Every AI-generated fact must have provenance

For extracted fields, store:

value

source document

page

extraction confidence

whether user confirmed/edited it

Example:

{
  "field": "due_date",
  "value": "2026-10-08",
  "source_page": 1,
  "confidence": 0.96,
  "user_confirmed": true
}

1.5 The interface should answer questions, not expose implementation

Avoid making the main UI feel like an AI laboratory.

The user should see:

what needs attention

what changed

what is due

what is missing

what was recently uploaded

2. TARGET USER

Primary persona

Start with one real person.

Do not build for "everyone."

The first person should have recurring paperwork such as:

electricity/utility bills

warranties

insurance

notices

receipts

service documents

The document types in the MVP should be selected around their actual life.

Persona configuration

Store:

name
preferred_language
timezone
currency
household_label
document_types

Example:

{
  "name": "Mom",
  "preferred_language": "English",
  "timezone": "Asia/Kolkata",
  "currency": "INR"
}

Hindi labels may be enabled if the real user prefers them.

3. CORE USER JOURNEY

Journey A — First use

LANDING
   ↓
"Built for [Person]"
   ↓
DASHBOARD
   ↓
EMPTY STATE
   ↓
"Add your first document"
   ↓
UPLOAD

The first-run experience should explain:

"Kaagaz reads the paperwork. You confirm what it found. Then it turns important information into things you can act on."

4. DOCUMENT INGESTION WORKFLOW

Supported inputs

MVP:

PDF

JPG

JPEG

PNG

Future:

HEIC

DOCX

camera capture

email ingestion

Upload workflow

User selects file
       ↓
Validate type
       ↓
Validate size
       ↓
Create temporary upload ID
       ↓
Detect PDF/image
       ↓
Extract machine-readable text
       ↓
If text insufficient:
    rasterize relevant PDF pages
    → vision-capable Gemma
       ↓
Document classification
       ↓
Schema selection
       ↓
Structured extraction
       ↓
Validation
       ↓
Review UI

Upload constraints

Implement:

max file size

duplicate detection

unsupported file handling

corrupt file handling

page count limit

processing timeout

cancellation

clear errors

Suggested MVP defaults:

max file size: 15 MB
max pages: 15

These values can be changed in configuration.

5. DOCUMENT CLASSIFICATION

Initial document types

Implement only the types that match the real person's documents.

Recommended initial three:

electricity_bill

warranty

notice

Additional extensible types:

insurance_policy
invoice
receipt
subscription
government_notice
medical_bill
school_notice
college_notice
service_receipt
bank_document

Do not implement all of them before the core three are reliable.

Classification output

{
  "doc_type": "electricity_bill",
  "confidence": 0.94,
  "reason": "Contains provider, billing period, amount due and due date."
}

If confidence is below threshold:

"Kaagaz isn't sure what type of document this is."

Allow the user to choose the type manually.

6. EXTRACTION SCHEMAS

Use Pydantic models.

Electricity bill

provider
account_reference
billing_period_start
billing_period_end
issue_date
due_date
amount_due
previous_amount
units_consumed
meter_number
service_address

Warranty

product
brand
model
serial_number
purchase_date
warranty_months
expiry_date
seller
service_contact
invoice_reference

Notice

issuer
notice_date
subject
deadline
amount
required_documents[]
contact_information
instructions

Insurance

provider
policy_number
policy_type
insured_name
start_date
expiry_date
premium
sum_insured
renewal_date
contact_information

Only add the schema when it is justified by the target person's actual documents.

7. AI EXTRACTION CONTRACT

Model

Primary target:

Gemma via Ollama, using a vision-capable model/tag appropriate for the available machine.

The exact model size should be selected based on the laptop's RAM/VRAM.

Prompt rules

The extraction system prompt must enforce:

1. Extract only information present in the document.
2. Never invent missing fields.
3. Return null when information is absent.
4. Preserve numbers exactly.
5. Preserve printed dates before normalization.
6. Never infer a deadline.
7. Never calculate a financial change.
8. Return structured JSON only.
9. If text is ambiguous, mark the field uncertain.
10. Do not treat surrounding context as evidence unless it is printed.

Important distinction

Store both:

raw_value
normalized_value

Example:

{
  "raw_value": "08/10/2026",
  "normalized_value": "2026-10-08"
}

This preserves the evidence.

8. EXTRACTION PIPELINE

Text PDF

PDF
 ↓
PyMuPDF / pdfplumber
 ↓
Extract text
 ↓
Gemma structured extraction

Scanned PDF

PDF
 ↓
PyMuPDF
 ↓
Render page(s)
 ↓
Gemma vision
 ↓
Structured extraction

Image

IMAGE
 ↓
Gemma vision
 ↓
Structured extraction

Low-quality document

If extraction quality is poor:

AI identifies uncertainty
 ↓
Review screen highlights uncertain fields
 ↓
User corrects
 ↓
Confirmed value becomes authoritative

9. TRUST / REVIEW WORKFLOW

This is one of the most important screens.

Layout

┌──────────────────────────────────────────────┐
│ Review document                              │
├────────────────────┬─────────────────────────┤
│                    │ Extracted information    │
│                    │                         │
│   DOCUMENT         │ Provider: [ElectricCo]  │
│   PREVIEW          │ Due date: [08 Oct 2026] │
│                    │ Amount: [₹2,481]        │
│                    │                         │
│                    │ ⚠ Confirm before saving │
│                    │                         │
│                    │ [Confirm & Save]         │
└────────────────────┴─────────────────────────┘

Every field must be editable.

For uncertain fields:

⚠ Needs review

After user edits:

user_confirmed = true

10. NORMALIZATION

After confirmation:

printed date
   ↓
date parser
   ↓
ISO date

Example:

"8 October 2026"
→ 2026-10-08

Store original printed value.

Never overwrite source evidence.

11. DETERMINISTIC RULE ENGINE

The rule engine is responsible for converting confirmed facts into actions.

Required functions

to_date()
missing_fields()
days_until()
urgency()
build_actions()
compare_previous()
detect_expiry()
detect_deadline()

Urgency

Suggested:

≤ 3 days       RED
4–14 days      YELLOW
> 14 days      GREEN
past deadline  OVERDUE

Do not let the model decide these categories.

Example

Due date = 2026-10-08
Today    = 2026-10-03

5 days remaining
→ YELLOW

12. ACTION GENERATION

Electricity bill

IF due_date exists:
    create action:
    "Pay ₹{amount_due} by {due_date}"

Warranty

IF expiry_date exists:
    create:
    "Warranty expires on {expiry_date}"

Notice

IF deadline exists:
    create:
    "Submit by {deadline}"

Missing information

IF required field absent:
    create:
    "Needs your input"

13. CHANGE DETECTION

This is a major differentiating feature.

For recurring documents, compare against the previous confirmed document.

Electricity example

Current:

₹2,481

Previous:

₹2,102

Output:

↑ ₹379 from your previous bill

Also calculate percentage:

↑ 18.03%

Important

The model does not calculate the delta.

Code does.

delta = current_amount - previous_amount
percentage = delta / previous_amount * 100

UI

Electricity Bill

₹2,481 due Oct 8

↑ ₹379
18.0% higher than previous bill

14. "WHAT DO I NEED TO DO?" ENGINE

This is the product's central experience.

Endpoint

GET /todo

Response categories

DO NOW
COMING UP
NEEDS YOUR INPUT
RECENTLY COMPLETED

Example

{
  "do_now": [
    {
      "title": "Pay electricity bill",
      "amount": 2481,
      "due_date": "2026-10-08",
      "urgency": "yellow"
    }
  ],
  "coming_up": [],
  "needs_input": []
}

Main dashboard language

Avoid:

"12 entities extracted."

Use:

You have 3 things to take care of.

15. DOCUMENT TIMELINE

Every document should create a timeline entry.

Example:

OCT 03
Electricity bill uploaded
₹2,481
Due Oct 8

SEP 03
Electricity bill
₹2,102
Paid

AUG 03
Electricity bill
₹1,982
Paid

This gives users historical context without making them search files.

16. DOCUMENT DETAIL PAGE

Each document detail view contains:

Document title
Document type
Upload date
Source file
Status

Extracted facts
Confirmed facts
Important dates
Actions
Changes
Source pages

Example:

Electricity Bill

₹2,481
Due Oct 8

↑ ₹379 from previous bill

Provider
ElectricCo

Billing period
Sep 1 – Sep 30

[View original]
[Export event]

17. DASHBOARD INFORMATION ARCHITECTURE

Keep the MVP intentionally focused.

Screen 1 — Dashboard

Header
  ↓
Attention summary
  ↓
Do Now
  ↓
Coming Up
  ↓
Recent documents
  ↓
Quick upload

Screen 2 — Upload

Drag & drop
OR
Choose file

Processing state

Screen 3 — Review

Document preview
+
Extracted editable fields
+
Warnings
+
Confirm

Screen 4 — Document detail

Facts
Actions
Timeline
Changes
Original

Optional Screen 5 — Settings

Only if time permits:

Profile
Language
Currency
Model status
Local data location
Export data
Clear all data

Do not build unnecessary navigation.

18. DASHBOARD UX

The dashboard should immediately answer:

What needs my attention?

Then:

What changed?

Then:

What did I upload?

Recommended structure:

Good evening, [Name]

3 things need your attention

┌──────────────────────────────┐
│ 🔴 Overdue                   │
│ Insurance renewal            │
└──────────────────────────────┘

┌──────────────────────────────┐
│ 🟡 Coming up                 │
│ Electricity bill             │
│ ₹2,481 · Due Oct 8           │
│ ↑ ₹379 from previous         │
└──────────────────────────────┘

┌──────────────────────────────┐
│ 🟢 No action needed          │
│ AC warranty                  │
└──────────────────────────────┘

Recent documents
...

19. DESIGN DIRECTION

Personality

The product should feel:

trustworthy

warm

calm

mature

simple

premium

human

Not:

futuristic AI dashboard

cyberpunk

excessive glassmorphism

chatbot-first

developer tooling

Visual language

Suggested:

Background: warm off-white
Cards: white
Primary: deep navy / ink
Accent: restrained blue/green
Danger: muted red
Warning: warm amber
Success: muted green
Borders: soft gray

Use large typography and clear spacing.

The product should feel appropriate for a parent using it, while still looking polished enough for a hackathon demo.

20. AI ASSISTANT — OPTIONAL BUT POWERFUL

Do NOT make chat the main product.

Add a compact contextual assistant only after the core dashboard works.

Examples:

"Why is my bill higher?"

"Which document expires next?"

"What do I need to submit this month?"

"Show me all warranties."

"How much did my last three electricity bills cost?"

The assistant must answer from confirmed structured data.

Retrieval flow

User question
 ↓
Intent detection
 ↓
Query structured DB
 ↓
Retrieve confirmed facts
 ↓
Gemma generates natural-language response
 ↓
Show supporting source document

Example:

Your latest electricity bill is ₹2,481, which is ₹379 higher than the previous bill.
Source: Electricity Bill — October 3.

21. DATA MODEL

Use SQLite for MVP.

documents

id
doc_type
title
provider
issue_date
uploaded_at
source_file
file_hash
raw_extraction_json
confirmed_data_json
status
created_at
updated_at

fields

Optional normalized field table:

id
document_id
field_name
raw_value
normalized_value
confidence
source_page
user_confirmed

events

id
document_id
event_type
date
title
description
urgency
done
created_at

comparisons

id
document_id
previous_document_id
metric
current_value
previous_value
delta
percentage

profile

id
name
language
currency
timezone
created_at

22. FILE STORAGE

For MVP:

data/
  documents/
  thumbnails/
  db/

Git-ignore all user data.

Never commit real documents.

Use synthetic documents for the public repository.

23. API ARCHITECTURE

FastAPI backend.

POST /api/upload

Purpose:

Receive file
Validate
Extract
Classify
Return temporary result

Does NOT permanently save the document.

POST /api/confirm

Purpose:

Receive edited extraction
Save document
Run rules
Create events
Run comparisons
Return saved document

GET /api/dashboard

Returns:

attention items
upcoming events
recent documents
summary counts

GET /api/documents

Filters:

type
provider
date
status

GET /api/documents/{id}

Returns:

document
confirmed fields
events
comparisons
source metadata

PATCH /api/documents/{id}

Allows corrections.

POST /api/events/{id}/complete

Marks action completed.

GET /api/todo

Returns grouped action items.

GET /api/calendar.ics

Exports calendar events.

GET /api/health

Returns:

{
  "api": "ok",
  "model": "available",
  "database": "ok"
}

24. ERROR HANDLING

AI unavailable

Show:

"The local AI model isn't running."

Instructions:

Start Ollama
Confirm model installed
Retry

Extraction failure

Show:

"Kaagaz couldn't reliably read this document."

Allow:

Retry
Choose document type manually
Cancel

Partial extraction

Never fail the entire upload.

Example:

Provider ✓
Amount ✓
Due date ⚠
Account number —

Invalid file

Show a human-readable reason.

25. SECURITY / PRIVACY

MVP requirements:

no real documents in Git

.gitignore data directory

no external AI API

local model

no analytics required

no document content sent to third parties

sanitize filenames

generate internal UUIDs

validate upload paths

prevent path traversal

restrict upload extensions

limit file size

Privacy screen

Show:

Your documents stay on this device.

And:

Kaagaz uses a local open-weight AI model for document understanding.

Be precise. Do not claim stronger privacy guarantees than the implementation actually provides.

26. LOCAL AI STATUS

The frontend should know whether the AI runtime is available.

Example:

AI STATUS
● Local model ready

or:

○ Local model offline
Start Ollama to process documents

This reinforces the open/local story during the demo.

27. MODEL ABSTRACTION

Do not hard-code the entire application around one model.

Create:

AIProvider

Interface:

class AIProvider:
    classify_document()
    extract_document()
    answer_question()

Implementation:

OllamaGemmaProvider

Future:

OllamaOtherModelProvider

This makes the model-swapping argument real.

28. EVALUATION FRAMEWORK

This is essential for technical credibility.

Create:

eval/
  documents/
  labels.json
  evaluate.py
  results.json

Dataset

10–15 documents minimum.

Use:

real documents with sensitive data removed, OR

synthetic documents matching real formats

Metrics

Measure:

field accuracy
document classification accuracy
missing-field precision
date extraction accuracy
amount extraction accuracy
average latency
failure rate

Example table

Field                 Correct / Total
provider              14 / 15
due_date              15 / 15
amount_due            15 / 15
expiry_date           14 / 15

Do not manufacture numbers.

Run the evaluation and report the actual results.

29. MODEL COMPARISON

If hardware permits, compare:

Gemma small
vs
Gemma larger

OR another genuinely open model.

Measure:

accuracy
latency
memory

The purpose is not to declare a universal winner.

The purpose is to demonstrate:

The architecture is not locked to one closed provider.

30. SYNTHETIC DEMO DOCUMENTS

Create realistic but clearly synthetic documents.

Examples:

samples/
  electricity_bill_01.pdf
  electricity_bill_02.pdf
  warranty_01.pdf
  notice_01.pdf

Watermark them:

DEMO DOCUMENT — NOT A REAL BILL

This allows judges to reproduce the demo.

31. DEMO SCENARIO

The main demo should take approximately 60–90 seconds.

Story

"My friend/parent has a folder full of paperwork.

The problem isn't reading the documents.

It's remembering what needs to happen after reading them.

So I built Kaagaz."

Demo

Step 1

Upload electricity bill.

Step 2

Show local AI processing.

Step 3

Review extracted fields.

Step 4

Confirm.

Step 5

Dashboard immediately shows:

₹2,481 due Oct 8

Step 6

Upload previous bill.

Step 7

Show:

↑ ₹379 from previous bill

Step 8

Ask:

"What do I need to take care of?"

Step 9

Show actionable summary.

Step 10

Show:

Local AI
No closed API
Document stays on device

32. THE "WOW" MOMENT

The product should have one memorable moment.

Recommended:

Upload current bill

Then instantly:

₹2,481 due Oct 8

↑ ₹379 from your previous bill

You have 5 days to pay.

This demonstrates:

AI understanding
+
persistent memory
+
deterministic reasoning
+
action generation

in one interaction.

33. HANDOVER WORKFLOW

The theme is "Build for a Friend."

The handover is part of the product development loop.

Procedure

Give the real person the app.

Do not explain every feature.

Ask them to upload a document.

Observe.

Record confusion points.

Ask what they expected.

Fix the biggest issue.

Let them try again.

Ask what they would actually use.

Get permission before publishing any quote/photo.

Important

Never invent a reaction.

If they say:

"I just want it to tell me what I need to pay."

That is valuable product feedback.

34. ITERATION LOOP

BUILD
 ↓
REAL PERSON
 ↓
OBSERVE
 ↓
FIND CONFUSION
 ↓
FIX
 ↓
TEST AGAIN

Prioritize fixes that improve:

trust

comprehension

usefulness

reliability

aesthetics

35. REPOSITORY STRUCTURE

Recommended:

kaagaz/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routes/
│   │   │   ├── upload.py
│   │   │   ├── documents.py
│   │   │   ├── dashboard.py
│   │   │   └── events.py
│   │   ├── ai/
│   │   │   ├── provider.py
│   │   │   ├── ollama_gemma.py
│   │   │   ├── prompts.py
│   │   │   └── vision.py
│   │   ├── extraction/
│   │   │   ├── classifier.py
│   │   │   ├── extractor.py
│   │   │   └── validators.py
│   │   ├── rules/
│   │   │   ├── urgency.py
│   │   │   ├── actions.py
│   │   │   ├── comparison.py
│   │   │   └── dates.py
│   │   └── services/
│   │       ├── document_service.py
│   │       ├── event_service.py
│   │       └── dashboard_service.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── samples/
│
├── eval/
│   ├── labels.json
│   ├── evaluate.py
│   └── results.json
│
├── data/
│   └── .gitkeep
│
├── docs/
│   ├── architecture.md
│   ├── decisions.md
│   └── demo.md
│
├── .gitignore
├── README.md
└── LICENSE

36. DEVELOPMENT PHASES

PHASE 0 — Project initialization

Goal:

repo created
frontend runs
backend runs
Ollama detected
database initializes

Do not polish UI yet.

PHASE 1 — One-document extraction

Goal:

Upload one sample
→ Gemma reads it
→ JSON returned

Do this in CLI/API before building the dashboard.

Success condition:

One real/synthetic document produces correct structured output.

PHASE 2 — Review and confirmation

Goal:

Upload
→ Extract
→ Review
→ Edit
→ Confirm

Success condition:

User can correct every extracted field.

PHASE 3 — Persistence

Goal:

confirmed document
→ SQLite
→ survives restart

PHASE 4 — Rules

Implement:

dates
urgency
missing fields
actions

PHASE 5 — Comparison

Implement:

current document
vs
previous document

PHASE 6 — Dashboard

Build the central:

What do I need to do?

experience.

PHASE 7 — Assistant

Only after structured data works.

PHASE 8 — Evaluation

Build the actual benchmark.

PHASE 9 — Polish

Fix:

spacing

typography

responsiveness

transitions

loading

errors

empty states

accessibility

PHASE 10 — Real-person handover

Run the complete workflow with the target person.

PHASE 11 — Demo + DEV article

Prepare:

demo video

screenshots

architecture diagram

evaluation results

handover story

open-source explanation

37. ANTIGRAVITY EXECUTION RULES

Antigravity must follow these rules.

Rule 1

Do not add major features without checking this document.

Rule 2

Do not replace Gemma with a closed AI API.

Rule 3

Do not let the LLM directly create dates, urgency or financial deltas.

Rule 4

Do not skip the review/confirmation screen.

Rule 5

Do not build more document types before the initial ones are reliable.

Rule 6

Do not put real personal documents in Git.

Rule 7

Do not build chat first.

Rule 8

Do not sacrifice reliability for visual effects.

Rule 9

Do not invent data when extraction fails.

Rule 10

Every AI feature must have a clear user benefit.

38. DEFINITION OF DONE

The project is not "done" when the UI looks good.

It is done when:

[ ] Fresh repo
[ ] Frontend starts
[ ] Backend starts
[ ] Ollama starts
[ ] Gemma available
[ ] PDF upload works
[ ] Image upload works
[ ] Document classification works
[ ] Extraction works
[ ] Review works
[ ] User correction works
[ ] Confirmation works
[ ] SQLite persistence works
[ ] Rules work
[ ] Urgency works
[ ] Missing-field detection works
[ ] Change detection works
[ ] Dashboard works
[ ] Todo works
[ ] Document detail works
[ ] Calendar export works
[ ] AI assistant works, if time permits
[ ] Evaluation dataset exists
[ ] Accuracy measured
[ ] Latency measured
[ ] Synthetic documents included
[ ] No real data committed
[ ] README complete
[ ] License included
[ ] Prior work credited
[ ] Demo recorded
[ ] Real-person handover completed
[ ] DEV article written
[ ] Required tags verified

39. README STRUCTURE

The README should contain:

# Kaagaz

One-line explanation

## Problem

## Built For

## Demo

## How It Works

## Architecture

## Open-Source AI

## Why Local AI Matters

## Supported Documents

## Evaluation

## Installation

## Running Locally

## Project Structure

## Privacy

## Limitations

## Future Work

## Credits

40. "WHY OPEN INNOVATION?" STORY

The answer must be specific to Kaagaz.

Closed approach

A conventional implementation might send:

family document
→ closed cloud API

Kaagaz

family document
→ local processing
→ local open-weight model
→ local database

This provides:

privacy-oriented local processing

offline potential

model choice

model swapping

inspectability

no mandatory per-document AI API cost

Honest tradeoff

Local inference can be:

slower

more hardware-dependent

less accurate on some documents

harder to deploy for users with weak machines

Mention this.

Honest tradeoffs make the technical story stronger.

41. PARTNER STRATEGY

Do not force partners into the architecture.

Primary optional category

Gemma

This is naturally aligned because the core extraction engine uses Gemma.

Possible additional categories

Only use them if genuinely valuable:

MongoDB Atlas

Could replace/extend local structured/vector storage if a meaningful feature requires it.

Sentry

Useful if agent tracing or production error tracing is genuinely implemented.

Entire

Useful if agent sessions are actually captured and documented.

Render / DigitalOcean

Useful if a real hosted deployment is required.

Do not add five integrations just for badges.

42. DEPLOYMENT STRATEGY

Local-first demo

Primary:

Frontend
+
FastAPI
+
Ollama
+
Gemma
+
SQLite

This best demonstrates the privacy/open-AI story.

Optional hosted demo

If hardware/deployment permits:

Frontend → hosted frontend
Backend → Render/DigitalOcean
AI → hosted open-weight model

But the local version remains the reference architecture.

43. PERFORMANCE TARGETS

These are engineering targets, not claims.

Aim for:

Dashboard load: < 1 sec after backend response
API request: < 500 ms excluding AI
Text extraction: < 2 sec
AI extraction: ideally < 30 sec on target hardware

Record actual measurements.

Never publish target values as if they were measured.

44. ACCESSIBILITY

Implement:

keyboard navigation

visible focus states

semantic buttons

sufficient contrast

readable font sizes

clear status text

not relying solely on color

descriptive upload errors

For urgency:

RED + "Urgent"
YELLOW + "Coming up"
GREEN + "No action needed"

not color alone.

45. INTERNATIONALIZATION

MVP:

English

Optional:

Hindi labels

If the real user prefers Hindi, prioritize it.

Do not attempt full multilingual AI support during the core build unless it is directly useful.

46. FUTURE FEATURES — DO NOT BUILD FIRST

Possible future roadmap:

Email ingestion
WhatsApp ingestion
Camera scanning
Automatic recurring-document matching
Household multi-user mode
Cloud sync
Mobile app
OCR fallback
More document types
Voice queries
Calendar integrations
Notification integrations
Advanced spending trends
Warranty claim assistant
Subscription cancellation detection

These belong in the roadmap, not the weekend MVP.

47. DEMO STORYBOARD

Scene 1 — Problem

Show:

folder / pile of paperwork

Narration:

"This isn't a document problem. It's a remembering problem."

Scene 2 — Upload

Drag a bill into Kaagaz.

Scene 3 — Local AI

Show:

Local model: Gemma
Processing on this device

Scene 4 — Review

Show extracted information.

Edit one field.

Scene 5 — Confirm

Dashboard updates.

Scene 6 — Insight

Show:

₹2,481
Due Oct 8
↑ ₹379 from previous bill

Scene 7 — Action

Ask:

"What do I need to take care of?"

Scene 8 — Answer

Show prioritized actions.

Scene 9 — Open innovation

Show architecture:

Document
 ↓
Local Gemma
 ↓
Structured facts
 ↓
Rules
 ↓
Actions

Scene 10 — Human ending

Show the actual person using it, with permission.

48. DEV ARTICLE STRUCTURE

The challenge emphasizes writing quality, so treat the article as part of the product.

Title direction

Potential:

I Built an AI That Turns My Family's Paperwork Into Things We Actually Need to Do

Do not finalize until the real story is known.

Opening

Start with the human problem.

Not:

"Kaagaz is an AI-powered document management platform..."

Instead:

"My [person] had a folder full of bills, warranties and notices. The problem wasn't that they couldn't read them. The problem was remembering what mattered after closing the folder."

Only use true details.

Sections

1. The person I built this for
2. The problem
3. What I built
4. The 60-second demo
5. Architecture
6. Why Gemma / open AI
7. Why the model doesn't decide everything
8. Evaluation
9. Handing it over
10. What broke
11. What I learned
12. What I'd build next
13. Repository
14. Demo

49. TECHNICAL STORY TO EMPHASIZE

The strongest engineering concept is:

"The model understands documents. Code makes decisions."

Pipeline:

        ┌─────────────────────┐
        │ PDF / IMAGE         │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Gemma               │
        │ Understanding       │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Structured facts    │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Deterministic rules │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Actions / deadlines │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Human confirmation  │
        └─────────────────────┘

This makes the system more explainable and reduces hallucination risk.

50. FINAL ANTIGRAVITY MASTER INSTRUCTION

When implementing Kaagaz, behave as a senior full-stack engineer + product designer.

Follow this order:

1. Understand the product
2. Set up repository
3. Verify environment
4. Build backend skeleton
5. Verify Ollama/Gemma
6. Build extraction CLI
7. Build schemas
8. Build validation
9. Build review API
10. Build persistence
11. Build deterministic rules
12. Build comparisons
13. Build dashboard API
14. Build frontend
15. Build review UI
16. Build dashboard
17. Build document detail
18. Add calendar export
19. Add contextual assistant if core is stable
20. Add evaluation
21. Add synthetic samples
22. Polish UX
23. Test complete flow
24. Perform real-person handover
25. Fix observed issues
26. Record demo
27. Complete README
28. Prepare DEV article

At every step:

DO NOT:
- invent requirements
- replace the local open model with a closed API
- allow AI to invent facts
- skip human confirmation
- overbuild
- add unnecessary screens
- commit personal documents
- fake evaluation metrics
- fake user feedback

51. MVP PRIORITY MATRIX

P0 — MUST WORK

Document upload
Gemma extraction
Document classification
Review/edit
Confirmation
SQLite persistence
Deterministic actions
Due dates
Urgency
Dashboard
Change detection
Privacy/local model

P1 — SHOULD WORK

Document detail
Calendar export
Evaluation
Synthetic documents
Local AI status
Good error handling
Polished responsive UI

P2 — NICE TO HAVE

Contextual assistant
Hindi UI
Voice query
Additional document types
Advanced charts

P3 — FUTURE

Cloud sync
Mobile app
WhatsApp
Email ingestion
Multi-user households

52. FINAL PRODUCT DEFINITION

Kaagaz is successful when a person can take a document they normally throw into a drawer and, within a minute, get:

WHAT IS THIS?
        ↓
WHAT MATTERS?
        ↓
WHAT CHANGED?
        ↓
WHAT DO I NEED TO DO?
        ↓
WHEN DO I NEED TO DO IT?

The user should leave the interaction thinking:

"I don't have to remember this anymore."

That is the product.

53. BUILD ORDER — START HERE

Antigravity should begin with exactly these tasks:

TASK 001

Create repository and folder structure.

TASK 002

Create FastAPI backend health endpoint.

TASK 003

Create React/Vite frontend with premium base shell.

TASK 004

Verify Ollama installation and Gemma availability.

TASK 005

Implement a CLI/API test:

sample electricity bill
→ Gemma
→ validated JSON

TASK 006

Implement Pydantic schemas.

TASK 007

Implement extraction validation.

TASK 008

Implement upload endpoint.

TASK 009

Implement review endpoint/UI.

TASK 010

Implement SQLite persistence.

Do not proceed to dashboard polish until TASK 005 works reliably.

54. THE SINGLE MOST IMPORTANT RULE

Do not optimize for:

"How many features can we build?"

Optimize for:

"Can we make one real person's life noticeably easier this weekend?"

The winning-quality version of Kaagaz is not a giant document-management platform.

It is a small, extremely polished, trustworthy product that solves one human problem exceptionally well — with open-source AI doing meaningful work underneath.