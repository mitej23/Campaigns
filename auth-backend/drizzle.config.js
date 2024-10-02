import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.js",
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DB_PATH
  },
  verbose: true,
  strict: true,
  migration: {
    table: "migrations",
    schema: "public"
  }
})