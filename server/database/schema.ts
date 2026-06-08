import { boolean, index, integer, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => ({
    emailIdx: uniqueIndex('users_email_idx').on(t.email),
  }),
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const skills = pgTable(
  'skills',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    category: text('category').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => ({
    slugIdx: uniqueIndex('skills_slug_idx').on(t.slug),
    categoryIdx: index('skills_category_idx').on(t.category),
  }),
)

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert

export const flows = pgTable(
  'flows',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    predefinedKey: text('predefined_key'),
    isActive: boolean('is_active').notNull().default(false),
    totalQuestions: integer('total_questions').notNull().default(0),
    lastPracticedAt: timestamp('last_practiced_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => ({
    userIdx: index('flows_user_idx').on(t.userId),
    userActiveIdx: index('flows_user_active_idx').on(t.userId, t.isActive),
  }),
)

export type Flow = typeof flows.$inferSelect
export type NewFlow = typeof flows.$inferInsert

export const flowSkills = pgTable(
  'flow_skills',
  {
    id: serial('id').primaryKey(),
    flowId: integer('flow_id').notNull().references(() => flows.id, { onDelete: 'cascade' }),
    skillId: integer('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  },
  t => ({
    uniqIdx: uniqueIndex('flow_skills_flow_skill_idx').on(t.flowId, t.skillId),
    flowIdx: index('flow_skills_flow_idx').on(t.flowId),
  }),
)

export type FlowSkill = typeof flowSkills.$inferSelect

export const sessions = pgTable(
  'sessions',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    flowId: integer('flow_id').references(() => flows.id, { onDelete: 'set null' }),
    flowName: text('flow_name').notNull(),
    questionsAnswered: integer('questions_answered').notNull().default(0),
    goalQuestions: integer('goal_questions').notNull(),
    difficulty: text('difficulty').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  t => ({
    userIdx: index('sessions_user_idx').on(t.userId),
    userStartedIdx: index('sessions_user_started_idx').on(t.userId, t.startedAt),
  }),
)

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export const dailyStates = pgTable(
  'daily_states',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    flowId: integer('flow_id').references(() => flows.id, { onDelete: 'set null' }),
    date: text('date').notNull(),
    goalQuestions: integer('goal_questions').notNull().default(5),
    questionsAnswered: integer('questions_answered').notNull().default(0),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  t => ({
    userIdx: uniqueIndex('daily_states_user_idx').on(t.userId),
  }),
)

export type DailyState = typeof dailyStates.$inferSelect
export type NewDailyState = typeof dailyStates.$inferInsert
