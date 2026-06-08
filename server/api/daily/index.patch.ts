import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const body = await readBody(event) as {
    flowId?: number | null
    goalQuestions?: number
    questionsAnswered?: number
    completedAt?: string | null
  }

  const db = useDb()
  const today = new Date().toISOString().slice(0, 10)

  const updates: Record<string, unknown> = { date: today }
  if ('flowId' in body) updates.flowId = body.flowId ?? null
  if (body.goalQuestions !== undefined) updates.goalQuestions = body.goalQuestions
  if (body.questionsAnswered !== undefined) updates.questionsAnswered = body.questionsAnswered
  if ('completedAt' in body) updates.completedAt = body.completedAt ? new Date(body.completedAt) : null

  const [existing] = await db
    .select({ id: schema.dailyStates.id })
    .from(schema.dailyStates)
    .where(eq(schema.dailyStates.userId, userId))
    .limit(1)

  if (!existing) {
    const [created] = await db
      .insert(schema.dailyStates)
      .values({ userId, date: today, ...(updates as Parameters<typeof db.insert>[0]) })
      .returning()
    return created
  }

  const [updated] = await db
    .update(schema.dailyStates)
    .set(updates)
    .where(eq(schema.dailyStates.userId, userId))
    .returning()

  return updated
})
