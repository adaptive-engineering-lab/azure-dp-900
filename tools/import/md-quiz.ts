/**
 * Import practice-quiz markdown from bank/knowledge/ into the seed bank.
 *
 * Source format (one file per Microsoft Learn module, named
 * `DP900-M<N>-<Module-Title>-Quiz.md`; N is the study order):
 *
 *   # DP-900 Quiz: Module <N> — <module title>
 *   **Domain <N>:** <domain name> (<weight> of exam)
 *   **Learning path:** <path title>
 *
 *   ## Section A: Multiple choice
 *   **1.** <question>
 *   - A) <option>
 *   - B) <option>  …through D
 *
 *   ## Section B: True or false
 *   **11.** <statement>
 *
 *   ## Section C: Scenarios
 *   (same shape as Section A; numbering carries on from Section B)
 *
 *   # Answer key
 *   **1. C** — <rationale> *Not A:* … *Not B:* …
 *   **11. False** — <rationale>
 *
 *   ## Sources (Microsoft Learn)
 *   - [<unit title>](https://learn.microsoft.com/…/training/modules/<slug>/<unit>)
 *
 * The module is identified by the slug in its Sources links.
 *
 * Every section becomes an `mcq` item. Section B's true/false statements use
 * a two-option MCQ (A = True, B = False) — the mcq schema requires only A and
 * B, so no filler distractors have to be invented.
 *
 * IDs are UUIDv5 over "<idStem>#<question number>" (e.g. "…#7"), so re-running
 * the import is idempotent — the same question keeps the same id and the seed
 * CLI's cross-bank duplicate check stays happy.
 *
 * Usage:
 *   pnpm -C tools import:md               # write the seed file
 *   pnpm -C tools import:md -- --dry-run  # report only, write nothing
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(TOOLS_DIR, '..');
const KNOWLEDGE_DIR = resolve(REPO_ROOT, 'bank', 'knowledge');
const CONTENT_DIR = resolve(REPO_ROOT, 'supabase', 'seed', 'content');

type Domain = 'core-data-concepts' | 'relational-data' | 'non-relational-data' | 'analytics-workloads';

/**
 * Prose domain names as written in the quiz headers. "non-relational" comes
 * before "relational" because the latter is a substring of the former.
 */
const DOMAIN_PROSE: ReadonlyArray<[RegExp, Domain]> = [
  [/non-?relational data/i, 'non-relational-data'],
  [/relational data/i, 'relational-data'],
  [/analytics workload/i, 'analytics-workloads'],
  [/core data concepts/i, 'core-data-concepts'],
];

/**
 * Microsoft Learn modules, keyed by the slug in their `Source module:` URL.
 *
 * `topic` becomes the module title, so the bank is grouped the way a learner
 * actually studies — by module — rather than by exam-objective phrasing.
 *
 * `paths` lists every learning path the module belongs to (they become tags)
 * and `primaryPath` is the one it is filed under in the UI. The DP-900 paths
 * don't share modules, so each module has exactly one. Path ids match
 * exams.config.json → learningPaths.
 */
interface ModuleInfo {
  title: string;
  paths: string[];
  /**
   * Omitted for a module that belongs to no path in exams.config.json — it is
   * still worth registering for its canonical title, but it carries no path
   * tag, and the picker renders it without a path label.
   */
  primaryPath?: string;
  /**
   * The file stem question ids are hashed from — the one the module's rows
   * were first seeded under, pinned so that renumbering or renaming its quiz
   * file keeps every id. Without it a rename re-issues the module's ids, the
   * upsert-only seed leaves the old rows live beside the new ones, and the
   * only cleanup — deleting the old rows — cascades away learners' progress.
   * Only the `order:` tag follows the current filename.
   */
  idStem: string;
}

const MODULES: Record<string, ModuleInfo> = {
  // lp1 — Introduction to Microsoft Azure Data core data concepts
  'explore-core-data-concepts': {
    title: 'Explore core data concepts',
    paths: ['lp1'],
    primaryPath: 'lp1',
    idStem: 'DP900-M1-core-data-concepts',
  },
  'explore-roles-responsibilities-world-of-data': {
    title: 'Explore data roles and services',
    paths: ['lp1'],
    primaryPath: 'lp1',
    idStem: 'DP900-M2-data-roles-and-services',
  },
  // lp2 — Introduction to Microsoft Azure Data relational data in Azure
  'explore-relational-data-offerings': {
    title: 'Explore fundamental relational data concepts',
    paths: ['lp2'],
    primaryPath: 'lp2',
    idStem: 'DP900-M3-relational-data-concepts',
  },
  'explore-provision-deploy-relational-database-offerings-azure': {
    title: 'Explore relational database services in Azure',
    paths: ['lp2'],
    primaryPath: 'lp2',
    idStem: 'DP900-M4-relational-database-services',
  },
  // lp3 — Introduction to Microsoft Azure Data non-relational data in Azure
  'explore-provision-deploy-non-relational-data-services-azure': {
    title: 'Explore Azure Storage for non-relational data',
    paths: ['lp3'],
    primaryPath: 'lp3',
    idStem: 'DP900-M5-azure-storage-non-relational',
  },
  'explore-non-relational-data-stores-azure': {
    title: 'Explore fundamentals of Azure Cosmos DB',
    paths: ['lp3'],
    primaryPath: 'lp3',
    idStem: 'DP900-M6-azure-cosmos-db',
  },
  // lp4 — Introduction to Microsoft Azure Data analytics in Azure
  'examine-components-of-modern-data-warehouse': {
    title: 'Explore fundamentals of large-scale data analytics',
    paths: ['lp4'],
    primaryPath: 'lp4',
    idStem: 'DP900-M7-large-scale-analytics',
  },
  'explore-fundamentals-stream-processing': {
    title: 'Explore fundamentals of real-time analytics',
    paths: ['lp4'],
    primaryPath: 'lp4',
    idStem: 'DP900-M8-real-time-analytics',
  },
  'explore-fundamentals-data-visualization': {
    title: 'Explore fundamentals of data visualization',
    paths: ['lp4'],
    primaryPath: 'lp4',
    idStem: 'DP900-M9-data-visualization',
  },
};

/** Pull the module slug out of a learn.microsoft.com/training/modules/<slug>/ URL. */
function moduleSlugFromUrl(url: string | undefined): string | undefined {
  return url?.match(/\/training\/modules\/([^/?#]+)/)?.[1];
}

/** Section A recalls facts, Section C reasons about a scenario. */
const DIFFICULTY_BY_SECTION: Record<Section, 1 | 2 | 3> = { A: 1, B: 1, C: 2 };

const LIMITS = {
  mcqQuestion: 600,
  mcqOption: 240,
  explanation: 1200,
} as const;

type Section = 'A' | 'B' | 'C';

interface ParsedQuestion {
  /** The question number as written, e.g. "1", "11", "17" — unique per file. */
  key: string;
  section: Section;
  prompt: string;
  options?: Record<'A' | 'B' | 'C' | 'D', string>;
}

interface ParsedAnswer {
  key: string;
  /** 'A'–'D' for multiple choice, 'True'/'False' for section B. */
  verdict: string;
  explanation: string;
}

interface BankItem {
  id: string;
  type: 'mcq';
  domain: Domain;
  topic: string;
  difficulty: 1 | 2 | 3;
  source: 'bank';
  tags: string[];
  content: Record<string, unknown>;
}

const warnings: string[] = [];
const warn = (msg: string): void => {
  warnings.push(msg);
};

/** RFC 4122 §4.3 name-based UUIDv5 (SHA-1), so ids are stable across runs. */
function uuidv5(name: string, namespace: string): string {
  const nsBytes = Buffer.from(namespace.replace(/-/g, ''), 'hex');
  const hash = createHash('sha1').update(nsBytes).update(Buffer.from(name, 'utf8')).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // RFC 4122 variant
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Fixed namespace for this bank — arbitrary but must never change. */
const NS = 'b1f0a6d2-4c3e-5a90-9d7e-2a900f1c0de5';

/** Strip the markdown the schemas forbid, leaving readable plain text. */
function plain(md: string): string {
  return md
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function capped(value: string, limit: number, label: string): string {
  if (value.length <= limit) return value;
  warn(`${label}: ${value.length} chars exceeds ${limit}; truncated at a word boundary`);
  const cut = value.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function parseDomain(body: string, file: string): Domain {
  const line = body.match(/^\*\*Domain \d+:\*\*.*$/m)?.[0];
  if (!line) {
    warn(`${file}: no "**Domain N:**" header line; defaulted to core-data-concepts`);
    return 'core-data-concepts';
  }
  for (const [re, domain] of DOMAIN_PROSE) if (re.test(line)) return domain;
  warn(`${file}: unrecognised domain "${plain(line)}"; defaulted to core-data-concepts`);
  return 'core-data-concepts';
}

const ANSWER_KEY_RE = /^#{1,2} Answer key\b/im;

function parseQuestions(body: string, file: string): ParsedQuestion[] {
  const out: ParsedQuestion[] = [];
  const sectionRe = /^## Section ([ABC])\b.*$/gm;
  const marks = [...body.matchAll(sectionRe)];

  for (const [i, mark] of marks.entries()) {
    const section = mark[1] as Section;
    const start = mark.index! + mark[0].length;
    const end = i + 1 < marks.length ? marks[i + 1]!.index! : (body.match(ANSWER_KEY_RE)?.index ?? body.length);
    // The rule above "## Answer key" would otherwise trail the last prompt.
    const chunk = body.slice(start, end).replace(/^---\s*$/gm, '');

    // A question runs from its "**7.**" marker to the next one (or chunk
    // end). `$(?![\s\S])` is end-of-input; plain `$` would match every line
    // end under /m, and JS has no \Z.
    const qRe = /^\*\*(\d+)\.\*\*\s*([\s\S]*?)(?=^\*\*\d+\.\*\*|$(?![\s\S]))/gm;
    for (const m of chunk.matchAll(qRe)) {
      const key = m[1]!;
      const raw = m[2]!.trim();
      if (section === 'B') {
        out.push({ key, section, prompt: plain(raw) });
        continue;
      }
      const optRe = /^-\s*([A-D])\)\s+(.+)$/gm;
      const options = {} as Record<'A' | 'B' | 'C' | 'D', string>;
      let promptEnd = raw.length;
      for (const o of raw.matchAll(optRe)) {
        if (o.index! < promptEnd) promptEnd = o.index!;
        options[o[1] as 'A'] = plain(o[2]!);
      }
      const missing = (['A', 'B', 'C', 'D'] as const).filter((k) => !options[k]);
      if (missing.length > 0) {
        warn(`${file} ${key}: missing option(s) ${missing.join(', ')}; skipped`);
        continue;
      }
      out.push({ key, section, prompt: plain(raw.slice(0, promptEnd)), options });
    }
  }
  return out;
}

function parseAnswers(body: string, file: string): Map<string, ParsedAnswer> {
  const map = new Map<string, ParsedAnswer>();
  const keyStart = body.match(ANSWER_KEY_RE);
  if (!keyStart) {
    warn(`${file}: no "## Answer key" section; every question in this file is unanswerable`);
    return map;
  }
  const chunk = body.slice(keyStart.index! + keyStart[0].length);

  //   **1. C** — rationale *Not A:* … *Not B:* …
  //   **11. False** — rationale
  const re =
    /^\*\*(\d+)\.\s*([A-D]|True|False)\*\*\s*[—–-]?\s*([\s\S]*?)(?=^\*\*\d+\.\s|^#{1,3}\s|^---|$(?![\s\S]))/gm;
  for (const m of chunk.matchAll(re)) {
    const key = m[1]!;
    if (map.has(key)) warn(`${file} ${key}: answered twice; keeping the first`);
    else map.set(key, { key, verdict: m[2]!, explanation: plain(m[3] ?? '') });
  }
  return map;
}

function buildItems(file: string, body: string): BankItem[] {
  const stem = file.replace(/\.md$/, '');
  const domain = parseDomain(body, file);
  const headingTitle = plain(body.match(/^#\s+(.+)$/m)?.[1] ?? stem).replace(
    /^DP-900 Quiz:\s*Module \d+\s*[—–-]\s*/,
    '',
  );
  // Every Sources link points into the module; the first is enough.
  const sourceUrl = body.match(/\((https:\/\/learn\.microsoft\.com\/[^)\s]*\/training\/modules\/[^)\s]+)\)/)?.[1];

  // The module is the unit of study, so it is the topic. Prefer the canonical
  // Learn title over the quiz heading, which is hand-typed and drifts.
  const slug = moduleSlugFromUrl(sourceUrl);
  const info = slug ? MODULES[slug] : undefined;
  if (slug && !info) {
    warn(`${file}: module "${slug}" is not in MODULES; using the quiz heading as topic and tagging no learning path`);
  } else if (!slug) {
    warn(`${file}: no learn.microsoft.com/training/modules/ link in Sources; using the quiz heading as topic`);
  }
  const topic = info?.title ?? headingTitle;
  // The "m<NN>" in the filename is the order the modules are meant to be
  // worked through, so carry it into the bank — it is not derivable from
  // anything else once the file name is gone.
  const orderPrefix = stem.match(/^DP900-M(\d+)-/i)?.[1];
  if (!orderPrefix) {
    warn(`${file}: filename has no "DP900-M<N>-" prefix; the module picker will fall back to alphabetical order`);
  }
  const orderTag = orderPrefix ? `order:${Number(orderPrefix)}` : undefined;
  const pathTags = (info?.paths ?? []).map((p) => `path:${p}`);
  const moduleTag = slug ? `module:${slug}` : undefined;
  const primaryPathTag = info?.primaryPath ? `primary-path:${info.primaryPath}` : undefined;

  const questions = parseQuestions(body, file);
  const answers = parseAnswers(body, file);
  const items: BankItem[] = [];

  for (const q of questions) {
    const a = answers.get(q.key);
    if (!a) {
      warn(`${file} ${q.key}: no answer-key entry; skipped`);
      continue;
    }
    const difficulty = DIFFICULTY_BY_SECTION[q.section];
    const id = uuidv5(`${info?.idStem ?? stem}#${q.key}`, NS);
    const tags = [
      domain,
      slugify(topic),
      `level-${difficulty}`,
      ...(orderTag ? [orderTag] : []),
      ...(moduleTag ? [moduleTag] : []),
      ...pathTags,
      ...(primaryPathTag ? [primaryPathTag] : []),
    ];
    // Provenance is carried by `topic` and the module/path tags and rendered
    // by SourceLine, so the URL is not repeated inside the explanation.
    const explanation = capped(a.explanation, LIMITS.explanation, `${file} ${q.key} explanation`);

    if (q.section === 'B') {
      if (a.verdict !== 'True' && a.verdict !== 'False') {
        warn(`${file} ${q.key}: section B answer is "${a.verdict}", expected True/False; skipped`);
        continue;
      }
      items.push({
        id,
        type: 'mcq',
        domain,
        topic,
        difficulty,
        source: 'bank',
        tags,
        content: {
          question: capped(`True or false? ${q.prompt}`, LIMITS.mcqQuestion, `${file} ${q.key} question`),
          options: { A: 'True', B: 'False' },
          correct: a.verdict === 'True' ? 'A' : 'B',
          explanation,
        },
      });
      continue;
    }

    if (!/^[A-D]$/.test(a.verdict)) {
      warn(`${file} ${q.key}: answer "${a.verdict}" is not A–D; skipped`);
      continue;
    }
    const options = Object.fromEntries(
      (['A', 'B', 'C', 'D'] as const).map((k) => [
        k,
        capped(q.options![k], LIMITS.mcqOption, `${file} ${q.key} option ${k}`),
      ]),
    ) as Record<'A' | 'B' | 'C' | 'D', string>;

    items.push({
      id,
      type: 'mcq',
      domain,
      topic,
      difficulty,
      source: 'bank',
      tags,
      content: {
        question: capped(q.prompt, LIMITS.mcqQuestion, `${file} ${q.key} question`),
        options,
        correct: a.verdict,
        explanation,
      },
    });
  }
  return items;
}

function main(): void {
  const dryRun = process.argv.includes('--dry-run');
  const files = readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md').sort();
  if (files.length === 0) {
    console.error(`No .md files in ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const all: BankItem[] = [];
  for (const file of files) {
    const items = buildItems(file, readFileSync(resolve(KNOWLEDGE_DIR, file), 'utf8'));
    const trueFalse = items.filter((i) => Object.keys(i.content.options as object).length === 2).length;
    console.log(
      `${file.padEnd(64)} ${String(items.length).padStart(3)} items  ` +
        `(${items.length - trueFalse} four-option, ${trueFalse} true/false)  → ${items[0]?.domain ?? '—'}`,
    );
    all.push(...items);
  }

  const seen = new Set<string>();
  for (const item of all) {
    if (seen.has(item.id)) warn(`duplicate id ${item.id} — check for repeated question numbers`);
    seen.add(item.id);
  }

  // Two modules pinned to one stem would hash onto each other's ids.
  const pinned = new Map<string, string>();
  for (const [slug, info] of Object.entries(MODULES)) {
    const other = pinned.get(info.idStem);
    if (other) warn(`modules "${other}" and "${slug}" share idStem "${info.idStem}"; their ids collide`);
    pinned.set(info.idStem, slug);
  }

  // The same question twice in one module — usually a pasted repeat.
  const prompts = new Map<string, string>();
  for (const item of all) {
    const key = `${item.topic}|${String(item.content.question).toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const other = prompts.get(key);
    if (other) warn(`"${item.topic}": items ${other} and ${item.id} ask the same question`);
    prompts.set(key, item.id);
  }

  const trueFalse = all.filter((i) => Object.keys(i.content.options as object).length === 2).length;
  console.log(
    `\nTotal: ${all.length} mcq — ${all.length - trueFalse} four-option, ${trueFalse} true/false, 0 code-review`,
  );
  const byDomain = new Map<string, number>();
  for (const i of all) byDomain.set(i.domain, (byDomain.get(i.domain) ?? 0) + 1);
  for (const [d, n] of [...byDomain].sort()) console.log(`  ${d.padEnd(18)} ${n}`);

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }

  if (dryRun) {
    console.log('\n--dry-run: no files written.');
    return;
  }
  writeFileSync(resolve(CONTENT_DIR, 'mcq.json'), `${JSON.stringify(all, null, 2)}\n`);
  console.log(`\nWrote ${all.length} → supabase/seed/content/mcq.json`);
  console.log('code-review.json left untouched (no code snippets in the source files).');
}

main();
