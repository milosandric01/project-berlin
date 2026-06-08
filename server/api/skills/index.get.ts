import { asc } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  const db = useDb()
  return db.select().from(schema.skills).orderBy(asc(schema.skills.category), asc(schema.skills.name))
})
