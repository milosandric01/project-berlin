import { and, eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId
  const flowId = Number(getRouterParam(event, 'id'))

  const db = useDb()

  const [flow] = await db
    .select()
    .from(schema.flows)
    .where(and(eq(schema.flows.id, flowId), eq(schema.flows.userId, userId)))
    .limit(1)

  if (!flow) {
    throw createError({ statusCode: 404, message: 'Flow not found' })
  }

  await db.delete(schema.flows).where(eq(schema.flows.id, flowId))

  return { ok: true }
})
