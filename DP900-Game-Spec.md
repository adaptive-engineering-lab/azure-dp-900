# DP-900 Learning Game — Product Specification

**Version**: 4.0  
**Date**: 2026-10-19  
**Status**: Deployed 2026-10-19; launch smoke test pending

> Section numbers are load-bearing. `frontend/src/lib/spacing.ts` cites §9,
> the constitution cites §8 and §13, and the feature specs under `specs/`
> cite §6, §7, and §10.2. Renumber only with a matching sweep.
>
> The feature specs under `specs/` were written for the DP-700 app this repo
> was originally forked from (via an AZ-900 fork). They describe how each
> feature was built and remain useful for that, but their exam-specific
> content (Fabric topics, code review, exam pacing) is DP-700's. Where they disagree with this document, this document
> wins.

---

## 1. Overview

### 1.1 Product Summary

A mobile-first, gamified web application for preparing for the **Microsoft
Certified: Azure Data Fundamentals** certification (Exam DP-900). A curated bank of
multiple-choice and true/false questions, one quiz per Microsoft Learn module,
drives a quiz mode plus a spaced-repetition Daily Review that pulls whatever is
due today.

Live at **<https://azure-dp-900.vercel.app>** (Vercel project `azure-dp-900`
in the Azure Over Lunch team; `azure-dp-900-azure-over-lunch.vercel.app`
is the same deployment).

### 1.2 Goals

- Make DP-900 exam prep engaging, bite-sized, and habit-forming
- Cover all four official DP-900 exam domains, module by module, in the order
  Microsoft Learn teaches them
- Track learner progress and surface weak areas
- Explain every answer, including why each wrong option is wrong

### 1.3 Non-Goals (v1)

- No social/multiplayer features
- No video content
- No native mobile app (PWA is the delivery vehicle)
- No code-review drills. DP-900 is a fundamentals exam with no code to
  review; the mode is inherited from DP-700 and switched off (§6.2).
- No runtime AI. The production app makes no outbound calls to any AI
  provider; see §7.

Offline support is **shipped** — the PWA precaches the app shell and question
bank, so a session can be completed without a connection.

---

## 2. Target Users

| Persona | Description |
|---|---|
| **The Aspiring Data Professional** | Heading toward data engineer, analyst or DBA roles; DP-900 is a first data certification |
| **The Non-Technical Professional** | Business, project, or reporting roles that need data literacy |
| **The Student** | University or bootcamp learner, exam in 2–6 weeks |

All personas share: **mobile-first usage**, **short study sessions (5–15 min)**, **need for immediate feedback**.

---

## 3. Tech Stack

### 3.1 Frontend

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 18 + Vite 5 | Fast builds, large ecosystem, easy deployment |
| Styling | Tailwind CSS 3 | Mobile-first utilities, consistent design system |
| Components | Hand-rolled | No component library; the surface is small enough that a dependency would cost more than it saves |
| Routing | React Router 6 | SPA navigation between game modes |
| State | Zustand 4 | Lightweight global state (session, progress), persisted to localStorage |
| Animations | Framer Motion 11 | Transitions and score reveals; disabled under `prefers-reduced-motion` |
| PWA | vite-plugin-pwa (Workbox) | Precached shell + offline sessions |

### 3.2 Backend / API

| Layer | Technology | Rationale |
|---|---|---|
| Database | Supabase (Postgres) | Question bank, user progress, subscriptions |
| Auth | Supabase Auth | Email magic link |
| Edge Functions | Supabase Functions (Deno) | Stripe checkout, billing portal, webhook — present but not activated for DP-900 (§15.2) |

There is no bespoke API tier. The client talks to PostgREST directly, and
row-level security is the authorization boundary.

### 3.2.1 Content Authoring Tooling (Offline, Not Runtime)

| Layer | Technology | Rationale |
|---|---|---|
| Markdown importer | `tools/import/md-quiz.ts` | Converts the module quizzes in `bank/knowledge/` into seed JSON. The primary content path. |
| Authoring AI | Anthropic Claude (developer-side) | Drafts additional items during content production |
| Authoring scripts | Local Node scripts under `tools/` | Generate JSON, validate schemas, seed Supabase |

The production runtime makes **no** outbound calls to any AI provider.

### 3.3 Hosting & DevOps

| Concern | Choice |
|---|---|
| Hosting | Vercel (`vercel.json`: builds in `frontend/`, publishes `frontend/dist`). The Vercel project's Root Directory must stay empty — `vercel.json` runs `cd frontend` from the repo root. |
| CI/CD | GitHub Actions — `data-layer.yml` (schema + seed) and `lighthouse.yml` (perf/a11y gate); Vercel auto-deploys `main` |
| Environment | `frontend/.env.local` and `tools/.env` locally; Vercel env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in production |
| Monitoring | Supabase logs; Vercel Web Analytics once enabled on the project |

---

## 4. Information Architecture

```
/                        → Home / Dashboard
/learn                   → Mode selector
/learn/quiz              → Module picker, then MCQ quiz session
/learn/daily-review      → Spaced-repetition queue
/progress                → Stats, streaks, weak areas
/settings                → Account, preferences
/settings/billing        → Plan view, upgrade / manage
/whats-in-pro            → Pro tier explainer
/sign-in, /auth/callback → Magic-link auth
/legal/privacy, /legal/terms
/admin                   → Question editor (admin-gated)
```

---

## 5. Game Structure

### 5.1 Level System

Levels are XP thresholds, not content gates — every question is available
from the first session.

| Level | Name | XP required |
|---|---|---|
| 1 | **Foundation** | 0 |
| 2 | **Practitioner** | 500 |
| 3 | **Engineer** | 2,000 |
| 4 | **Expert** | 5,000 |

Thresholds are enforced by `levelFromXp`. The names are a spec-level concept
only — the UI renders the numeric level, so renaming a tier costs nothing.

### 5.2 DP-900 Exam Domains

Per the study guide for skills measured as of **21 July 2026**. Slugs are the
canonical identifiers used in the type system, the `questions_domain_chk`
constraint, and every content file.

| Domain | Slug | Weight | Learn modules |
|---|---|---|---|
| Describe core data concepts | `core-data-concepts` | 25–30% | 1–2: core data concepts, data roles and services |
| Identify considerations for relational data on Azure | `relational-data` | 20–25% | 3–4: relational data concepts, relational database services in Azure |
| Describe considerations for working with non-relational data on Azure | `non-relational-data` | 15–20% | 5–6: Azure Storage for non-relational data, Azure Cosmos DB |
| Describe an analytics workload on Azure | `analytics-workloads` | 25–30% | 7–9: large-scale analytics, real-time analytics, data visualization |

The slugs replaced the AZ-900 ones through migration
`0020_dp900_domains.sql`; `0001` still carries the old list because it was
applied before the fork was retargeted.

The full topic lists and the four learning paths (`lp1`–`lp4`) live in
`exams.config.json`, the single source of truth for taxonomy. The module list
(Learn slug → title, path, ID stem) lives in `MODULES` in
`tools/import/md-quiz.ts`.

---

## 6. Game Modes

### 6.1 Multiple Choice Quiz (MCQ)

**Purpose**: Test applied knowledge one Learn module at a time, or across the
whole bank.

**Flow**:

1. User picks a module (grouped by learning path, in study order) or
   **All modules**
2. A module quiz runs every question in that module; an all-modules quiz draws
   `MIXED_QUIZ_LENGTH` (20) at random
3. Question displayed with its options
4. On answer:
   - **Correct**: green highlight + explanation
   - **Incorrect**: red on chosen, green on correct + explanation
5. "Next" → advances
6. End screen: score %, time taken, per-domain breakdown, weak domains flagged

There is no timer. Selection is uniformly random: `difficulty` is inferred
from the source quiz section (§12), not graded, so the picker ignores it.

**Option count is variable.** Most items carry four options (A–D). True/false
items carry exactly two (A = True, B = False). The renderer draws whichever
letters the item actually has; nothing may assume four.

**Question Data Fields**:
```json
{
  "id": "uuid",
  "type": "mcq",
  "domain": "core-data-concepts",
  "topic": "Explore core data concepts",
  "difficulty": 1,
  "source": "bank",
  "tags": ["core-data-concepts", "explore-core-data-concepts", "level-1", "order:1",
           "module:explore-core-data-concepts", "path:lp1", "primary-path:lp1"],
  "content": {
    "question": "Which file format is columnar and widely used in data lakes and lakehouses?",
    "options": { "A": "Parquet", "B": "Avro", "C": "CSV", "D": "XML" },
    "correct": "A",
    "explanation": "Parquet is a columnar Apache format widely used in data lakes and lakehouses. Not B: Avro is the classic trap — it's row-based. Not C/D: …"
  }
}
```

`topic` is the Learn module title. The `order:`, `module:`, `path:` and
`primary-path:` tags drive the module picker's ordering and grouping.

**UX Notes**:

- Keyboard shortcuts on desktop: A/B/C/D
- Results screen shows the domain breakdown with each domain's full name

### 6.2 Code Review (disabled)

Inherited from DP-700, where it drilled PySpark, T-SQL and KQL snippets.
DP-900 has no code-review content, so the mode is off: `gameModes.codeReview` is
`false` in `exams.config.json`, its routes are removed from the router, and
every link to it is gone. The page components, the `code-review` question type
and its schema remain in the codebase, unused, so a future exam fork can turn
the mode back on.

### 6.3 Daily Review

Pulls every item whose `next_review` has come due and presents them in one
session. Capped at `DAILY_REVIEW_CAP` (30) items; an "extend" action pulls the
next batch of the same size. Only the first, non-extended batch earns the
streak bump and the +20 XP bonus, so extending is unlimited practice without
inflating either number.

### 6.4 Retired and never-built modes

Recorded so the history stays legible:

- **Flashcards** — shipped in the DP-700 app (spec 004), removed 2026-08-06.
  True/false questions import as two-option MCQs instead, leaving no producer
  of flashcard items. Migration `0015_drop_flashcards.sql` dropped the type.

- **Product Identification** — specified in the DP-700 1.0 draft, never built.
  The `product-id` type never existed in the database.

---

## 7. AI-Assisted Content Authoring (Offline)

Claude is used **by the maintainer**, not by end users. The production app
never calls an AI API.

### 7.1 Content paths

| Path | Use |
|---|---|
| **Markdown import** (primary) | One quiz per Learn module in `bank/knowledge/`, named `DP900-M<N>-<Module-Title>-Quiz.md`. Run `pnpm -C tools import:md`, then `pnpm -C tools seed`. Sections A and C become four-option MCQs, Section B becomes two-option true/false MCQs. IDs are UUIDv5 over `<idStem>#<number>` (e.g. `…#7`), so re-import is idempotent. |
| **Claude drafting** | `pnpm -C tools author draft` for topics the module quizzes don't cover. |
| **Admin editor** | `/admin` edits rows in Supabase directly. Edits are not written back to `bank/knowledge/`, so a re-import and re-seed overwrites admin edits to the same questions. |

The quiz file format is documented at the top of `tools/import/md-quiz.ts`:
a `**Domain N:**` line, questions numbered `**1.**` onward across Sections
A–C with `- A)` options, a `# Answer key` of `**1. C** —` entries carrying the
rationale and `*Not A:*` notes, and a `## Sources` list whose Learn links
identify the module.

### 7.2 Authoring Workflow (Claude drafting)

1. Maintainer runs a local Node script under `tools/author/` that prompts
   Claude with domain, topic, difficulty, existing item IDs to avoid, and the
   JSON schema.
2. Claude returns JSON; the script validates against the schema in §8.
3. Maintainer reviews each item, edits as needed, and commits the reviewed
   JSON to the seed file.
4. `pnpm -C tools seed` writes items into Supabase with `source:
   "ai-generated"` and the human reviewer's initials.

### 7.3 Prompt Design Principles

- Always include: domain, topic, difficulty level, exam context ("DP-900")
- For generation: include existing item IDs to suppress duplicates
- Temperature: `0.7` for generation, `0.3` for explanation rewrites
- Always request JSON output for generation

---

## 8. Data Model (Supabase)

Twenty migrations under `supabase/migrations/`. Abridged shape:

```sql

-- Question bank (public read; admin-only write)
questions (
  id uuid PRIMARY KEY,
  type text,           -- 'mcq' | 'code-review' (code-review unused for DP-900)
  domain text,         -- 'core-data-concepts' | 'relational-data' | 'non-relational-data' | 'analytics-workloads'
  topic text,          -- Learn module title
  difficulty int,      -- 1 (easy) to 3 (hard)
  source text,         -- 'bank' | 'ai-generated'
  reviewer_id text,    -- required when source = 'ai-generated'
  reviewed_at timestamptz,
  tags text[],
  content jsonb,       -- shape enforced per type by CHECK
  content_hash text,
  created_at timestamptz
)

profiles (              -- extends auth.users, auto-created by trigger
  id uuid PRIMARY KEY REFERENCES auth.users,
  display_name text, streak_days int, last_active date, level int
)

user_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  question_id uuid REFERENCES questions ON DELETE CASCADE,
  times_seen int, times_correct int,
  last_rating text,    -- 'correct' | 'almost' | 'missed'
  next_review date,    -- spaced repetition
  UNIQUE (user_id, question_id)
)

sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  mode text,           -- 'mcq' | 'daily-review' ('code-review' unused)
  topic text, score_pct float, duration_seconds int, completed_at timestamptz
)

subscriptions (...)     -- Stripe plan state; a free row is created per user
admins (...)            -- gates /admin and question writes
webhook_events (...)    -- Stripe webhook idempotency
```

Every user-scoped table is protected by RLS keyed on `auth.uid()`. The
`questions` table is world-readable so guests can study without an account.

**Admins** are added only out-of-band — a service-role insert into `admins`
(Supabase SQL editor or the `tools/.env` credentials). Sign-up never grants
admin, and no RLS policy lets a user write to `admins`.

`last_rating` still admits `'almost'`, but no UI produces it since flashcard
self-rating was removed (§6.4). The column and the §9 branch are retained
rather than migrated away.

---

## 9. Spaced Repetition Logic

Simplified **SM-2**, implemented in `frontend/src/lib/spacing.ts`:

| Rating | Next Review |
|---|---|
| Correct | `3 × 2^(prior correct answers)` days — 3, 6, 12, 24… |
| Almost | Tomorrow (unreachable today, see §8) |
| Missed | Tomorrow; the interval streak resets |

- Items due for review surface first in any session
- "Daily Review" on the home screen shows what is due today

---

## 10. UX & Design

### 10.1 Design Principles

- **Mobile-first**: layouts designed for 375px width first, scaled up
- **Thumb-friendly**: primary actions in the bottom 60% of the screen
- **Dark mode default**: dark background, accent-forward
- **Progress visible always**: streak, XP, and session progress in view
- **No invented numbers**: empty states show placeholders, never sample
  stats a new user could mistake for their own

### 10.2 Key Screens

| Screen | Key Elements |
|---|---|
| **Home / Dashboard** | Daily streak, XP bar, Daily Review hero, quick-start CTAs, bank size ("N questions across 4 domains") |
| **Mode Selector** | Quiz mode card with live available-item count |
| **Quiz Picker** | Modules grouped by learning path in study order, with per-module counts, plus All modules |
| **Quiz Session** | Question + tappable options, explanation panel with source module |
| **Results Screen** | Score, domain breakdown, XP earned |
| **Progress Dashboard** | Four-axis domain radar, streak calendar, focus areas |
| **Admin** | Question CRUD with live schema validation |

### 10.3 Mobile Gestures

| Gesture | Action |
|---|---|
| Tap option | Select answer |
| Swipe up | Next question (after answering) |

Keyboard equivalents exist for every gesture.

---

## 11. Gamification

| Element | Description |
|---|---|
| **XP Points** | `10 × correct + 50` per completed session; the first (non-extended) Daily Review batch adds `+20` |
| **Daily Streak** | Days in a row with at least one session |
| **Level Badges** | Foundation → Practitioner → Engineer → Expert (§5.1) |
| **Domain Mastery** | Per-domain accuracy on the progress radar |

---

## 12. Question Bank Seed Plan

Target is **150 items**, split by exam weight (`exams.config.json` →
`questionTargets`). The bank meets it exactly.

Current bank — **150 items**, all MCQ, imported from nine module quizzes in
`bank/knowledge/` (one per Microsoft Learn module, DP-900T00):

| Domain | Four-option | True/false | Total | Target |
|---|---|---|---|---|
| `core-data-concepts` | 22 | 12 | 34 | 34 |
| `relational-data` | 22 | 12 | 34 | 34 |
| `non-relational-data` | 22 | 12 | 34 | 34 |
| `analytics-workloads` | 30 | 18 | 48 | 48 |
| **Total** | **96** | **54** | **150** | **150** |

Properties of the current bank:

- **Answer letters are balanced**: across the 96 four-option items A is
  correct 24 times, B 24, C 23, D 25; true/false splits 27 true, 27 false.
- **Difficulty is inferred, not graded**: Section A and B items are level 1,
  Section C scenarios are level 2 (132 and 18 items). There are no level-3
  items; the picker ignores difficulty (§6.1).
- **The weighting is approximate**: core data concepts and analytics carry the
  same exam weight (25–30%) but 34 and 48 items, because analytics spans three
  modules.

Content is written from the Microsoft Learn DP-900 modules, paraphrased rather
than copied.

---

## 13. Development Phases

Phases 1–4 were delivered in the DP-700 app and carried over by the fork.
Feature-level specs for them live under `specs/` (see the note at the top).

### Phase 1 — Foundation ✅

- [x] Supabase schema + seed (spec 001)
- [x] React app scaffold with routing (spec 002)
- [x] ~~Flashcard mode~~ (spec 004 — shipped, later removed; §6.4)
- [x] MCQ mode (spec 005)
- [x] Supabase Auth + guest migration (spec 003)

### Phase 2 — Core Game ✅

- [x] ~~Code Review mode~~ (spec 006 — disabled for DP-900; §6.2)
- [x] Results screen with domain breakdown
- [x] User progress tracking, streak + XP

### Phase 3 — Content & Personalization ✅

- [x] Authoring scripts under `tools/author/` (spec 009)
- [x] Spaced repetition / Daily Review (spec 008)
- [x] Progress dashboard with radar (spec 007)
- [x] Admin question editor (spec 013)

### Phase 4 — Polish & Launch ✅

- [x] Dark mode + themes (spec 010)
- [x] PWA manifest + offline shell + install prompt (spec 010)
- [x] Pro tier + Stripe plumbing (spec 011)
- [x] Lighthouse gate ≥ 90 (spec 012)

### Phase 5 — DP-900 port (in progress)

Tracked in detail in `DP900-LAUNCH-TASKS.md`.

- [x] Swap taxonomy, types, DB constraint and branding to DP-900
- [x] Import the nine module quizzes (150 items) and seed Supabase
- [x] Deploy to Vercel

### Phase 6 — Next

- [ ] Grade item difficulty for real, including some level-3 items
- [ ] Decide whether to activate Pro / Stripe for DP-900
- [ ] Enable Vercel Web Analytics

---

## 14. Success Metrics

| Metric | Target (3 months post-launch) |
|---|---|
| Daily Active Users | 500+ |
| Avg session length | 8–12 minutes |
| D7 retention | 30%+ |
| Quiz completion rate | 75%+ |
| User-reported exam pass rate | Track via optional survey |

---

## 15. Resolved Decisions

1. **Auth model**: **Guest mode with local storage.** Anyone can start
   immediately; progress lives in localStorage under the `dp900game.*`
   namespace. Optional magic-link sign-in migrates local progress into the
   profile at a session boundary.

2. **Pricing**: **Free + optional "Pro" cosmetic tier.** Free includes the
   full question bank and every study mode. Pro would unlock extra themes,
   advanced stats, and the exam-day countdown — non-essential features only.
   Stripe is not activated for DP-900, so everyone sees the free plan.

3. **Azure icons**: **None ship.** No Microsoft icon assets are used.

4. **Localization**: **English only for v1.** No i18n framework; strings are
   inline.

5. **Accessibility**: **WCAG 2.1 AA on core flows.** "Core" = quiz, daily
   review, sign-in, and guest-to-account migration. Settings, progress
   dashboard, and admin screens are best-effort. Keyboard equivalents for
   every gesture are mandatory app-wide. Lighthouse Accessibility ≥ 90 is the
   numerical gate.

6. **True/false items**: **Two-option MCQs, not a separate type.** The `mcq`
   schema requires only options A and B, so a true/false question needs no
   invented distractors and no new question type.

7. **Code review**: **Off for DP-900.** Kept in the codebase, unrouted, for
   future exam forks (§6.2).

---

*Spec 1.0 and 2.0 described the DP-700 app this line of forks started from.
3.0 was rewritten 2026-10-18 for AZ-900; 4.0 rewritten 2026-10-19 for DP-900.*
