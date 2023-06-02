import { pgTable, bigint, varchar, boolean, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable("auth_user", {
	id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
    verified: boolean('verified').notNull().default(false),
    receiveEmail: boolean('receive_email').notNull().default(true),
    token: text('token'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (users) => ({
    emailIdx: index('name_idx').on(users.email),
    tokenIdx: index('token_idx').on(users.token)
}));

const insertUserSchema = createInsertSchema(users);
const selectUserSchema = createSelectSchema(users);

export const sessions = pgTable("auth_session", {
    id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: uuid("user_id").notNull().references(() => users.id),
	activeExpires: bigint("active_expires", {
		mode: "number"
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number"
	}).notNull()
});

export const keys = pgTable("auth_key", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: uuid("user_id").notNull().references(() => users.id),
	primaryKey: boolean("primary_key").notNull(),
	hashedPassword: varchar("hashed_password", {
		length: 255
	}),
	expires: bigint("expires", {
		mode: "number"
	})
});
