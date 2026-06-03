export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  if (findUserByEmail(email)) {
    throw createError({ statusCode: 409, message: 'User already exists' })
  }

  const user = createUser(email, password)

  const session = await getUserSession(event)
  await session.update({ userId: user.id, email: user.email })

  return { user }
})
