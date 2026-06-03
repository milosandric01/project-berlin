import type { H3Event } from 'h3'

export interface User {
  id: number
  email: string
  password: string
}

// Simple in-memory user store (replace with a database in production)
const users: User[] = []
let nextId = 1

export function findUserByEmail(email: string) {
  return users.find(u => u.email === email)
}

export function createUser(email: string, password: string): Omit<User, 'password'> {
  const user = { id: nextId++, email, password }
  users.push(user)
  return { id: user.id, email: user.email }
}

export async function getUserSession(event: H3Event) {
  const session = await useSession(event, {
    password: 'at-least-32-chars-long-secret-key-here!',
  })
  return session
}
