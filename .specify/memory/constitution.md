<!--
SYNC IMPACT REPORT
==================
Version change: 3.0.0 → 4.0.0
Bump rationale: MAJOR. The repo was forked from the AZ-900 app and
re-targeted at DP-900 (Microsoft Azure Data Fundamentals). Principle II's
fixed domain set is replaced outright — a backward-incompatible
redefinition.

Modified principles:
- II. Domain set pinned to the four DP-900 slugs. Content types unchanged
  (MCQ, four-option and two-option true/false); code review stays off.

Templates: no template edits required. CLAUDE.md updated to point at
DP900-Game-Spec.md.

Spec sync: DP900-Game-Spec.md renamed to DP900-Game-Spec.md and rewritten
as 4.0 for DP-900 in the same change set. Feature specs under specs/ are
retained as DP-700-era build history; the product spec takes precedence
where they disagree.
-->

# DP-900 Learning Game Constitution

## Core Principles

### I. Mobile-First, Thumb-Friendly UX

Every screen MUST be designed at 375px width first and scaled up; primary
interactive controls MUST live within the bottom 60% of the viewport. Dark
mode is the default theme. Streak, XP, and session progress MUST remain
visible during any active session. Gestures (tap to answer, swipe up to advance) MUST have equivalent
on-screen controls and keyboard shortcuts for accessibility and desktop
use.

**Rationale**: The product's three personas all share short, on-the-go study
sessions on phones. Designing for desktop first or hiding progress signals
breaks the habit-forming loop the product depends on.

### II. Domain-Aligned Content Integrity

Every question MUST carry an explicit `domain`, `topic`, `difficulty`, and
`source` field as defined in the spec's data model. The domain set is fixed
to the four official DP-900 exam domains — `core-data-concepts`,
`relational-data`, `non-relational-data`, `analytics-workloads` — and new
domains require a constitution amendment. Questions are MCQs (four-option,
or two-option true/false); code-review items are out of scope for DP-900. AI-generated content
MUST be tagged `source: "ai-generated"` and MUST NOT be promoted into the
seeded bank without human review.

**Rationale**: Exam alignment is the product's reason to exist. Untagged or
mis-tagged content silently corrupts the spaced-repetition queue, the
weak-area dashboard, and the level-progression gates.

### III. AI as an Authoring Tool, Not a Runtime Dependency

The production runtime MUST NOT make outbound calls to any AI provider.
Claude is used **only** by the maintainer, offline, to draft and refine
question-bank entries. All AI-authored items MUST be validated against
the JSON schemas in DP900-Game-Spec.md §8, reviewed by a human, tagged
`source: "ai-generated"`, and committed to the seed bank before reaching
users. Any future proposal to add a runtime AI feature ("Explain more",
on-demand generation, weak-area summaries) requires an amendment of
this constitution and a fresh review of cost, rate-limit, and
key-handling controls.

**Rationale**: Keeping AI out of the runtime removes an entire class of
failure modes — leaked API keys, runaway spend, latency spikes, and
factual drift between the curated bank and on-demand content. The
bank is the single source of truth that learners study against.

### IV. Secrets Stay Server-Side

The Anthropic API key, any service-role Supabase keys, and any third-party
credentials MUST NEVER appear in client bundles, repository files, or
client-side environment variables. All privileged calls MUST go through
Supabase Edge Functions. Supabase tables MUST have Row-Level Security
enabled before exposure to the client; the `anon` key is the only
Supabase credential permitted in the frontend.

**Rationale**: A leaked Anthropic key is an immediate financial incident.
A missing RLS policy on `user_progress` or `sessions` leaks per-learner
performance data across accounts.

### V. Measurable Quality Gates

Before any merge to `main` that touches user-facing code: Lighthouse
mobile score MUST be ≥ 90 (Performance, Accessibility, Best Practices,
SEO); the PWA manifest and offline shell MUST remain installable; and
new question content MUST validate against the JSON schemas
in the spec's data model. Phase exit criteria (Phases 1–4 in the spec)
are not advisory — a phase MAY NOT be declared complete while any
checkbox in its scope remains unchecked.

**Rationale**: "Mobile-first" and "fast" decay silently without numeric
gates. Schema validation is the cheapest way to keep the question bank
honest as both humans and Claude contribute to it.

## Technology & Platform Constraints

The following stack choices are load-bearing and changing any of them
requires a MAJOR version bump of this constitution:

- **Frontend**: React 18 + Vite, Tailwind CSS with hand-rolled
  components, React Router v6, Zustand for global state, Framer Motion for
  transitions.
- **Backend**: Supabase (Postgres + Auth + Storage) as the system of
  record. No serverless functions are required for v1; if one is added
  later it MUST be justified in the relevant plan's Complexity Tracking
  table.
- **AI (authoring only)**: Anthropic Claude is used by the maintainer
  to draft seed content. The Anthropic key MUST NOT be present in the
  application bundle, edge runtime, or Vercel project environment.
- **Hosting**: Vercel (primary) or Azure Static Web Apps (acceptable
  alternative). CI/CD via GitHub Actions, auto-deploy on merge to `main`.
- **Distribution**: PWA only for v1. Native iOS/Android wrappers are
  out of scope and MUST NOT be added without an amendment.

## Development Workflow & Quality Gates

- **Phased delivery**: Work proceeds in the four phases defined in
  DP900-Game-Spec.md §13. A later phase MUST NOT consume scope from
  an earlier phase without rebaselining the spec.
- **Specs precede code**: Every feature branch MUST originate from a
  spec under `specs/###-feature-name/` produced by `/speckit-specify`,
  with a `/speckit-plan` artifact before implementation tasks are
  generated.
- **Environment hygiene**: Local development uses `.env`; production
  uses Vercel environment variables. `.env` MUST be gitignored.
- **Observability**: Vercel Analytics for frontend signals and Supabase
  logs for data-layer signals are the minimum required telemetry.
  Per-domain answer accuracy MUST be queryable from `user_progress`
  and `sessions`.
- **Review**: All PRs MUST verify compliance with the five core
  principles and cite, when violated, an entry in the plan's Complexity
  Tracking table with a justified rejection of the simpler alternative.

## Governance

This constitution supersedes ad-hoc engineering preferences and informal
conventions. When this document and another artifact (README, ticket,
chat decision) disagree, this document wins until amended.

**Amendment procedure**: Open a PR that edits this file and any
dependent templates in the same commit. The PR description MUST state
the proposed semantic version bump and its rationale. At least one
reviewer MUST approve the amendment in addition to any code review.

**Versioning policy**:
- **MAJOR**: Removing a principle, redefining a principle in a
  backward-incompatible way, or changing a load-bearing stack choice
  listed under "Technology & Platform Constraints".
- **MINOR**: Adding a principle or materially expanding guidance in
  an existing section.
- **PATCH**: Wording, typo, or non-semantic clarifications, including
  model-version refreshes within the same Claude generation.

**Compliance review**: Every `/speckit-plan` run MUST evaluate its
feature against the Constitution Check gate using the principles
above. Unjustified violations block plan acceptance.

**Version**: 4.0.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-10-19
