import { eq, inArray } from 'drizzle-orm'
import { schema } from '~~/server/utils/db'
import { PREDEFINED_FLOWS } from '~~/server/utils/predefinedFlows'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data?.userId) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  const userId: number = session.data.userId

  const body = await readBody(event)
  const { name, skillIds, predefinedKey, isActive } = body as {
    name?: string
    skillIds?: number[]
    predefinedKey?: string
    isActive?: boolean
  }

  const db = useDb()

  // Resolve skill IDs — either passed directly or derived from a predefined template
  let resolvedSkillIds: number[] = skillIds ?? []

  if (predefinedKey) {
    const template = PREDEFINED_FLOWS.find(p => p.key === predefinedKey)
    if (!template) {
      throw createError({ statusCode: 400, message: 'Unknown predefined flow key' })
    }
    const matched = await db
      .select({ id: schema.skills.id })
      .from(schema.skills)
      .where(inArray(schema.skills.slug, template.skillSlugs))
    resolvedSkillIds = matched.map(s => s.id)
  }

  if (!name?.trim()) {
    throw createError({ statusCode: 400, message: 'Flow name is required' })
  }
  if (resolvedSkillIds.length === 0) {
    throw createError({ statusCode: 400, message: 'At least one skill is required' })
  }

  // If setting active, deactivate all other flows first
  if (isActive) {
    await db.update(schema.flows).set({ isActive: false }).where(eq(schema.flows.userId, userId))
  }

  // Create the flow
  const [flow] = await db
    .insert(schema.flows)
    .values({ userId, name: name.trim(), predefinedKey: predefinedKey ?? null, isActive: isActive ?? false })
    .returning()

  // Attach skills
  await db.insert(schema.flowSkills).values(
    resolvedSkillIds.map(skillId => ({ flowId: flow!.id, skillId })),
  )

  // Return with skills populated
  const skills = await db
    .select({ skill: schema.skills })
    .from(schema.flowSkills)
    .innerJoin(schema.skills, eq(schema.flowSkills.skillId, schema.skills.id))
    .where(eq(schema.flowSkills.flowId, flow!.id))

  return { ...flow, skills: skills.map(r => r.skill) }
})
