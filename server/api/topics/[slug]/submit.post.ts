import { and, eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { resolveDaily } from '~~/server/utils/topics'

/**
 * Grade the multiple-choice answers for a topic and record the result. The day
 * completes only when both the article is read AND the questions are answered.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'Missing topic slug' })

  const body = await readBody<{ answers?: unknown }>(event)
  const answers = Array.isArray(body?.answers) ? body.answers.map(a => Number(a)) : []

  const daily = await resolveDaily(userId)
  const topic = daily.topics.find(t => t.slug === slug)
  if (!topic) throw createError({ statusCode: 404, message: 'Topic not found' })

  // Lock: a different topic was already completed today.
  if (daily.completedTodaySlug && daily.completedTodaySlug !== slug) {
    throw createError({ statusCode: 423, message: 'Today\'s topic is already complete. Come back tomorrow.' })
  }
  // Can only act on the current topic in the queue.
  if (daily.current?.slug !== slug) {
    throw createError({ statusCode: 409, message: 'This is not your current topic.' })
  }

  // Grade.
  const results = topic.questions.map((q, i) => {
    const selected = Number.isInteger(answers[i]) ? answers[i] : -1
    const correct = selected === q.answer
    return { index: i, selected, correctIndex: q.answer, correct, explanation: q.explanation }
  })
  const correctCount = results.filter(r => r.correct).length
  const total = topic.questions.length

  const db = useDb()
  const now = new Date()
  const existing = daily.progressBySlug.get(slug)

  // Determine if completing both parts: article read + questions done
  const articleAlreadyRead = existing ? existing.articleRead : false
  const shouldComplete = articleAlreadyRead && !existing?.completedAt

  if (existing) {
    await db
      .update(schema.topicProgress)
      .set({
        questionsCorrect: correctCount,
        questionsTotal: total,
        completedAt: shouldComplete ? now : existing.completedAt,
        updatedAt: now,
      })
      .where(and(eq(schema.topicProgress.userId, userId), eq(schema.topicProgress.topicSlug, slug)))
  }
  else {
    await db.insert(schema.topicProgress).values({
      userId,
      topicSlug: slug,
      questionsCorrect: correctCount,
      questionsTotal: total,
      updatedAt: now,
    })
  }

  const after = await resolveDaily(userId)

  return {
    score: { correct: correctCount, total },
    results,
    streak: after.streak,
    longestStreak: after.longestStreak,
    completedAt: (existing?.completedAt ?? now).toISOString?.() ?? now.toISOString(),
  }
})
