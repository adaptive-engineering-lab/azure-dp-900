import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAppStore, type GuestProgress, type GuestSession } from '../../src/lib/store';
import { executeMigration } from '../../src/lib/migration/execute';
import { buildMigrationPlan } from '../../src/lib/migration/plan';
import { mergeProgressMaps, mergeSessions } from '../../src/lib/migration/merge';
import { startLiveSync, withoutLiveSync, type LiveSync } from '../../src/lib/sync/liveSync';

type Row = Record<string, unknown>;

/**
 * In-memory stand-in for the slice of the Supabase query builder the sync
 * uses: `select(...).in(col, ids)` and `upsert(rows, { onConflict })`.
 */
function fakeSupabase(seed: { questions?: string[] } = {}) {
  const tables: Record<string, Row[]> = {
    questions: (seed.questions ?? []).map((id) => ({ id })),
    user_progress: [],
    sessions: [],
  };
  const writes: Array<{ table: string; rows: Row[]; options: Row }> = [];
  let failNextWrite = false;

  const keyOf = (table: string, row: Row): string =>
    table === 'user_progress' ? `${row.user_id}|${row.question_id}` : String(row.id);

  const client = {
    from(table: string) {
      return {
        select: () => ({
          in: async (col: string, ids: unknown[]) => ({
            data: tables[table]!.filter((r) => ids.includes(r[col])),
            error: null,
          }),
        }),
        upsert: async (rows: Row[], options: Row) => {
          if (failNextWrite) {
            failNextWrite = false;
            return { error: { message: 'network down' } };
          }
          writes.push({ table, rows, options });
          for (const row of rows) {
            const i = tables[table]!.findIndex((r) => keyOf(table, r) === keyOf(table, row));
            if (i === -1) tables[table]!.push(row);
            else if (!options.ignoreDuplicates) tables[table]![i] = row;
          }
          return { error: null };
        },
      };
    },
  } as unknown as SupabaseClient;

  return {
    client,
    tables,
    writes,
    failNextWrite: () => {
      failNextWrite = true;
    },
  };
}

const USER = 'user-1';
const Q1 = '00000000-0000-4000-8000-000000000001';
const Q2 = '00000000-0000-4000-8000-000000000002';

function progress(questionId: string, timesSeen: number, updatedAt: string): GuestProgress {
  return {
    questionId,
    timesSeen,
    timesCorrect: 0,
    lastRating: 'missed',
    nextReview: null,
    updatedAt,
  };
}

function session(id: string, completedAt: string): GuestSession {
  return { id, mode: 'mcq', topic: 'Explore core data concepts', scorePct: 50, durationSeconds: 60, completedAt };
}

describe('executeMigration', () => {
  it('still uploads sessions when none of the progress maps to a live question', async () => {
    const db = fakeSupabase({ questions: [] });
    const result = await executeMigration(
      db.client,
      USER,
      buildMigrationPlan({
        progress: { [Q1]: progress(Q1, 1, '2026-10-19T21:00:00Z') },
        sessions: [session('s1', '2026-10-19T21:05:00Z')],
      }),
    );
    expect(result.sessionsInserted).toBe(1);
    expect(db.tables.sessions).toHaveLength(1);
    expect(db.tables.user_progress).toHaveLength(0);
  });

  it('skips sessions already on the server and inserts with ignoreDuplicates', async () => {
    const db = fakeSupabase({ questions: [Q1] });
    const plan = buildMigrationPlan({ progress: {}, sessions: [session('s1', '2026-10-19T21:05:00Z')] });
    await executeMigration(db.client, USER, plan);
    const again = await executeMigration(db.client, USER, plan);
    expect(again.sessionsInserted).toBe(0);
    expect(db.tables.sessions).toHaveLength(1);
    expect(db.writes.find((w) => w.table === 'sessions')?.options).toMatchObject({ ignoreDuplicates: true });
  });
});

describe('hydrate merge', () => {
  it('keeps local-only progress, adds server-only progress, and merges overlaps', () => {
    const merged = mergeProgressMaps(
      { [Q1]: progress(Q1, 5, '2026-10-19T22:00:00Z') },
      {
        [Q1]: progress(Q1, 3, '2026-10-19T20:00:00Z'),
        [Q2]: progress(Q2, 2, '2026-10-19T20:00:00Z'),
      },
    );
    expect(merged[Q1]!.timesSeen).toBe(5);
    expect(merged[Q1]!.updatedAt).toBe('2026-10-19T22:00:00Z');
    expect(merged[Q2]!.timesSeen).toBe(2);
  });

  it('unions sessions by id, newest first, within the cap', () => {
    const merged = mergeSessions(
      [session('local', '2026-10-19T22:00:00Z'), session('both', '2026-10-19T20:00:00Z')],
      [session('both', '2026-10-19T20:00:00Z'), session('server', '2026-10-19T21:00:00Z')],
      2,
    );
    expect(merged.map((s) => s.id)).toEqual(['local', 'server']);
  });

  it('hydrateFromServer no longer drops a session that was not uploaded yet', () => {
    useAppStore.getState().reset();
    useAppStore.getState().recordSession({ mode: 'mcq', topic: 't', scorePct: 50, durationSeconds: 60 });
    const localId = useAppStore.getState().sessions[0]!.id;
    useAppStore.getState().hydrateFromServer({ progress: {}, sessions: [], profile: null });
    expect(useAppStore.getState().sessions.map((s) => s.id)).toEqual([localId]);
  });
});

describe('live sync while signed in', () => {
  let sync: LiveSync | null = null;

  beforeEach(() => {
    useAppStore.getState().reset();
  });
  afterEach(() => {
    sync?.stop();
    sync = null;
  });

  function finishQuiz(): void {
    const s = useAppStore.getState();
    s.recordRating({ questionId: Q1, rating: 'correct', nextReview: '2026-10-22' });
    s.recordRating({ questionId: Q2, rating: 'missed', nextReview: '2026-10-20' });
    s.recordSession({ mode: 'mcq', topic: 'Explore core data concepts', scorePct: 50, durationSeconds: 90 });
  }

  it('uploads a finished session and its progress', async () => {
    const db = fakeSupabase({ questions: [Q1, Q2] });
    sync = startLiveSync(db.client, USER);
    finishQuiz();
    await sync.flush();
    expect(db.tables.sessions).toHaveLength(1);
    expect(db.tables.sessions[0]).toMatchObject({ user_id: USER, mode: 'mcq', score_pct: 50 });
    expect(db.tables.user_progress.map((r) => r.question_id).sort()).toEqual([Q1, Q2]);
  });

  it('does not echo a server hydrate back to the server', async () => {
    const db = fakeSupabase({ questions: [Q1] });
    sync = startLiveSync(db.client, USER);
    withoutLiveSync(() =>
      useAppStore.getState().hydrateFromServer({
        progress: { [Q1]: progress(Q1, 1, '2026-10-19T20:00:00Z') },
        sessions: [session('from-server', '2026-10-19T20:00:00Z')],
        profile: null,
      }),
    );
    await sync.flush();
    expect(db.writes).toHaveLength(0);
  });

  it('keeps a failed upload pending and retries it', async () => {
    const db = fakeSupabase({ questions: [Q1, Q2] });
    sync = startLiveSync(db.client, USER);
    finishQuiz();
    db.failNextWrite();
    await sync.flush();
    expect(db.tables.sessions).toHaveLength(0);
    await sync.flush();
    expect(db.tables.sessions).toHaveLength(1);
    expect(db.tables.user_progress).toHaveLength(2);
  });

  it('stops uploading after stop()', async () => {
    const db = fakeSupabase({ questions: [Q1, Q2] });
    const stopped = startLiveSync(db.client, USER);
    stopped.stop();
    finishQuiz();
    await stopped.flush();
    expect(db.writes).toHaveLength(0);
  });
});
