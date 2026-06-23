import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '~~/server/database/schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

// Local Postgres typically has no TLS, while hosted providers (Supabase, etc.)
// require it. Only force SSL for non-local hosts so local dev works too.
function needsSsl(url: string): boolean {
  try {
    const host = new URL(url).hostname
    return !['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(host)
  }
  catch {
    return true
  }
}

export function useDb() {
  if (_db) return _db
  const url = useRuntimeConfig().databaseUrl
  const client = postgres(url, { max: 1, ssl: needsSsl(url) ? 'require' : false })
  _db = drizzle(client, { schema })
  return _db
}

export { schema }
