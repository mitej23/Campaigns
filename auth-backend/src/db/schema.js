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

// emails attached using aws ses
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
  status: text('status').notNull(), // Unpublished | published
  automationFlowEditorData: text('automation_flow_editor_data'),
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

export const emailQueue = pgTable('email_queue', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  emailId: uuid('email_id').notNull().references(() => emails.id),
  scheduledTime: timestamp('scheduled_time').notNull(),
  status: text('status').notNull(), // pending
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

export const sentEmails = pgTable('sent_emails', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id),
  emailId: uuid('email_id').notNull().references(() => emails.id),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  fromEmail: varchar('from_email', 255).notNull(),
  toEmail: varchar('to_email', 255).notNull(),
  subject: text('subject').notNull(),
  processedContent: text('processed_content').notNull(),
  sentAt: timestamp('sent_at').defaultNow(),
  status: text('status').notNull(), // 'sent' | 'failed'
  failureReason: text('failure_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    campaignContactIdx: uniqueIndex('campaign_contact_idx').on(table.campaignId, table.contactId, table.emailId),
  }
});

// Relations

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  emailAccounts: many(emailAccounts),
  contacts: many(contacts),
  campaigns: many(campaigns),
  emailTemplates: many(emailTemplates),
}));

export const emailAccountsRelations = relations(emailAccounts, ({ one }) => ({
  user: one(users, {
    fields: [emailAccounts.userId],
    references: [users.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, {
    fields: [contacts.usersId],
    references: [users.id],
  }),
  campaignContacts: many(campaignContact)
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  emailAccount: one(emailAccounts, {
    fields: [campaigns.emailAccountsId],
    references: [emailAccounts.id],
  }),
  emails: many(emails),
  campaignContacts: many(campaignContact),
  // emailQueue: many(emailQueue),
  // emailSendQueue: many(emailSendQueue),
  // emailOpens: many(emailOpens)
}));

export const campaignContactRelations = relations(campaignContact, ({ one }) => ({
  contact: one(contacts, {
    fields: [campaignContact.contactId],
    references: [contacts.id],
  }),
  campaign: one(campaigns, {
    fields: [campaignContact.campaignId],
    references: [campaigns.id],
  }),
  user: one(users, {
    fields: [campaignContact.userId],
    references: [users.id],
  })
}));

export const emailTemplatesRelations = relations(emailTemplates, ({ one }) => ({
  user: one(users, {
    fields: [emailTemplates.userId],
    references: [users.id],
  }),
}));

// Email Relations

export const emailsRelations = relations(emails, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [emails.campaignId],
    references: [campaigns.id],
  }),
  template: one(emailTemplates, {
    fields: [emails.templateId],
    references: [emailTemplates.id],
  }),
  parentEmail: one(emails, {
    fields: [emails.parentEmailId],
    references: [emails.id],
  }),
  emailConditions: many(emailConditions, { relationName: 'emailConditions' }),
  emailQueue: many(emailQueue),
  emailSendQueue: many(emailSendQueue),
  emailOpens: many(emailOpens)
}));

export const emailQueueRelations = relations(emailQueue, ({ one }) => ({
  contact: one(contacts, {
    fields: [emailQueue.contactId],
    references: [contacts.id],
  }),
  email: one(emails, {
    fields: [emailQueue.emailId],
    references: [emails.id],
  }),
}));

export const emailConditionsRelations = relations(emailConditions, ({ one }) => ({
  email: one(emails, {
    fields: [emailConditions.emailId],
    references: [emails.id],
    relationName: 'emailConditions'
  }),
  trueEmail: one(emails, {
    fields: [emailConditions.trueEmailId],
    references: [emails.id],
    relationName: 'trueEmail'
  }),
  falseEmail: one(emails, {
    fields: [emailConditions.falseEmailId],
    references: [emails.id],
    relationName: 'falseEmail'
  }),
}));

export const emailSendQueueRelations = relations(emailSendQueue, ({ one }) => ({
  contact: one(contacts, {
    fields: [emailSendQueue.contactId],
    references: [contacts.id],
  }),
  email: one(emails, {
    fields: [emailSendQueue.emailId],
    references: [emails.id],
  })
}));

export const emailOpensRelations = relations(emailOpens, ({ one }) => ({
  contact: one(contacts, {
    fields: [emailOpens.contactId],
    references: [contacts.id],
  }),
  email: one(emails, {
    fields: [emailOpens.emailId],
    references: [emails.id],
  })
}));

export const sentEmailsRelations = relations(sentEmails, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [sentEmails.campaignId],
    references: [campaigns.id],
  }),
  contact: one(contacts, {
    fields: [sentEmails.contactId],
    references: [contacts.id],
  }),
  originalEmail: one(emails, {
    fields: [sentEmails.emailId],
    references: [emails.id],
  })
}));