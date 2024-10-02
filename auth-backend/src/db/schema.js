import { text, varchar, timestamp, uuid, pgTable } from 'drizzle-orm/pg-core';

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