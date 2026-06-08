import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const db = useDb()
  const [user] = await db
    .select({ id: schema.users.id, email: schema.users.email, firstName: schema.users.firstName, lastName: schema.users.lastName })
    .from(schema.users)
    .where(eq(schema.users.id, session.data.userId))
    .limit(1)
  return { user: user ?? null }
})
