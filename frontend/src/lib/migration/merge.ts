import type { GuestProgress, GuestProgressMap } from '../store/progress';
import type { GuestSession } from '../store/sessions';

interface RemoteProgress {
  question_id: string;
  times_seen: number;
  times_correct: number;
  last_rating: 'correct' | 'almost' | 'missed' | null;
  next_review: string | null;
  updated_at: string;
}

/**
 * Conflict resolution for a (user, question) pair that exists both locally
 * and remotely. Rules per spec FR-010:
 *   - prefer higher times_seen
 *   - prefer more recent last_rating (by updatedAt)
 */
export function mergeProgress(local: GuestProgress, remote: RemoteProgress): RemoteProgress {
  const winnerSeen = Math.max(local.timesSeen, remote.times_seen);
  const winnerCorrect = Math.max(local.timesCorrect, remote.times_correct);
  const localNewer = Date.parse(local.updatedAt) > Date.parse(remote.updated_at);
  return {
    question_id: remote.question_id,
    times_seen: winnerSeen,
    times_correct: Math.min(winnerCorrect, winnerSeen), // honor counts CHECK
    last_rating: localNewer ? local.lastRating : remote.last_rating,
    next_review: localNewer ? local.nextReview : remote.next_review,
    updated_at: localNewer ? local.updatedAt : remote.updated_at,
  };
}

/**
 * Combine local and server progress after a hydrate. Entries on only one side
 * are kept as they are; entries on both go through mergeProgress. Replacing
 * local with the server copy instead would drop answers recorded locally but
 * not yet uploaded.
 */
export function mergeProgressMaps(
  local: GuestProgressMap,
  server: GuestProgressMap,
): GuestProgressMap {
  const out: GuestProgressMap = { ...server };
  for (const [qid, l] of Object.entries(local)) {
    const s = server[qid];
    if (!s) {
      out[qid] = l;
      continue;
    }
    const m = mergeProgress(l, {
      question_id: s.questionId,
      times_seen: s.timesSeen,
      times_correct: s.timesCorrect,
      last_rating: s.lastRating,
      next_review: s.nextReview,
      updated_at: s.updatedAt,
    });
    out[qid] = {
      questionId: qid,
      timesSeen: m.times_seen,
      timesCorrect: m.times_correct,
      lastRating: m.last_rating,
      nextReview: m.next_review,
      updatedAt: m.updated_at,
    };
  }
  return out;
}

/**
 * Union of local and server sessions by id, newest first, capped. Sessions
 * are immutable once recorded, so an id on both sides is the same session.
 */
export function mergeSessions(
  local: GuestSession[],
  server: GuestSession[],
  cap: number,
): GuestSession[] {
  const byId = new Map<string, GuestSession>();
  for (const s of server) byId.set(s.id, s);
  for (const s of local) if (!byId.has(s.id)) byId.set(s.id, s);
  return [...byId.values()]
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .slice(0, cap);
}
