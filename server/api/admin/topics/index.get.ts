import { asc } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { requireAdmin } from '~~/server/utils/admin'

/**
 * GET /api/admin/topics
 * Returns all topics from the database with their content and publish status.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const db = useDb()
  const rows = await db
    .select()
    .from(schema.topicQueue)
    .orderBy(asc(schema.topicQueue.position))

  const topics = rows.map(r => ({
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    category: r.category,
    readMinutes: r.readMinutes,
    articleMarkdown: r.articleMarkdown,
    questionsCount: safeParseLength(r.questions),
    questions: safeParseQuestions(r.questions),
    published: r.published,
    position: r.position,
  }))

  // Sort: published first (by position), then unpublished (alphabetical)
  topics.sort((a, b) => {
    if (a.published && b.published) return a.position - b.position
    if (a.published) return -1
    if (b.published) return 1
    return a.slug.localeCompare(b.slug)
  })

  return { topics }
})

function safeParseLength(json: string): number {
  try {
    const arr = JSON.parse(json)
    return Array.isArray(arr) ? arr.length : 0
  }
  catch { return 0 }
}

function safeParseQuestions(json: string): any[] {
  try {
    const arr = JSON.parse(json)
    return Array.isArray(arr) ? arr : []
  }
  catch { return [] }
}
