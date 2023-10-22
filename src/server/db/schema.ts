import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  int,
  json,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `fiornote_${name}`);

export const folders = mysqlTable(
  "folder",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$default(() => crypto.randomUUID()),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    parentFolderId: varchar("parentFolderId", { length: 255 }),
    name: varchar("name", { length: 256 }).notNull(),
  },
  (folder) => ({
    idIndex: index("folder_id_idx").on(folder.id),
    nameIndex: index("folder_name_idx").on(folder.name),
    parentReference: foreignKey({
      columns: [folder.parentFolderId],
      foreignColumns: [folder.id],
    }),
  }),
);
export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, { fields: [folders.userId], references: [users.id] }),
  parentFolder: one(folders, {
    fields: [folders.parentFolderId],
    references: [folders.id],
  }),
  notes: many(notes),
}));
export type Folder = InferSelectModel<typeof folders>;

export const notes = mysqlTable(
  "note",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$default(() => crypto.randomUUID()),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    parentFolderId: varchar("parentFolderId", { length: 255 }).references(
      () => folders.id,
    ),
    name: varchar("name", { length: 256 }).notNull(),
    textJson: json("textJson"),
  },
  (note) => ({
    idIndex: index("note_id_idx").on(note.id),
    nameIndex: index("note_name_idx").on(note.name),
  }),
);
export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
  parentFolder: one(folders, {
    fields: [notes.parentFolderId],
    references: [folders.id],
  }),
}));
export type Note = InferSelectModel<typeof notes>;

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  folders: many(folders),
  notes: many(notes),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
