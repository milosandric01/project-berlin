# Flowiz — Product Requirements Document

---

## What It Is

Flowiz is a calm daily practice app for software engineers who want to stay sharp. It is not a coding interview simulator, not FAANG prep, and not a LeetCode-style platform.

The target user is a software engineer with 5+ years at a company who has drifted from daily technical practice and wants to stay ready — so that when a new opportunity comes, they are prepared without having to cram.

> The gym membership, not the crash diet before a race.

---

## Product Philosophy

The user decides everything. The platform just shows up.

- You choose which skills to practice
- You choose how many questions today
- You choose the difficulty
- You practice as much or as little as you want
- You exit anytime and resume exactly where you left off

No pressure. No quotas. No platform telling you what to do. Flowiz treats engineers like professionals, not students.

---

## Tone and Language

**The product should feel:** calm, casual, daily, low-pressure, professional.

**Never use:** quiz, test, exam, challenge, interview, hard, easy, medium.

**Always use:** flow, practice, prompt, question, skill.

**Difficulty levels:** Light · Practical · Deep

**Prompt types:** Quick Take · What Would You Do? · Spot the Risk

**Core actions:** Start Flow · Pick a different flow

---

## Three-Page Architecture

### Practice
The user's daily home base. One active flow card. Nothing else competing for attention.

### Flows
Where users create and manage their flows. Platform predefined flows live here too.

### Skills
A catalogue of platform-defined skill areas. The building blocks of flows.

---

## Core Concepts

### Skill
An atomic unit of content defined by the platform. A single technology or topic area.

Examples: Networking, SQL, HTTP & APIs, Java, Vue, TypeScript, Kafka, Auth, AWS, Testing, Refactoring, Monitoring.

Skills are the ingredients. Users do not create skills — they pick from what the platform offers.

### Flow
A practice domain created by the user. A flow is one skill or a combination of multiple skills. It defines what kind of questions get generated — not a fixed list of questions.

Questions are generated fresh every session. The same flow run again produces different questions. Flows never expire and never run out.

A flow is a long-term commitment to a practice area, not a finite course to complete.

### Question
A single practice prompt generated from the user's active flow. Generated fresh each time based on the skills in the flow, the selected difficulty, and the selected prompt type.

---

## Practice Page

The simplest page in the app. One focus: the active flow.

### Active Flow Card

```
Your active flow

[Flow name]
[Goal: X questions · Difficulty]
[Progress: ░░░░░░ 0 / 5]

[Start Flow]   [Pick a different flow]
```

- "Your active flow" label sits above the card to teach the vocabulary
- Flow name is the user-given name for the flow
- Before starting, user sets today's goal (number of questions) and difficulty
- Progress bar fills as questions are answered in the session
- "Pick a different flow" always visible — navigates to Flows page

### Completed Flows
Shown beneath the active flow card. Compact rows. Each completed flow shows name, total questions done, and a replay option.

### Empty State
If no flow is active yet, the card slot shows: "You have no active flow. Go to Flows to get started."

---

## Flows Page

Where users build and manage their flows.

### Structure
- **Your flows** — flows the user has created, each with independent progress (total questions done)
- **Predefined flows** — platform starter flows, available to add anytime
- **+ Create your own flow** — build a custom flow from skills

### Predefined Starter Flows

Designed to solve the cold start problem. Stack-agnostic. Immediately familiar.

| Flow | Skills |
|------|--------|
| Networking Basics | Networking |
| SQL Fundamentals | SQL |
| HTTP & APIs | HTTP & APIs |
| Auth & Security | Authentication · Authorization |
| Frontend Core | HTML semantics · CSS layout |
| Cloud Essentials | AWS basics · Deployments |
| Backend Foundations | APIs · Databases · Caching |
| Observability | Monitoring · Logging · Incidents |
| Code Health | Testing · Refactoring · Code Review |

### Creating a Custom Flow
User picks a name and selects one or more skills from the Skills catalogue. That's it. The flow is created and ready to practice.

### Flow State
Each flow tracks independently:
- Total questions done
- Last practiced date

When a flow is set as active it appears on the Practice page. User can have multiple flows created — only one is active (shown on Practice page) at a time. "Pick a different flow" on the Practice page navigates here to swap the active one.

---

## Skills Page

A browseable catalogue of all platform-defined skills. Organized by category.

### Categories

| Category | Skills |
|----------|--------|
| Fundamentals | Networking · HTTP & APIs · Auth · Concurrency · Data structures |
| Frontend | HTML · CSS · JavaScript · TypeScript · React · Vue · State management · Forms · API integration · Performance · Accessibility · Browser behavior · Testing UI · Frontend security |
| Backend | APIs · Databases · Queues & Messaging · Caching · Background jobs · Integrations |
| Systems | Scalability · Reliability · Observability · Latency · Failure modes · Tradeoffs |
| Code Quality | Testing · Refactoring · Code review · Maintainability · Technical debt |
| Cloud & DevOps | Deployments · CI/CD · Containers · AWS basics · Monitoring · Incidents |
| Security | Authentication · Authorization · Secrets · Input validation · OWASP · Data privacy |
| AI-era Engineering | Reviewing AI code · Prompting for implementation · Validating outputs · AI debugging |
| Communication | Explaining tradeoffs · Incident updates · Product conversations · Mentoring · Architecture proposals |

---

## Session Model

### Before Starting
User sets:
- **Goal** — number of questions for this session (defaults to last used goal)
- **Difficulty** — Light, Practical, or Deep (defaults to last used)

### During a Session
- One question shown at a time
- User reads the scenario and writes their answer in a text area
- No code editor — plain text only
- User can submit answer or tap "I don't know yet"
- After submitting, AI feedback is shown
- User continues to next question or exits

### Exiting
User can exit at any point. Progress is saved. Returning tomorrow resumes the session exactly where they left off.

### Completing the Goal
When the user hits their question goal for the session, the session ends with a calm completion state. Streak updates. Option to keep going or come back tomorrow.

---

## Question Screen

### Layout
- Back button · Page title "Flowiz" · Flow metadata (e.g. Networking · Practical)
- Change stack / Change difficulty controls
- Question title
- Scenario text
- Question text
- Guidance text (e.g. "Answer in 5–8 sentences. Focus on diagnosis first, then prevention.")
- Large text area with placeholder "Write your answer here…"
- Primary: "Submit answer" · Secondary: "I don't know yet"
- Helper: "Your answer will be reviewed for reasoning, missing points, and practical tradeoffs."

---

## AI Feedback

After submitting an answer, feedback is structured to feel helpful and calm — never like failure.

```
Score: 7 / 10

Good:
- You mentioned retries and idempotency.

Missing:
- You did not mention storing processed event IDs.
- You did not mention making side effects safe.

Better answer:
[Improved answer here]

Tiny takeaway:
Assume at-least-once delivery. Make handlers idempotent.
```

---

## Prompt Types

| Type | Description | Example |
|------|-------------|---------|
| Quick Take | Short concept or practical question | "Why can a queue message be processed more than once?" |
| What Would You Do? | Practical scenario requiring a decision | "Your API is slow for one customer. What would you check first?" |
| Spot the Risk | Review a proposed change and identify hidden issues | "A teammate adds Redis caching to fix slow database queries. What could go wrong?" |

---

## Progress and Streaks

- **Streak** — number of consecutive days the user completed at least one question
- **Total questions** — lifetime count per flow and overall
- **Last practiced** — shown per flow in the Flows page

Streak is the primary motivational mechanic. It represents showing up, not hitting a quota.

---

## Onboarding (New Users)

1. User signs up
2. Lands on Flows page — predefined starter flows are prominently displayed
3. Picks one (e.g. Networking Basics)
4. Goes to Practice page — sees active flow card
5. Sets a small goal (suggested: 3 questions)
6. Does first question, gets AI feedback
7. Hooked

Personal flow creation is introduced after the user has experienced the product — not as a barrier to entry.

---

## Welcome Copy (Practice Page)

```
Welcome back, [Name].
Your practice is ready.
```

Alternatives:
- "One small rep keeps you sharp."
- "Stay ready without the grind."
- "A small question. A sharper mind."

---

## What Flowiz Is Not

- Not a coding interview simulator
- Not FAANG prep
- Not a LeetCode-style problem set
- Not a quiz or exam platform
- Not a course with a fixed curriculum
- Not something that tells you what to do
