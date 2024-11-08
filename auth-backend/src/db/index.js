import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DB_PATH)
export const db = drizzle(queryClient, { schema });