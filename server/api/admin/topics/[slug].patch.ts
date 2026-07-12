import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { requireAdmin } from '~~/server/utils/admin'
import { invalidateTopicCache } from '~~/server/utils/topics'

/**
 * PATCH /api/admin/topics/:slug
 * Update a topic's content, published status, or position.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'Missing slug' })

  const body = await readBody<{
    title?: string
    subtitle?: string
    category?: string
    readMinutes?: number
    articleMarkdown?: string
    questions?: any[]
    published?: boolean
    position?: number
  }>(event)

  const db = useDb()

  const [existing] = await db
    .select()
    .from(schema.topicQueue)
    .where(eq(schema.topicQueue.slug, slug))
    .limit(1)

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Topic not found' })
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (body.title !== undefined) updates.title = body.title
  if (body.subtitle !== undefined) updates.subtitle = body.subtitle
  if (body.category !== undefined) updates.category = body.category
  if (body.readMinutes !== undefined) updates.readMinutes = body.readMinutes
  if (body.articleMarkdown !== undefined) updates.articleMarkdown = body.articleMarkdown
  if (body.questions !== undefined) updates.questions = JSON.stringify(body.questions)
  if (body.published !== undefined) updates.published = body.published
  if (body.position !== undefined) updates.position = body.position

  await db
    .update(schema.topicQueue)
    .set(updates)
    .where(eq(schema.topicQueue.slug, slug))

  invalidateTopicCache()
  return { ok: true }
})
