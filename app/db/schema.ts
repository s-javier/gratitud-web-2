import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const personTable = pgTable('person', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  // nickname: varchar('nickname', { length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  isActive: boolean('is_active').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const personTableRelations = relations(personTable, ({ many }) => ({
  sessions: many(sessionTable),
  organizationPersonRole: many(organizationPersonRoleTable),
  /* ▼ Propio del sistema */
  gratitude: many(gratitudeTable),
  tags: many(tagTable),
  /* ▲ Propio del sistema */
}))

export const sessionTable = pgTable('session', {
  id: uuid().defaultRandom().primaryKey(),
  personId: uuid('person_id')
    .references(() => personTable.id)
    .notNull(),
  isActive: boolean('is_active').notNull().default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  code: varchar({ length: 50 }).notNull(),
  codeIsActive: boolean('code_is_active').notNull().default(false),
  codeExpiresAt: timestamp('code_expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
  person: one(personTable, {
    fields: [sessionTable.personId],
    references: [personTable.id],
  }),
}))

export const roleTable = pgTable('role', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const roleTableRelations = relations(roleTable, ({ many }) => ({
  rolePermission: many(rolePermissionTable),
  organizationPersonRole: many(organizationPersonRoleTable),
}))

export const organizationTable = pgTable('organization', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 100 }).notNull().unique(),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const organizationTableRelations = relations(organizationTable, ({ many }) => ({
  organizationPersonRole: many(organizationPersonRoleTable),
}))

export const organizationPersonRoleTable = pgTable(
  'organization_person_role',
  {
    organizationId: uuid('organization_id')
      .references(() => organizationTable.id, { onDelete: 'cascade' })
      .notNull(),
    personId: uuid('person_id')
      .references(() => personTable.id, { onDelete: 'cascade' })
      .notNull(),
    roleId: uuid('role_id')
      .references(() => roleTable.id, { onDelete: 'cascade' })
      .notNull(),
    isSelected: boolean('is_selected').notNull().default(false),
    isVisible: boolean('is_visible').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.personId, t.roleId] })],
)

export const organizationPersonRoleTableRelations = relations(
  organizationPersonRoleTable,
  ({ one }) => ({
    organization: one(organizationTable, {
      fields: [organizationPersonRoleTable.organizationId],
      references: [organizationTable.id],
    }),
    person: one(personTable, {
      fields: [organizationPersonRoleTable.personId],
      references: [personTable.id],
    }),
    role: one(roleTable, {
      fields: [organizationPersonRoleTable.roleId],
      references: [roleTable.id],
    }),
  }),
)

export const permissionTypeEnum = pgEnum('permission_type', ['api', 'view'])

export const permissionTable = pgTable('permission', {
  id: uuid().defaultRandom().primaryKey(),
  path: varchar({ length: 100 }).notNull().unique(),
  type: permissionTypeEnum(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const permissionTableRelations = relations(permissionTable, ({ one, many }) => ({
  menuPage: one(menupageTable),
  rolePermission: many(rolePermissionTable),
}))

export const rolePermissionTable = pgTable(
  'role_permission',
  {
    roleId: uuid('role_id')
      .references(() => roleTable.id, { onDelete: 'cascade' })
      .notNull(),
    permissionId: uuid('permission_id')
      .references(() => permissionTable.id, { onDelete: 'cascade' })
      .notNull(),
    sort: integer(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
)

export const rolePermissionTableRelations = relations(rolePermissionTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [rolePermissionTable.roleId],
    references: [roleTable.id],
  }),
  permission: one(permissionTable, {
    fields: [rolePermissionTable.permissionId],
    references: [permissionTable.id],
  }),
}))

export const menupageTable = pgTable('menupage', {
  id: uuid().defaultRandom().primaryKey(),
  permissionId: uuid('permission_id')
    .references(() => permissionTable.id, { onDelete: 'set null' })
    .notNull(),
  title: varchar({ length: 50 }).notNull(),
  icon: varchar({ length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const menupageTableRelations = relations(menupageTable, ({ one }) => ({
  permission: one(permissionTable, {
    fields: [menupageTable.permissionId],
    references: [permissionTable.id],
  }),
}))

/**
 *************************************************************************************
 ************** ↑↑↑ Hasta aquí tablas básicas de admin para sistema ↑↑↑ **************
 *************************************************************************************
 */

export const gratitudeTable = pgTable('gratitude', {
  id: uuid().defaultRandom().primaryKey(),
  personId: uuid('person_id')
    .references(() => personTable.id)
    .notNull(),
  title: varchar({ length: 100 }),
  description: text().notNull(),
  isRemind: boolean('is_remind').default(false).notNull(),
  remindedAt: timestamp('reminded_at', { withTimezone: true }).$onUpdate(() => new Date()),
  isMaterialized: boolean('is_materialized').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const gratitudeTableRelations = relations(gratitudeTable, ({ one, many }) => ({
  person: one(personTable, {
    fields: [gratitudeTable.personId],
    references: [personTable.id],
  }),
  gratitudeTag: many(gratitudeTagTable),
}))

export const tagTable = pgTable('tag', {
  id: uuid().defaultRandom().primaryKey(),
  personId: uuid('person_id')
    .references(() => personTable.id)
    .notNull(),
  title: varchar({ length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const tagTableRelations = relations(tagTable, ({ one, many }) => ({
  person: one(personTable, {
    fields: [tagTable.personId],
    references: [personTable.id],
  }),
  gratitudeTag: many(gratitudeTagTable),
}))

export const gratitudeTagTable = pgTable(
  'gratitude_tag',
  {
    gratitudeId: uuid('gratitude_id')
      .references(() => gratitudeTable.id)
      .notNull(),
    tagId: uuid('tag_id')
      .references(() => tagTable.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.gratitudeId, t.tagId] })],
)

export const gratitudeTagTableRelations = relations(gratitudeTagTable, ({ one }) => ({
  gratitude: one(gratitudeTable, {
    fields: [gratitudeTagTable.gratitudeId],
    references: [gratitudeTable.id],
  }),
  tag: one(tagTable, {
    fields: [gratitudeTagTable.tagId],
    references: [tagTable.id],
  }),
}))
