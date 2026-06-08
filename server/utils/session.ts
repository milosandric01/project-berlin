import type { H3Event } from 'h3'

export async function getUserSession(event: H3Event) {
  const session = await useSession(event, {
    password: useRuntimeConfig().sessionSecret,
  })
  return session
}
