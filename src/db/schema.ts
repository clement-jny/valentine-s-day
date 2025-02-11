import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';

export const userTable = mysqlTable('user', {
  uuid: int().primaryKey().autoincrement(),
  username: varchar({ length: 50 }).notNull().unique(),
  firstname: varchar({ length: 50 }).notNull(),
  pin: varchar({ length: 255 }).notNull(),
});
