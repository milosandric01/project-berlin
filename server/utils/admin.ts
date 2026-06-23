import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

/**
 * Assert the current user is an admin. Throws 401/403 otherwise.
 */
export async function requireAdmin(event: H3Event): Promise<number> {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const db = useDb()
  const [user] = await db
    .select({ isAdmin: schema.users.isAdmin })
    .from(schema.users)
    .where(eq(schema.users.id, session.data.userId))
    .limit(1)

  if (!user?.isAdmin) {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }

  return session.data.userId
}
