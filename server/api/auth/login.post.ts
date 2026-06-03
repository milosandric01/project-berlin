export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const session = await getUserSession(event)
  await session.update({ userId: user.id, email: user.email })

  return { user: { id: user.id, email: user.email } }
})
