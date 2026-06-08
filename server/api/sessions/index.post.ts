import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const body = await readBody(event)
  const { flowId, flowName, goalQuestions, difficulty } = body as {
    flowId?: number | null
    flowName: string
    goalQuestions: number
    difficulty: string
  }

  if (!flowName?.trim() || !goalQuestions || !difficulty) {
    throw createError({ statusCode: 400, message: 'flowName, goalQuestions, and difficulty are required' })
  }

  const db = useDb()
  const [created] = await db
    .insert(schema.sessions)
    .values({ userId, flowId: flowId ?? null, flowName: flowName.trim(), goalQuestions, difficulty })
    .returning()

  return created
})
