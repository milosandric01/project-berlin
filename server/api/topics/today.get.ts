import { resolveDaily, dateStr } from '~~/server/utils/topics'

/**
 * Returns the user's current daily topic, their progress, the streak, and
 * whether the day is already done (strict one-topic-per-day lock).
 *
 * Correct answers/explanations are only included when the topic is already
 * completed (review mode) — never up front, so they can't be peeked at.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const daily = await resolveDaily(userId)

  const base = {
    state: daily.state,
    streak: daily.streak,
    longestStreak: daily.longestStreak,
    position: daily.position,
    totalTopics: daily.totalTopics,
  }

  if (!daily.current) {
    return { ...base, topic: null, progress: null, reveal: false, nextUnlocksAt: null }
  }

  const t = daily.current
  const progressRow = daily.progressBySlug.get(t.slug) ?? null
  const reveal = daily.state === 'done_today'

  const nextUnlocksAt = daily.state === 'done_today'
    ? new Date(new Date(`${dateStr(new Date())}T00:00:00.000Z`).getTime() + 86_400_000).toISOString()
    : null

  return {
    ...base,
    reveal,
    nextUnlocksAt,
    topic: {
      slug: t.slug,
      title: t.title,
      subtitle: t.subtitle,
      category: t.category,
      readMinutes: t.readMinutes,
      articleHtml: t.articleHtml,
      questions: t.questions.map(q => ({
        prompt: q.prompt,
        options: q.options,
        ...(reveal ? { answer: q.answer, explanation: q.explanation } : {}),
      })),
    },
    progress: progressRow
      ? {
          articleRead: progressRow.articleRead,
          questionsCorrect: progressRow.questionsCorrect,
          questionsTotal: progressRow.questionsTotal,
          completedAt: progressRow.completedAt,
        }
      : null,
  }
})
