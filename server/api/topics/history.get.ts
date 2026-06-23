import { eq, isNotNull, desc } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { loadTopics } from '~~/server/utils/topics'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const db = useDb()

  const rows = await db
    .select()
    .from(schema.topicProgress)
    .where(eq(schema.topicProgress.userId, userId))
    .orderBy(desc(schema.topicProgress.completedAt))

  const topics = await loadTopics()
  const topicMap = new Map(topics.map(t => [t.slug, t]))

  const completed = rows
    .filter(r => r.completedAt !== null)
    .map(r => {
      const topic = topicMap.get(r.topicSlug)
      return {
        slug: r.topicSlug,
        title: topic?.title ?? r.topicSlug,
        category: topic?.category ?? 'General',
        readMinutes: topic?.readMinutes ?? 0,
        questionsCorrect: r.questionsCorrect,
        questionsTotal: r.questionsTotal,
        completedAt: r.completedAt,
      }
    })

  return completed
})
