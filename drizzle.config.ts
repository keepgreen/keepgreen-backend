import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dbCredentials: {
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASS,
    host: process.env.MARIADB_HOST,
    database: process.env.MARIADB_BASE,
  },
  driver: 'mysql2',
} satisfies Config;
