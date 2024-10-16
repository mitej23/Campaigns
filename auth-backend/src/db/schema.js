import { text, varchar, timestamp, uuid, pgTable, integer, boolean, uniqueIndex } from 'drizzle-orm/pg-core';

// Define the User table schema
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', 255).notNull(),
  email: varchar('email', 255).notNull().unique(),
  password: text('password'),
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  // Add other fields necessary for JWT authentication if needed
});

export const emailAccounts = pgTable('email_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  emailId: text('email_id').notNull(),
  status: text('status').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userNameIdx: uniqueIndex('user_id_email_id_idx').on(table.userId, table.emailId),
  }
})

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  usersId: uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    contactUserEmailIdx: uniqueIndex('contact_user_email_idx').on(table.email, table.usersId)
  }
});

// each campaign should contain the email account i.e sender email id
export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  status: text('status').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  emailAccountsId: uuid('email_accounts_id').notNull().references(() => emailAccounts.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userNameIdx: uniqueIndex('user_id_campaign_name_idx').on(table.userId, table.name),
  }
});

export const campaignContact = pgTable('campaign_contact', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userNameIdx: uniqueIndex('user_template_name_idx').on(table.userId, table.name),
  }
});

export const emails = pgTable('emails', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id),
  templateId: uuid('template_id').notNull().references(() => emailTemplates.id),
  delayHours: integer('delay_hours').notNull(),
  parentEmailId: uuid('parent_email_id').references(() => emails.id),
  hasCondition: boolean('has_condition').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const emailQueue = pgTable('email_queue', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  emailId: uuid('email_id').notNull().references(() => emails.id),
  scheduledTime: timestamp('scheduled_time').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const emailConditions = pgTable('email_conditions', {
  id: uuid('id').defaultRandom().primaryKey(),
  emailId: uuid('email_id').notNull().references(() => emails.id),
  conditionType: text('condition_type').notNull(),
  trueEmailId: uuid('true_email_id').references(() => emails.id),
  falseEmailId: uuid('false_email_id').references(() => emails.id),
  trueDelayHours: integer('true_delay_hours'),
  falseDelayHours: integer('false_delay_hours'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Email Send Queue Table
export const emailSendQueue = pgTable('email_send_queue', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  emailId: uuid('email_id').notNull().references(() => emails.id),
  sendTime: timestamp('send_time').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Email Opens Table
export const emailOpens = pgTable('email_opens', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  emailId: uuid('email_id').notNull().references(() => emails.id),
  openedAt: timestamp('opened_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});