import { marked } from 'marked'
import { eq, asc } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export interface TopicQuestion {
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export interface Topic {
  slug: string
  position: number
  title: string
  subtitle: string
  category: string
  readMinutes: number
  articleHtml: string
  questions: TopicQuestion[]
}

type TopicProgressRow = typeof schema.topicProgress.$inferSelect

let _cache: Topic[] | null = null

/** Clear the cached topics so changes (publish, reorder) are picked up. */
export function invalidateTopicCache(): void {
  _cache = null
}

/** Parse a JSON string of questions safely. */
function parseQuestions(raw: string): TopicQuestion[] {
  try {
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr.map((q: any) => ({
      prompt: String(q.prompt ?? ''),
      options: Array.isArray(q.options) ? q.options.map((o: any) => String(o)) : [],
      answer: Number(q.answer ?? 0),
      explanation: String(q.explanation ?? ''),
    }))
  }
  catch {
    return []
  }
}

/**
 * Load published topics from the database in queue order.
 * Cached after first load — call invalidateTopicCache() to refresh.
 */
export async function loadTopics(): Promise<Topic[]> {
  if (_cache) return _cache

  const db = useDb()

  const rows = await db
    .select()
    .from(schema.topicQueue)
    .where(eq(schema.topicQueue.published, true))
    .orderBy(asc(schema.topicQueue.position))

  const topics: Topic[] = rows.map((row, i) => ({
    slug: row.slug,
    position: i + 1,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category,
    readMinutes: row.readMinutes,
    articleHtml: marked.parse(row.articleMarkdown) as string,
    questions: parseQuestions(row.questions),
  }))

  _cache = topics
  return _cache
}

export async function getTopicBySlug(slug: string): Promise<Topic | undefined> {
  const topics = await loadTopics()
  return topics.find(t => t.slug === slug)
}

/** YYYY-MM-DD for a date, in UTC (matches the rest of the app's daily logic). */
export function dateStr(d: Date | string | null): string | null {
  if (!d) return null
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toISOString().slice(0, 10)
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Current streak = number of consecutive calendar days (ending today or
 * yesterday) on which the user completed a topic.
 */
export function computeStreak(completionDates: string[]): number {
  const days = new Set(completionDates)
  if (days.size === 0) return 0

  const today = todayStr()
  const yesterday = dateStr(new Date(Date.now() - 86_400_000))!

  // The streak is only "live" if there was activity today or yesterday.
  let cursor: string
  if (days.has(today)) cursor = today
  else if (days.has(yesterday)) cursor = yesterday
  else return 0

  let streak = 0
  while (days.has(cursor)) {
    streak += 1
    cursor = dateStr(new Date(new Date(cursor).getTime() - 86_400_000))!
  }
  return streak
}

export type DailyTopicState = 'available' | 'in_progress' | 'done_today' | 'queue_empty'

export interface ResolvedDaily {
  topics: Topic[]
  progressBySlug: Map<string, TopicProgressRow>
  current: Topic | null
  state: DailyTopicState
  streak: number
  longestStreak: number
  completedTodaySlug: string | null
  totalTopics: number
  position: number // 1-based queue index of the current topic, 0 if none
}

/**
 * Resolve the user's daily-queue state: which topic is "today's", whether the
 * day is already done (strict one-topic-per-day lock), and the streak.
 */
export async function resolveDaily(userId: number): Promise<ResolvedDaily> {
  const db = useDb()
  const topics = await loadTopics()

  const rows = await db
    .select()
    .from(schema.topicProgress)
    .where(eq(schema.topicProgress.userId, userId))

  const progressBySlug = new Map<string, TopicProgressRow>()
  for (const r of rows) progressBySlug.set(r.topicSlug, r)

  const completionDates = rows
    .map(r => dateStr(r.completedAt))
    .filter((d): d is string => d !== null)
  const streak = computeStreak(completionDates)
  const longestStreak = computeLongestStreak(completionDates)

  const today = todayStr()
  const completedTodayRow = rows.find(r => r.completedAt && dateStr(r.completedAt) === today)
  const inProgressRow = rows.find(r => !r.completedAt)

  let current: Topic | null = null
  let state: DailyTopicState

  if (!topics.length) {
    state = 'queue_empty'
  }
  else if (completedTodayRow) {
    // Strict daily lock: the user already finished a topic today.
    current = topics.find(t => t.slug === completedTodayRow.topicSlug) ?? null
    state = 'done_today'
  }
  else if (inProgressRow) {
    current = topics.find(t => t.slug === inProgressRow.topicSlug) ?? null
    state = current ? 'in_progress' : 'available'
    if (!current) current = topics.find(t => !progressBySlug.get(t.slug)?.completedAt) ?? null
  }
  else {
    current = topics.find(t => !progressBySlug.get(t.slug)?.completedAt) ?? null
    state = current ? 'available' : 'queue_empty'
  }

  return {
    topics,
    progressBySlug,
    current,
    state,
    streak,
    longestStreak,
    completedTodaySlug: completedTodayRow?.topicSlug ?? null,
    totalTopics: topics.length,
    position: current ? topics.findIndex(t => t.slug === current!.slug) + 1 : 0,
  }
}

function computeLongestStreak(completionDates: string[]): number {
  const days = [...new Set(completionDates)].sort()
  let longest = 0
  let run = 0
  let prev: string | null = null
  for (const day of days) {
    if (prev && dateStr(new Date(new Date(prev).getTime() + 86_400_000)) === day) {
      run += 1
    }
    else {
      run = 1
    }
    if (run > longest) longest = run
    prev = day
  }
  return longest
}
