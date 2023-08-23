import { pgTable, bigint, varchar, boolean, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
	'auth_user',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		role: text('role', { enum: ['admin', 'user'] })
			.notNull()
			.default('user'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		domain: text('domain').notNull(),
		email: text('email').notNull(),
		emailVerified: boolean('email_verified').default(false).notNull()
	},
	(users) => ({
		emailDomainIdx: uniqueIndex('email_domain_idx').on(users.email, users.domain)
	})
);

export const emailVerificationTokens = pgTable('email_verification_token', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expires: bigint('expires', { mode: 'number' })
});

export const passwordResetTokens = pgTable('password_reset_token', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expires: bigint('expires', { mode: 'number' })
});

export const sessions = pgTable('auth_session', {
	id: varchar('id', {
		length: 128
	}).primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull()
});

export const keys = pgTable('auth_key', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	hashedPassword: varchar('hashed_password', {
		length: 255
	}),
	expires: bigint('expires', {
		mode: 'number'
	})
});
