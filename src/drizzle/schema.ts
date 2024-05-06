import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  text,
  decimal,
  index,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(),
  email: varchar('email', { length: 256 }).unique(),
  password: varchar('password', { length: 256 }),
  nickname: varchar('nickname', { length: 100 }),
  firstName: varchar('firstName', { length: 50 }),
  familyName: varchar('familyName', { length: 256 }),
  referral: varchar('referral', { length: 25 }).unique(),
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

export const quests = mysqlTable('quests', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  tinsRequired: int('tins_required').default(0),
  flagType: int('flag_type').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

export const questsCompleted = mysqlTable('quests_completed', {
  id: int('id').primaryKey().autoincrement(),
  idUser: varchar('id_user', { length: 30 })
    .notNull()
    .references(() => users.id),
  idQuest: int('id_quest')
    .notNull()
    .references(() => quests.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const balances = mysqlTable('balances', {
  id: int('id').primaryKey().autoincrement(),
  idUser: varchar('id_user', { length: 30 })
    .notNull()
    .references(() => users.id),
  amountIn: decimal('amount_in', { precision: 19, scale: 2 }).default('0'),
  amountOut: decimal('amount_out', { precision: 19, scale: 2 }).default('0'),
  balance: decimal('balance', { precision: 19, scale: 2 }).default('0'),
  description: varchar('description', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  balances: many(balances),
  questsCompleted: many(questsCompleted),
}));

export const balancesRelations = relations(balances, ({ one }) => ({
  user: one(users, {
    fields: [balances.idUser],
    references: [users.id],
  }),
}));

export const questsRelations = relations(quests, ({ one }) => ({
  questsCompleted: one(questsCompleted, {
    fields: [quests.id],
    references: [questsCompleted.idQuest],
  }),
}));

export const questsCompletedRelations = relations(
  questsCompleted,
  ({ one }) => ({
    quest: one(quests, {
      fields: [questsCompleted.idQuest],
      references: [quests.id],
    }),
    user: one(users, {
      fields: [questsCompleted.idUser],
      references: [users.id],
    }),
  }),
);

export const userDelete = mysqlTable(
  'user-delete',
  {
    id: int('id').primaryKey().autoincrement(),
    email: varchar('email', { length: 256 })
      .notNull()
      .references(() => users.email),
    key: varchar('key', { length: 30 })
      .$defaultFn(() => createId())
      .unique(),
    flagValidDelete: int('flag_valid_delete').default(0),
    text: text('text'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      emailIdx: index('email_idx').on(table.email),
    };
  },
);
