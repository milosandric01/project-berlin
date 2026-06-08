import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const db = useDb()
  const today = new Date().toISOString().slice(0, 10)

  const [row] = await db
    .select()
    .from(schema.dailyStates)
    .where(eq(schema.dailyStates.userId, userId))
    .limit(1)

  const empty = { flowId: null, flowName: null, predefinedKey: null, skills: [], date: today, goalQuestions: 5, questionsAnswered: 0, completedAt: null }

  if (!row) return empty

  if (row.date !== today) {
    await db
      .update(schema.dailyStates)
      .set({ flowId: null, date: today, questionsAnswered: 0, completedAt: null })
      .where(eq(schema.dailyStates.userId, userId))
    return { ...empty, goalQuestions: row.goalQuestions }
  }

  if (!row.flowId) {
    return { flowId: null, flowName: null, predefinedKey: null, skills: [], date: row.date, goalQuestions: row.goalQuestions, questionsAnswered: row.questionsAnswered, completedAt: row.completedAt }
  }

  const [flow] = await db
    .select()
    .from(schema.flows)
    .where(eq(schema.flows.id, row.flowId))
    .limit(1)

  if (!flow) {
    await db.update(schema.dailyStates).set({ flowId: null }).where(eq(schema.dailyStates.userId, userId))
    return { ...empty, goalQuestions: row.goalQuestions }
  }

  const skills = await db
    .select({ id: schema.skills.id, name: schema.skills.name, slug: schema.skills.slug })
    .from(schema.flowSkills)
    .innerJoin(schema.skills, eq(schema.flowSkills.skillId, schema.skills.id))
    .where(eq(schema.flowSkills.flowId, row.flowId))

  return {
    flowId: row.flowId,
    flowName: flow.name,
    predefinedKey: flow.predefinedKey,
    skills,
    date: row.date,
    goalQuestions: row.goalQuestions,
    questionsAnswered: row.questionsAnswered,
    completedAt: row.completedAt,
  }
})
