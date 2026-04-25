// supabase-sync.ts
//import { createClient, SupabaseClient } from 'supabase'

/*
  Synchronous wrapper around async Supabase calls using Atomics.wait/notify.
  This blocks the Node.js thread until the Promise resolves — it makes the
  API synchronous for callers that aren't Promise-aware.
  NOTE: This will block the event loop while waiting; use carefully.
*/

//let supabase: SupabaseClient | null = null

// function getDbSync(): SupabaseClient {
//   if (!supabase) {
//     const url = process.env.SUPABASE_URL!
//     const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
//     supabase = createClient(url, key)
//   }
//   return supabase
// }

function syncAwait<T>(p: Promise<T>): T {
  const sab = new SharedArrayBuffer(4)
  const ia = new Int32Array(sab)
  let result: T
  let error: any
  p.then((r) => {
    result = r
    Atomics.store(ia, 0, 1)
    Atomics.notify(ia, 0, 1)
  }).catch((e) => {
    error = e
    Atomics.store(ia, 0, 1)
    Atomics.notify(ia, 0, 1)
  })
  // Wait until the promise settles
  Atomics.wait(ia, 0, 0)
  if (error) throw error
  return result as T
}

export interface LeaderboardEntry {
  id: number
  player_name: string
  score: number
  total_questions: number
  total_time_ms: number
  average_time_ms: number
  created_at: string
}

// Initialize table (run once at startup). This uses service_role key; prefer running migration in dashboard for prod.
export function ensureTableExistsSync(): void {
  const sb = getDbSync()
  const sql = `
    CREATE TABLE IF NOT EXISTS public.leaderboard (
      id SERIAL PRIMARY KEY,
      player_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      total_time_ms BIGINT NOT NULL,
      average_time_ms DOUBLE PRECISION NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `
  // Supabase doesn't provide a direct SQL-exec method on the public client; using rpc to run SQL requires a function.
  // The safest synchronous path: attempt a no-op select to verify table exists; actual table creation is best done
  // via Supabase SQL editor or migrations. Still, we attempt to run creation via the SQL API endpoint:
  const createPromise = (async () => {
    // Use the REST SQL endpoint via fetch because supabase-js doesn't expose arbitrary SQL execution synchronously.
    const url = `${process.env.SUPABASE_URL}/rest/v1/rpc`
    // The REST SQL exec endpoint isn't available by default; fall back to attempting a select to trigger a clear error if absent.
    // Here we try to execute the SQL with the Postgres SQL endpoint (/rest/v1/rpc is for RPC). If this fails, ignore.
    try {
      // Try using the 'query' RPC (requires a DB function named 'sql' on Supabase). Many projects won't have it.
      // So first try rpc('sql', { q: sql })
      // If that fails, ignore; table creation should be handled via migrations in production.
      // We keep this as best-effort and do not fail the process if it can't run.
      // @ts-ignore
      const res = await sb.rpc('sql', { q: sql })
      return res
    } catch {
      // ignore
      return null
    }
  })()
  try {
    syncAwait(createPromise)
  } catch {
    // swallow any error — table creation should be performed via migrations for production
  }
}

export function addLeaderboardEntrySync(
  playerName: string,
  score: number,
  totalQuestions: number,
  totalTimeMs: number
): number {
  const sb = getDbSync()
  const averageTimeMs = totalTimeMs / totalQuestions

  const p = (async () => {
    const { data, error } = await sb
      .from('leaderboard')
      .insert({
        player_name: playerName,
        score,
        total_questions: totalQuestions,
        total_time_ms: totalTimeMs,
        average_time_ms: averageTimeMs
      })
      .select('id')
      .single()
    if (error) throw error
    return (data as any).id as number
  })()

  return syncAwait(p)
}

export function getLeaderboardSync(limit = 10): LeaderboardEntry[] {
  const sb = getDbSync()

  const p = (async () => {
    const { data, error } = await sb
      .from('leaderboard')
      .select('id, player_name, score, total_questions, total_time_ms, average_time_ms, created_at')
      .order('score', { ascending: false })
      .order('average_time_ms', { ascending: true })
      .limit(limit)
    if (error) throw error
    return data as LeaderboardEntry[]
  })()

  return syncAwait(p)
}

export function getEntryByIdSync(id: number): LeaderboardEntry | undefined {
  const sb = getDbSync()

  const p = (async () => {
    const { data, error } = await sb
      .from('leaderboard')
      .select('id, player_name, score, total_questions, total_time_ms, average_time_ms, created_at')
      .eq('id', id)
      .single()
    if (error) {
      // normalize "not found" to undefined
      const code = (error as any).code
      const notFoundCodes = ['PGRST116', 'PGRST117']
      if (notFoundCodes.includes(code)) return undefined
      throw error
    }
    return data as LeaderboardEntry | undefined
  })()

  return syncAwait(p)
}

