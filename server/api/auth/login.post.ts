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

  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, normalised)).limit(1)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const session = await getUserSession(event)
  await session.update({ userId: user.id, email: user.email })

  return { user: { id: user.id, email: user.email } }
})
