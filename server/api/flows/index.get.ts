import { and, eq, inArray, isNull } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { PREDEFINED_FLOWS } from '~~/server/utils/predefinedFlows'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const db = useDb()

  // Custom flows only (no predefinedKey)
  const customFlows = await db
    .select()
    .from(schema.flows)
    .where(and(eq(schema.flows.userId, userId), isNull(schema.flows.predefinedKey)))
    .orderBy(schema.flows.createdAt)

  // Platform flow DB records (have a predefinedKey)
  const platformRecords = await db
    .select()
    .from(schema.flows)
    .where(and(eq(schema.flows.userId, userId)))
    .then(rows => rows.filter(r => r.predefinedKey !== null))

  // Skills for custom flows
  const customIds = customFlows.map(f => f.id)
  const platformIds = platformRecords.map(f => f.id)
  const allIds = [...customIds, ...platformIds]

  const allFlowSkills = allIds.length
    ? await db
        .select({ flowId: schema.flowSkills.flowId, skill: schema.skills })
        .from(schema.flowSkills)
        .innerJoin(schema.skills, eq(schema.flowSkills.skillId, schema.skills.id))
        .where(inArray(schema.flowSkills.flowId, allIds))
    : []

  const skillsByFlow = allFlowSkills.reduce<Record<number, typeof schema.skills.$inferSelect[]>>(
    (acc, row) => { (acc[row.flowId] ??= []).push(row.skill); return acc },
    {},
  )

  // Enrich platform flows with user-specific data (progress, active state)
  const platformFlows = PREDEFINED_FLOWS.map((p) => {
    const record = platformRecords.find(r => r.predefinedKey === p.key)
    return {
      key: p.key,
      name: p.name,
      skillSlugs: p.skillSlugs,
      dbId: record?.id ?? null,
      isActive: record?.isActive ?? false,
      totalQuestions: record?.totalQuestions ?? 0,
      lastPracticedAt: record?.lastPracticedAt ?? null,
      skills: record ? (skillsByFlow[record.id] ?? []) : [],
    }
  })

  return {
    customFlows: customFlows.map(f => ({ ...f, skills: skillsByFlow[f.id] ?? [] })),
    platformFlows,
  }
})
