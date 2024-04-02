import { createId } from '@paralleldrive/cuid2';
import { mysqlTable, varchar, timestamp, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 256 })
    .$defaultFn(() => createId())
    .primaryKey(),
  email: varchar('email', { length: 256 }).unique(),
  password: varchar('password', { length: 256 }),
  nickname: varchar('nickname', { length: 100 }),
  firstName: varchar('firstName', { length: 50 }),
  familyName: varchar('familyName', { length: 256 }),
  role: varchar('role', { length: 15, enum: ['customer', 'manager'] })
    .default('customer')
    .notNull(),
  level: int('level').default(1),
  oktoHash: varchar('okto_hash', { length: 256 }).unique(),
  photoPath: varchar('photo_path', { length: 256 }),
  wallet: varchar('wallet', { length: 256 }).unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
