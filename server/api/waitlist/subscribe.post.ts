import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : ''

  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'Please enter a valid email address' })
  }

  const db = useDb()

  const existing = await db
    .select({ id: schema.waitlist.id })
    .from(schema.waitlist)
    .where(eq(schema.waitlist.email, email))
    .limit(1)

  if (existing.length > 0) {
    return { ok: true, alreadyJoined: true }
  }

  await db.insert(schema.waitlist).values({ email })

  return { ok: true, alreadyJoined: false }
})
