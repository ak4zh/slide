import { db } from '$lib/server/db/client';
import * as tables from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { isWithinExpiration } from 'lucia/utils';

const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await db
		.select()
		.from(tables.emailVerificationTokens)
		.where(eq(tables.emailVerificationTokens.userId, userId));
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EMAIL_VERIFICATION_TOKEN_EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const tokens = await db
		.insert(tables.emailVerificationTokens)
		.values({
			expires: new Date().getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
			userId
		})
		.returning({ id: tables.emailVerificationTokens.id });
	return tokens[0].id;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedTokens = await db
		.select()
		.from(tables.emailVerificationTokens)
		.where(eq(tables.emailVerificationTokens.id, token));
	if (!storedTokens.length) return null;
	const storedToken = storedTokens[0];
	const tokenExpires = Number(storedToken.expires);
	if (!isWithinExpiration(tokenExpires)) return null;
	// we can invalidate all tokens since a user only verifies their email once
	await db
		.delete(tables.emailVerificationTokens)
		.where(eq(tables.emailVerificationTokens.userId, storedToken.userId));
	return storedToken.userId;
};

const PASSWORD_RESET_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await db
		.select()
		.from(tables.passwordResetTokens)
		.where(eq(tables.passwordResetTokens.userId, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - PASSWORD_RESET_TOKEN_EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const tokens = await db
		.insert(tables.passwordResetTokens)
		.values({
			expires: new Date().getTime() + PASSWORD_RESET_TOKEN_EXPIRES_IN,
			userId
		})
		.returning({ id: tables.passwordResetTokens.id });
	return tokens[0].id;
};

export const validatePasswordResetToken = async (token: string) => {
	const storedTokens = await db
		.select()
		.from(tables.passwordResetTokens)
		.where(eq(tables.passwordResetTokens.id, token));
	if (!storedTokens.length) return null;
	const storedToken = storedTokens[0];
	const tokenExpires = Number(storedToken.expires);
	if (!isWithinExpiration(tokenExpires)) return null;
	// invalidate all user password reset tokens
	await db
		.delete(tables.passwordResetTokens)
		.where(eq(tables.passwordResetTokens.userId, storedToken.userId));
	return storedToken.userId;
};

export const isValidPasswordResetToken = async (token: string) => {
	const storedTokens = await db
		.select()
		.from(tables.passwordResetTokens)
		.where(eq(tables.passwordResetTokens.id, token));
	if (!storedTokens.length) return false;
	const storedToken = storedTokens[0];
	const tokenExpires = Number(storedToken.expires);
	if (!isWithinExpiration(tokenExpires)) return false;
	return true;
};
