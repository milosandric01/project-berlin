import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { requireAdmin } from '~~/server/utils/admin'
import { invalidateTopicCache } from '~~/server/utils/topics'

/**
 * PATCH /api/admin/topics/:slug
 * Update a topic's published status or position.
 * Body: { published?: boolean, position?: number }
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'Missing slug' })

  const body = await readBody<{ published?: boolean; position?: number }>(event)
  const db = useDb()

  // Upsert into topic_queue
  const [existing] = await db
    .select()
    .from(schema.topicQueue)
    .where(eq(schema.topicQueue.slug, slug))
    .limit(1)

  if (existing) {
    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (body.published !== undefined) updates.published = body.published
    if (body.position !== undefined) updates.position = body.position

    await db
      .update(schema.topicQueue)
      .set(updates)
      .where(eq(schema.topicQueue.slug, slug))
  }
  else {
    await db.insert(schema.topicQueue).values({
      slug,
      published: body.published ?? false,
      position: body.position ?? 0,
    })
  }

  invalidateTopicCache()
  return { ok: true }
})
