import { desc, eq, sql } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const db = useDb()

  const rows = await db
    .select({
      id: schema.sessions.id,
      flowId: schema.sessions.flowId,
      flowName: schema.sessions.flowName,
      predefinedKey: sql<string | null>`${schema.flows.predefinedKey}`.as('predefined_key'),
      questionsAnswered: schema.sessions.questionsAnswered,
      goalQuestions: schema.sessions.goalQuestions,
      difficulty: schema.sessions.difficulty,
      startedAt: schema.sessions.startedAt,
      lastActivityAt: schema.sessions.lastActivityAt,
      completedAt: schema.sessions.completedAt,
    })
    .from(schema.sessions)
    .leftJoin(schema.flows, eq(schema.sessions.flowId, schema.flows.id))
    .where(eq(schema.sessions.userId, userId))
    .orderBy(desc(schema.sessions.startedAt))
    .limit(10)

  return rows
})
