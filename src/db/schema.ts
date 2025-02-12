import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const userTable = mysqlTable('user', {
  uuid: int().primaryKey().autoincrement(),
  username: varchar({ length: 50 }).notNull().unique(),
  firstname: varchar({ length: 50 }).notNull(),
  pin: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(), // Date de création
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(), // Date de mise à jour
});

export const inviteTable = mysqlTable('invite', {
  uuid: int().primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => userTable.uuid, { onDelete: 'cascade' }), // Référence vers l'utilisateur
  ref: varchar({ length: 255 }).notNull().unique(), // Référence unique pour l'URL d'invitation
  name: varchar({ length: 255 }).notNull(), // Nom de l'invité
  message: text().notNull(), // Message personnalisé
  response: text(), // Réponse de l'invité (optionnelle)
  accessLink: varchar('access_link', { length: 255 }).notNull().unique(), // Lien unique d'accès
  createdAt: timestamp('created_at').defaultNow().notNull(), // Date de création
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(), // Date de mise à jour
});
