import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { users } from './schema'

const SEED_USERS = [
  { email: 'kermit@hydracart.io', password: 'kermit' },
  { email: 'milosa942@gmail.com', password: 'password' },
]

async function main() {
  const url = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/berlin'
  const client = postgres(url, { max: 1 })
  const db = drizzle(client, { schema: { users } })

  for (const u of SEED_USERS) {
    const email = u.email.toLowerCase()
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) {
      console.log(`• skip ${email} (exists)`)
      continue
    }
    const passwordHash = await bcrypt.hash(u.password, 10)
    await db.insert(users).values({ email, passwordHash })
    console.log(`✓ created ${email}`)
  }

  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
