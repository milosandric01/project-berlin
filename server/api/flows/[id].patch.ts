import { and, eq, ne } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId
  const flowId = Number(getRouterParam(event, 'id'))

  const body = await readBody(event)
  const db = useDb()

  // Verify ownership
  const [flow] = await db
    .select()
    .from(schema.flows)
    .where(and(eq(schema.flows.id, flowId), eq(schema.flows.userId, userId)))
    .limit(1)

  if (!flow) {
    throw createError({ statusCode: 404, message: 'Flow not found' })
  }

  // If setting active, deactivate all other flows for this user first
  if (body.isActive === true) {
    await db
      .update(schema.flows)
      .set({ isActive: false })
      .where(and(eq(schema.flows.userId, userId), ne(schema.flows.id, flowId)))
  }

  const [updated] = await db
    .update(schema.flows)
    .set({
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.name !== undefined && { name: body.name }),
    })
    .where(eq(schema.flows.id, flowId))
    .returning()

  return updated
})
