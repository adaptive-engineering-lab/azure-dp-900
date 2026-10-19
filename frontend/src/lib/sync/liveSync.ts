import type { SupabaseClient } from '@supabase/supabase-js';
import { useAppStore } from '../store';
import type { GuestProgressMap } from '../store/progress';
import { executeMigration } from '../migration/execute';
import { buildMigrationPlan } from '../migration/plan';

/**
 * Live upload of study results while signed in.
 *
 * The store only ever writes to localStorage. Without this, a session
 * finished while signed in reached Supabase only through the one-shot
 * sign-in migration on the next page load — and not at all if a hydrate
 * replaced the local copy first. This watches the store for sessions and
 * progress entries that are new or changed, and uploads just those through
 * executeMigration, which is idempotent and merges with what is already on
 * the server.
 *
 * A failed upload is kept pending and retried with the next change; anything
 * still unsent is picked up by the sign-in migration on the next page load.
 */

let paused = 0;

/**
 * Run `fn` without the live sync treating its store writes as local activity.
 * Hydrating from the server goes through here so server data is not echoed
 * straight back to the server.
 */
export function withoutLiveSync<T>(fn: () => T): T {
  paused += 1;
  try {
    return fn();
  } finally {
    paused -= 1;
  }
}

export interface LiveSync {
  /** Upload everything pending now, skipping the debounce. */
  flush: () => Promise<void>;
  stop: () => void;
}

export function startLiveSync(
  client: SupabaseClient,
  userId: string,
  { debounceMs = 400 }: { debounceMs?: number } = {},
): LiveSync {
  const pendingSessions = new Set<string>();
  const pendingProgress = new Set<string>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  // Uploads run one at a time so a retry can't overtake a newer write.
  let queue: Promise<void> = Promise.resolve();

  const unsub = useAppStore.subscribe((state, prev) => {
    if (paused > 0) return;
    if (state.sessions !== prev.sessions) {
      const before = new Set(prev.sessions.map((s) => s.id));
      for (const s of state.sessions) if (!before.has(s.id)) pendingSessions.add(s.id);
    }
    if (state.progress !== prev.progress) {
      for (const [qid, p] of Object.entries(state.progress)) {
        if (prev.progress[qid] !== p) pendingProgress.add(qid);
      }
    }
    if (pendingSessions.size === 0 && pendingProgress.size === 0) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void flush(), debounceMs);
  });

  function flush(): Promise<void> {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const sessionIds = new Set(pendingSessions);
    const questionIds = [...pendingProgress];
    pendingSessions.clear();
    pendingProgress.clear();
    if (sessionIds.size === 0 && questionIds.length === 0) return queue;

    // Read the latest values at upload time, not at change time, so a burst
    // of answers to one question uploads once with its final counts.
    const { sessions, progress } = useAppStore.getState();
    const changed: GuestProgressMap = {};
    for (const qid of questionIds) {
      const entry = progress[qid];
      if (entry) changed[qid] = entry;
    }
    const plan = buildMigrationPlan({
      progress: changed,
      sessions: sessions.filter((s) => sessionIds.has(s.id)),
    });

    queue = queue.then(async () => {
      try {
        await executeMigration(client, userId, plan);
      } catch {
        for (const id of sessionIds) pendingSessions.add(id);
        for (const qid of questionIds) pendingProgress.add(qid);
      }
    });
    return queue;
  }

  return {
    flush,
    stop: () => {
      if (timer) clearTimeout(timer);
      unsub();
    },
  };
}
