import { and, eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId
  const sessionId = Number(getRouterParam(event, 'id'))

  const body = await readBody(event)
  const { questionsAnswered, completed } = body as {
    questionsAnswered?: number
    completed?: boolean
  }

  const db = useDb()

  const [existing] = await db
    .select()
    .from(schema.sessions)
    .where(and(eq(schema.sessions.id, sessionId), eq(schema.sessions.userId, userId)))
    .limit(1)

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Session not found' })
  }

  const [updated] = await db
    .update(schema.sessions)
    .set({
      ...(questionsAnswered !== undefined && { questionsAnswered }),
      lastActivityAt: new Date(),
      ...(completed && { completedAt: new Date() }),
    })
    .where(eq(schema.sessions.id, sessionId))
    .returning()

  return updated
})
