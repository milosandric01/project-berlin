import { count } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { requireAdmin } from '~~/server/utils/admin'
import { invalidateTopicCache } from '~~/server/utils/topics'

/**
 * POST /api/admin/topics
 * Create a new topic (draft by default).
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody<{
    slug: string
    title: string
    subtitle?: string
    category?: string
    readMinutes?: number
    articleMarkdown?: string
    questions?: any[]
    published?: boolean
  }>(event)

  if (!body.slug || !body.title) {
    throw createError({ statusCode: 400, message: 'slug and title are required' })
  }

  // Validate slug format
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
    throw createError({ statusCode: 400, message: 'slug must be lowercase alphanumeric with hyphens' })
  }

  const db = useDb()

  // Get next position
  const [{ total }] = await db.select({ total: count() }).from(schema.topicQueue)
  const position = total + 1

  await db.insert(schema.topicQueue).values({
    slug: body.slug,
    title: body.title,
    subtitle: body.subtitle ?? '',
    category: body.category ?? 'General',
    readMinutes: body.readMinutes ?? 3,
    articleMarkdown: body.articleMarkdown ?? '',
    questions: JSON.stringify(body.questions ?? []),
    position,
    published: body.published ?? false,
  })

  invalidateTopicCache()
  return { ok: true }
})
