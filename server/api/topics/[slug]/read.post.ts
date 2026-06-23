import { and, eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { resolveDaily } from '~~/server/utils/topics'

/**
 * Mark the current topic's article as read. The day completes only when both
 * the article is read AND the questions are answered.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'Missing topic slug' })

  const daily = await resolveDaily(userId)
  const topic = daily.topics.find(t => t.slug === slug)
  if (!topic) throw createError({ statusCode: 404, message: 'Topic not found' })

  if (daily.completedTodaySlug && daily.completedTodaySlug !== slug) {
    throw createError({ statusCode: 423, message: 'Today\'s topic is already complete. Come back tomorrow.' })
  }
  if (daily.current?.slug !== slug) {
    throw createError({ statusCode: 409, message: 'This is not your current topic.' })
  }

  const db = useDb()
  const now = new Date()
  const existing = daily.progressBySlug.get(slug)

  // Determine if completing both parts: article read + questions done
  const questionsAlreadyDone = existing ? existing.questionsTotal > 0 : false
  const shouldComplete = questionsAlreadyDone && !existing?.completedAt

  if (existing) {
    await db
      .update(schema.topicProgress)
      .set({ articleRead: true, completedAt: shouldComplete ? now : existing.completedAt, updatedAt: now })
      .where(and(eq(schema.topicProgress.userId, userId), eq(schema.topicProgress.topicSlug, slug)))
  }
  else {
    await db.insert(schema.topicProgress).values({
      userId,
      topicSlug: slug,
      articleRead: true,
      updatedAt: now,
    })
  }

  const after = await resolveDaily(userId)
  return { streak: after.streak, longestStreak: after.longestStreak, state: after.state }
})
