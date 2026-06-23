import { eq, count } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { requireAdmin } from '~~/server/utils/admin'
import { invalidateTopicCache } from '~~/server/utils/topics'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

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

  // If queue table is empty, initialize it with all current topics as published
  const [{ total }] = await db.select({ total: count() }).from(schema.topicQueue)
  if (total === 0) {
    const topicsDir = join(process.cwd(), 'server', 'content', 'topics')
    const files = readdirSync(topicsDir).filter(f => f.endsWith('.md')).sort()
    for (let i = 0; i < files.length; i++) {
      const raw = readFileSync(join(topicsDir, files[i]), 'utf8')
      const { data } = matter(raw)
      const base = files[i].replace(/\.md$/, '')
      const orderMatch = base.match(/^(\d+)[-_](.+)$/)
      const fileSlug = String(data.slug ?? (orderMatch ? orderMatch[2] : base))
      await db.insert(schema.topicQueue).values({
        slug: fileSlug,
        position: i + 1,
        published: true,
      })
    }
  }

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
