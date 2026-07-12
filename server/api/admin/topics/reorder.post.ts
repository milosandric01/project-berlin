import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { requireAdmin } from '~~/server/utils/admin'
import { invalidateTopicCache } from '~~/server/utils/topics'

/**
 * POST /api/admin/topics/reorder
 * Batch update topic positions.
 * Body: { order: { slug: string, position: number }[] }
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody<{ order: { slug: string; position: number }[] }>(event)
  if (!Array.isArray(body.order)) {
    throw createError({ statusCode: 400, message: 'Invalid body: expected order array' })
  }

  const db = useDb()

  for (const item of body.order) {
    await db
      .update(schema.topicQueue)
      .set({ position: item.position, updatedAt: new Date() })
      .where(eq(schema.topicQueue.slug, item.slug))
  }

  // Invalidate topic cache so new order is picked up
  invalidateTopicCache()

  return { ok: true }
})
