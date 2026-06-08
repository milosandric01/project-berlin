import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { users, skills } from './schema'

const SEED_USERS = [
  { email: 'kermit@flowiz.dev', password: 'kermit', firstName: 'Kermit', lastName: 'Muppet' },
]

const SEED_SKILLS: { name: string; category: string }[] = [
  // Fundamentals
  { name: 'Networking',       category: 'Fundamentals' },
  { name: 'HTTP & APIs',      category: 'Fundamentals' },
  { name: 'Auth',             category: 'Fundamentals' },
  { name: 'Concurrency',      category: 'Fundamentals' },
  { name: 'Data structures',  category: 'Fundamentals' },
  // Frontend
  { name: 'HTML',                category: 'Frontend' },
  { name: 'CSS',                 category: 'Frontend' },
  { name: 'JavaScript',          category: 'Frontend' },
  { name: 'TypeScript',          category: 'Frontend' },
  { name: 'React',               category: 'Frontend' },
  { name: 'Vue',                 category: 'Frontend' },
  { name: 'State management',    category: 'Frontend' },
  { name: 'Forms',               category: 'Frontend' },
  { name: 'API integration',     category: 'Frontend' },
  { name: 'Performance',         category: 'Frontend' },
  { name: 'Accessibility',       category: 'Frontend' },
  { name: 'Browser behavior',    category: 'Frontend' },
  { name: 'Testing UI',          category: 'Frontend' },
  { name: 'Frontend security',   category: 'Frontend' },
  // Backend
  { name: 'APIs',               category: 'Backend' },
  { name: 'Databases',          category: 'Backend' },
  { name: 'Queues & Messaging', category: 'Backend' },
  { name: 'Caching',            category: 'Backend' },
  { name: 'Background jobs',    category: 'Backend' },
  { name: 'Integrations',       category: 'Backend' },
  // Systems
  { name: 'Scalability',   category: 'Systems' },
  { name: 'Reliability',   category: 'Systems' },
  { name: 'Observability', category: 'Systems' },
  { name: 'Latency',       category: 'Systems' },
  { name: 'Failure modes', category: 'Systems' },
  { name: 'Tradeoffs',     category: 'Systems' },
  // Code Quality
  { name: 'Testing',         category: 'Code Quality' },
  { name: 'Refactoring',     category: 'Code Quality' },
  { name: 'Code review',     category: 'Code Quality' },
  { name: 'Maintainability', category: 'Code Quality' },
  { name: 'Technical debt',  category: 'Code Quality' },
  // Cloud & DevOps
  { name: 'Deployments', category: 'Cloud & DevOps' },
  { name: 'CI/CD',       category: 'Cloud & DevOps' },
  { name: 'Containers',  category: 'Cloud & DevOps' },
  { name: 'AWS basics',  category: 'Cloud & DevOps' },
  { name: 'Monitoring',  category: 'Cloud & DevOps' },
  { name: 'Incidents',   category: 'Cloud & DevOps' },
  // Security
  { name: 'Authentication',  category: 'Security' },
  { name: 'Authorization',   category: 'Security' },
  { name: 'Secrets',         category: 'Security' },
  { name: 'Input validation', category: 'Security' },
  { name: 'OWASP',           category: 'Security' },
  { name: 'Data privacy',    category: 'Security' },
  // AI-era Engineering
  { name: 'Reviewing AI code',            category: 'AI-era Engineering' },
  { name: 'Prompting for implementation', category: 'AI-era Engineering' },
  { name: 'Validating outputs',           category: 'AI-era Engineering' },
  { name: 'AI debugging',                 category: 'AI-era Engineering' },
  // Communication
  { name: 'Explaining tradeoffs',    category: 'Communication' },
  { name: 'Incident updates',        category: 'Communication' },
  { name: 'Product conversations',   category: 'Communication' },
  { name: 'Mentoring',               category: 'Communication' },
  { name: 'Architecture proposals',  category: 'Communication' },
]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const url = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/berlin'
  const client = postgres(url, { max: 1 })
  const db = drizzle(client, { schema: { users, skills } })

  // Users
  console.log('\nUsers:')
  for (const u of SEED_USERS) {
    const email = u.email.toLowerCase()
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) {
      console.log(`  • skip ${email} (exists)`)
      continue
    }
    const passwordHash = await bcrypt.hash(u.password, 10)
    await db.insert(users).values({ email, passwordHash, firstName: u.firstName, lastName: u.lastName })
    console.log(`  ✓ created ${email}`)
  }

  // Skills
  console.log('\nSkills:')
  let created = 0
  let skipped = 0
  for (const s of SEED_SKILLS) {
    const slug = toSlug(s.name)
    const existing = await db.select().from(skills).where(eq(skills.slug, slug)).limit(1)
    if (existing.length > 0) {
      skipped++
      continue
    }
    await db.insert(skills).values({ name: s.name, slug, category: s.category })
    created++
  }
  console.log(`  ✓ ${created} created, ${skipped} skipped`)

  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
