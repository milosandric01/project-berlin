import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { computeStreak, todayStr, dateStr } from '~~/server/utils/topics'

/**
 * Returns detailed streak stats for the streak/levels page:
 * - current streak, longest streak
 * - total topics completed
 * - completion dates (for the calendar heatmap)
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const db = useDb()
  const rows = await db
    .select({
      topicSlug: schema.topicProgress.topicSlug,
      completedAt: schema.topicProgress.completedAt,
      questionsCorrect: schema.topicProgress.questionsCorrect,
      questionsTotal: schema.topicProgress.questionsTotal,
    })
    .from(schema.topicProgress)
    .where(eq(schema.topicProgress.userId, userId))

  const completionDates = rows
    .map(r => dateStr(r.completedAt))
    .filter((d): d is string => d !== null)

  const streak = computeStreak(completionDates)
  const longestStreak = computeLongestStreak(completionDates)
  const totalCompleted = completionDates.length
  const totalCorrect = rows.reduce((s, r) => s + (r.questionsCorrect ?? 0), 0)
  const totalQuestions = rows.reduce((s, r) => s + (r.questionsTotal ?? 0), 0)

  // Build calendar data: map of date -> { completed: true, correct, total }
  const calendar: Record<string, { correct: number; total: number }> = {}
  for (const r of rows) {
    const d = dateStr(r.completedAt)
    if (d) calendar[d] = { correct: r.questionsCorrect ?? 0, total: r.questionsTotal ?? 0 }
  }

  return {
    streak,
    longestStreak,
    totalCompleted,
    totalCorrect,
    totalQuestions,
    calendar,
    today: todayStr(),
  }
})

function computeLongestStreak(completionDates: string[]): number {
  const days = [...new Set(completionDates)].sort()
  let longest = 0
  let run = 0
  let prev: string | null = null
  for (const day of days) {
    if (prev && dateStr(new Date(new Date(prev).getTime() + 86_400_000)) === day) {
      run += 1
    } else {
      run = 1
    }
    if (run > longest) longest = run
    prev = day
  }
  return longest
}
