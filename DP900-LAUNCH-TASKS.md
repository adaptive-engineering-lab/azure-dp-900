# DP-900 launch tasks

Everything left to turn this AZ-900 copy into a working DP-900 app. Do the
phases in order: the database and type changes have to land before the
questions will validate or seed.

**Already done (2026-10-19):** repo copied from azure-az-900; Supabase project
`azure-dp-900` (`bfkuwrjhytqivfrbppxe`, eu-west-1) created with migrations
0001–0019 applied; keys in `tools/.env.local` and `frontend/.env.local`;
150 questions written in `bank/knowledge/` (9 modules).

---

## 1. Exam taxonomy and database

The DP-900 database currently only accepts the AZ-900 domain slugs
(`cloud-concepts`, `azure-architecture`, `azure-management`), so nothing can
be seeded until this phase is done.

- [x] Pick the four DP-900 domain slugs. Suggested:

  | Slug | Exam domain | Weight | Modules | Questions |
  |---|---|---|---|---|
  | `core-data-concepts` | Describe core data concepts | 25–30% | M1, M2 | 34 |
  | `relational-data` | Identify considerations for relational data on Azure | 20–25% | M3, M4 | 34 |
  | `non-relational-data` | Describe considerations for working with non-relational data on Azure | 15–20% | M5, M6 | 34 |
  | `analytics-workloads` | Describe an analytics workload on Azure | 25–30% | M7, M8, M9 | 48 |

- [x] Rewrite `exams.config.json` for DP-900: code, title ("Microsoft Azure Data Fundamentals"), certification title, the four domains with labels, weights and topics, four learning paths (lp1–lp4) with their Learn URLs and module counts, `questionTargets` (150 total, split as above), and `productionUrl` (left empty until Vercel gives one — see phase 6).
- [x] Add migration `supabase/migrations/0020_dp900_domains.sql` that swaps `questions_domain_chk` to the new slugs (start from `template/migrations/swap_domain_constraint.example.sql`). 0001 is already applied, so editing it in place won't reach the live database.
- [x] Apply 0020 to the DP-900 project.
- [x] Update the `Domain` union, `DOMAINS` and `DOMAIN_LABELS` in `frontend/src/lib/questions/types.ts`.
- [x] Update the hardcoded domain lists in `frontend/src/lib/dashboard/aggregate.ts` and `frontend/src/lib/dashboard/useDomainCounts.ts`, and the default domain in `frontend/src/pages/AdminPage.tsx` (lines ~430, ~439).
- [x] Update the domain enum in the question JSON schemas: `frontend/src/lib/admin/schemas/mcq.schema.json`, `code-review.schema.json`, and the seed CLI's copies in `specs/001-supabase-schema-and-seed/contracts/`.

## 2. Import the questions

`tools/import/md-quiz.ts` parses the AZ-900 quiz format, and the DP-900 files
are written differently, so the importer can't read them as-is.

- [x] Rewrite the parser for the DP-900 format:
  - header `**Domain N:** <name> (<weight>)` maps to a domain slug
  - questions numbered `**1.**`–`**18.**` straight through Sections A–C, rather than A1/B1/C1
  - options written `- A) …` rather than `- **A.** …`
  - answer key `**N. C** — <rationale> *Not A:* … *Not B:* …`, and `**N. True** — …` for true/false
  - the module slug comes from the `## Sources` links (`/training/modules/<slug>/…`), since there's no `Source module:` line
- [x] Replace the `MODULES` map with the nine DP-900 modules: title, learning path, and a fixed `idStem` per module. The idStem has to stay the same forever, or a rename later duplicates questions.
- [x] Check the module slugs against Learn. All nine resolve (M7's `examine-components-of-modern-data-warehouse` is Learn's real slug for the large-scale analytics module).
- [x] Update the file-name pattern and `order:` tag logic for `DP900-M<N>-…-Quiz.md` (also see `frontend/src/lib/questions/useModules.ts`).
- [x] Run `pnpm -C tools import:md -- --dry-run`, then for real. Expect 150 items.
- [x] Make sure `supabase/seed/content/mcq.json` holds only the DP-900 items. It currently has 213 AZ-900 questions that must not be seeded.
- [x] `pnpm -C tools seed:validate`, then `pnpm -C tools seed`. `tools/.env.local` already points at the DP-900 project.
- [x] Spot-check in the database: 150 rows, with the per-domain counts above.

## 3. Branding and copy

- [x] `frontend/index.html`: title, meta description, and the `az900game.v1.state` localStorage key in the inline script
- [x] `frontend/src/lib/storage/namespace.ts`: `NAMESPACE = 'az900game'` → `dp900game`. Keep it in step with index.html.
- [x] `frontend/vite.config.ts`: PWA manifest name, short_name, description
- [x] `frontend/src/pages/HomePage.tsx`: hero copy, including the hardcoded "three exam domains" and "questions across 3 domains" (now four)
- [x] `frontend/src/components/ExamCountdownWidget.tsx`: "AZ-900" label
- [x] `frontend/src/pages/TermsOfServicePage.tsx`, `PrivacyPolicyPage.tsx`, `WhatsInProPage.tsx`: exam name. Also check the Supabase region in the privacy page, which is now eu-west-1 (Ireland).
- [x] `frontend/src/components/InstallPrompt.tsx`, `PrivateModeWarning.tsx`, `frontend/src/lib/pwa/install.ts`, `frontend/src/lib/store/preferences.ts`, `frontend/src/lib/spacing.ts`: remaining AZ-900 mentions
- [x] Package names in `frontend/package.json` and `tools/package.json`; `project_id` in `supabase/config.toml`
- [x] `frontend/.env.example`: DP-900 wording and exam identity values
- [x] Optional: new `frontend/public/icon.svg` and theme colour (icon text is now "DP"; theme colour unchanged)

To find anything left over:

```bash
git grep -niE "az-?900|azure fundamentals" -- ':!specs' ':!bank' ':!template'
```

## 4. Docs

- [x] Rename `AZ900-Game-Spec.md` → `DP900-Game-Spec.md` and rewrite its exam content
- [x] `CLAUDE.md`: say DP-900, point at the new spec name
- [x] `README.md`: hero, exam-specific sections, deployment details (Supabase ref, region, Vercel URL)
- [x] `.specify/memory/constitution.md` (now 4.0.0), `tools/README.md`, `supabase/functions/README.md`, `tests/load/README.md`; `tests/load/static-shell.js` now requires `APP_URL` instead of defaulting to the AZ-900 site
- [ ] Decide what to do with `specs/` (keep, archive, or trim). See `template/PORTING_CHECKLIST.md` §10.

## 5. Tests

These tests hardcode the AZ-900 slugs or names and will fail after phase 1:

- [x] Frontend unit tests in `frontend/tests/unit/` (slugs swapped in phase 1; all 78 pass): `admin-mutations`, `admin-questions-store`, `admin-validation`, `dashboard-aggregate`, `domain-breakdown`, `module-sections`, `pick`, `storage-adapter`, `namespace`, and `frontend/tests/component/routing.test.tsx`
- [x] Contract and integration tests in `tests/` (slugs swapped, fourth domain added to the full-list checks): `author-promote`, `author-prompt`, `domain-coverage`, `duplicate-id`, `partial-failure-rollback`, `query-latency`, `admin-rls`, `question-queries`
- [x] `tools/seed/demo.ts`, `tools/author/lib/draft.ts`, `tools/author/prompts/code-review.md`, `tools/test-helpers/*`: domain slugs and exam name
- [x] `pnpm install` in `frontend/` and `tools/`
- [x] `pnpm -C frontend build` with no type errors
- [x] `pnpm -C frontend test` passes (78/78)
- [x] `pnpm -C tools test` (data-layer suite): 61/61 passed on 2026-10-19 with `ALLOW_LIVE_TESTS=1` against the DP-900 project (no Docker here for a local stack). Bank unchanged, no leftover users or rows.
- [ ] Known, inherited: `tools/author/lib/draft.ts` fails type-checking on `cache_control` with the pinned `@anthropic-ai/sdk@^0.30`. It isn't in the tools tsconfig, so nothing catches it; bump the SDK if the author tool is used.

## 6. Git and deployment

- [ ] First commit and push to `adaptive-engineering-lab/azure-dp-900` (the repo has no commits yet)
- [ ] Restore `.mcp.json` with `project_ref=bfkuwrjhytqivfrbppxe`, if you still want the project Supabase MCP server. The file disappeared from this folder.
- [ ] Vercel: create the project from the GitHub repo. Leave Root Directory empty and Framework Preset unset, because `vercel.json` does `cd frontend` itself.
- [ ] Vercel env vars for Production and Preview: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (same values as `frontend/.env.local`). Only `VITE_*` vars are read.
- [ ] Turn off Vercel Deployment Protection if the site should be public
- [ ] Supabase → Authentication → URL Configuration: Site URL `https://<vercel-url>/`, redirect URLs `https://<vercel-url>/auth/callback` and `http://localhost:5173/auth/callback`
- [ ] Put the real production URL into `exams.config.json` → `productionUrl` and the README
- [ ] Optional (Pro tier only): Stripe product, Supabase secrets, deploy the three edge functions. See `template/PORTING_CHECKLIST.md` §9.

## 7. Smoke test on production

- [ ] Home page shows "150 questions across 4 domains"; console is clean
- [ ] Hard reload on a deep link (e.g. `/learn/quiz`) loads the app rather than a 404
- [ ] Each of the nine modules opens and plays a quiz
- [ ] Sign up with a real email; `profiles` and `subscriptions` rows appear in the DP-900 project
- [ ] A finished session lands in `sessions`; `/progress` radar shows the four DP-900 domain labels
- [ ] `/legal/privacy` and `/legal/terms` show DP-900 and the right operator details

## 8. Housekeeping

- [ ] Revoke the Supabase access token that was pasted in chat, make a new one, and update `SUPABASE_ACCESS_TOKEN` in `tools/.env.local`
- [ ] Remove the stray DP-900 connection string at the bottom of the **AZ-900** repo's `tools/.env`
- [ ] Branch protection on `main` for the new repo
