import type { SupabaseClient } from '@supabase/supabase-js';
import type { GuestProgress } from '../store';
import type { MigrationPlan } from './plan';
import { mergeProgress } from './merge';

export interface MigrationResult {
  progressInserted: number;
  progressMerged: number;
  sessionsInserted: number;
}

/**
 * Idempotent migration. Existing rows are merged (per merge.ts rules);
 * new rows are inserted. Re-running on the same plan produces zero net
 * changes after the first successful run.
 */
export async function executeMigration(
  client: SupabaseClient,
  userId: string,
  plan: MigrationPlan,
): Promise<MigrationResult> {
  let progressInserted = 0;
  let progressMerged = 0;
  let sessionsInserted = 0;

  if (plan.progress.length > 0) {
    const questionIds = plan.progress.map((p) => p.questionId);

    // Drop progress rows pointing at questions that no longer exist in the
    // bank (e.g. items removed from the seed). Without this guard, the
    // upsert below trips the question_id FK with an opaque error.
    const { data: liveQs, error: liveErr } = await client
      .from('questions')
      .select('id')
      .in('id', questionIds);
    if (liveErr) throw new Error(`migration question lookup failed: ${liveErr.message}`);
    const liveIds = new Set((liveQs ?? []).map((q) => q.id));
    const validProgress = plan.progress.filter((p) => liveIds.has(p.questionId));
    // With nothing left to upsert, fall through to the sessions below rather
    // than returning: a session is worth keeping even when every question it
    // touched has since left the bank.
    if (validProgress.length > 0) {
      ({ progressInserted, progressMerged } = await upsertProgress(client, userId, validProgress));
    }
  }

  if (plan.sessions.length > 0) {
    // Sessions are append-only; we identify already-migrated sessions by id.
    const ids = plan.sessions.map((s) => s.id);
    const { data: existing, error: selErr } = await client.from('sessions').select('id').in('id', ids);
    if (selErr) throw new Error(`migration sessions select failed: ${selErr.message}`);
    const seen = new Set((existing ?? []).map((r) => r.id));
    const toInsert = plan.sessions
      .filter((s) => !seen.has(s.id))
      .map((s) => ({
        id: s.id,
        user_id: userId,
        mode: s.mode,
        topic: s.topic,
        score_pct: s.scorePct,
        duration_seconds: s.durationSeconds,
        completed_at: s.completedAt,
      }));
    if (toInsert.length > 0) {
      // Ignore duplicates rather than fail on them: the sign-in migration and
      // the live sync (or two open tabs) can race to insert the same session.
      const { error } = await client
        .from('sessions')
        .upsert(toInsert, { onConflict: 'id', ignoreDuplicates: true });
      if (error) throw new Error(`migration sessions insert failed: ${error.message}`);
      sessionsInserted = toInsert.length;
    }
  }

  return { progressInserted, progressMerged, sessionsInserted };
}

async function upsertProgress(
  client: SupabaseClient,
  userId: string,
  validProgress: GuestProgress[],
): Promise<{ progressInserted: number; progressMerged: number }> {
  let progressInserted = 0;
  let progressMerged = 0;

  const { data: existing, error: selErr } = await client
    .from('user_progress')
    .select('question_id, times_seen, times_correct, last_rating, next_review, updated_at')
    .in('question_id', validProgress.map((p) => p.questionId));
  if (selErr) throw new Error(`migration select failed: ${selErr.message}`);

  const existingByQid = new Map((existing ?? []).map((r) => [r.question_id, r]));

  const rowsToUpsert = validProgress.map((p) => {
    const remote = existingByQid.get(p.questionId);
    if (remote) {
      progressMerged += 1;
      const merged = mergeProgress(p, remote as never);
      return {
        user_id: userId,
        question_id: merged.question_id,
        times_seen: merged.times_seen,
        times_correct: merged.times_correct,
        last_rating: merged.last_rating,
        next_review: merged.next_review,
        updated_at: merged.updated_at,
      };
    }
    progressInserted += 1;
    return {
      user_id: userId,
      question_id: p.questionId,
      times_seen: p.timesSeen,
      times_correct: p.timesCorrect,
      last_rating: p.lastRating,
      next_review: p.nextReview,
      updated_at: p.updatedAt,
    };
  });

  const { error: upErr } = await client
    .from('user_progress')
    .upsert(rowsToUpsert, { onConflict: 'user_id,question_id' });
  if (upErr) throw new Error(`migration upsert failed: ${upErr.message}`);

  return { progressInserted, progressMerged };
}
