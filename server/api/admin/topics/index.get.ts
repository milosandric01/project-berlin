import { eq, asc } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { requireAdmin } from '~~/server/utils/admin'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

/**
 * GET /api/admin/topics
 * Returns all .md topic files with their publish/order status from the DB.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  // Load all topic files from disk
  const topicsDir = join(process.cwd(), 'server', 'content', 'topics')
  let files: string[] = []
  try {
    files = readdirSync(topicsDir).filter(f => f.endsWith('.md')).sort()
  }
  catch {
    files = []
  }

  const allTopics = files.map((file) => {
    const raw = readFileSync(join(topicsDir, file), 'utf8')
    const { data } = matter(raw)
    const base = file.replace(/\.md$/, '')
    const orderMatch = base.match(/^(\d+)[-_](.+)$/)
    const slug = String(data.slug ?? (orderMatch ? orderMatch[2] : base))

    const questions = Array.isArray(data.questions)
      ? data.questions.map((q: any) => ({
          prompt: String(q.prompt ?? ''),
          options: Array.isArray(q.options) ? q.options.map((o: any) => String(o)) : [],
          answer: Number(q.answer ?? 0),
          explanation: String(q.explanation ?? ''),
        }))
      : []

    return {
      slug,
      file,
      title: String(data.title ?? slug),
      subtitle: String(data.subtitle ?? ''),
      category: String(data.category ?? 'General'),
      readMinutes: Number(data.readMinutes ?? 3),
      questionsCount: questions.length,
      questions,
    }
  })

  // Get queue state from DB
  const db = useDb()
  const queueRows = await db
    .select()
    .from(schema.topicQueue)
    .orderBy(asc(schema.topicQueue.position))

  const queueMap = new Map(queueRows.map(r => [r.slug, r]))

  // Merge file data with queue state
  const result = allTopics.map((t) => {
    const q = queueMap.get(t.slug)
    return {
      ...t,
      published: q?.published ?? false,
      position: q?.position ?? null,
    }
  })

  // Sort: published first (by position), then unpublished (alphabetical)
  result.sort((a, b) => {
    if (a.published && b.published) return (a.position ?? 0) - (b.position ?? 0)
    if (a.published) return -1
    if (b.published) return 1
    return a.slug.localeCompare(b.slug)
  })

  return { topics: result }
})
