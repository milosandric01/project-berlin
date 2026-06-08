import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const db = useDb()
  const normalised = email.toLowerCase().trim()

  const existing = await db.select().from(schema.users).where(eq(schema.users.email, normalised)).limit(1)
  if (existing.length > 0) {
    throw createError({ statusCode: 409, message: 'User already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const [user] = await db.insert(schema.users).values({ email: normalised, passwordHash }).returning()

  const session = await getUserSession(event)
  await session.update({ userId: user!.id, email: user!.email })

  return { user: { id: user!.id, email: user!.email } }
})
