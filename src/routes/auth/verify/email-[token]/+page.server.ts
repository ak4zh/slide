import { db } from '$lib/server/db/client';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/config/email-messages';

export async function load({ params }) {
	try {
		const token = params.token as string;
		const users = await db.select().from(table.users).where(eq(table.users.token, token)).limit(1);
		const user = users?.[0]

		let heading = 'Email Verification Problem';
		let message = 'Your email could not be verified. Please contact support if you feel this is an error.';
		if (user) {
			await sendWelcomeEmail(user.email);
			heading = 'Email Verified';
			message = 'Your email has been verified. You can now <a href="/auth/sign-in">sign in</a>';
			await db.update(table.users).set({ verified: true }).where(eq(table.users.id, user.id))
		}
		return {
			result: { heading: heading, message: message }
		};
	} catch (e) {
		return fail(500, {
			error: e
		});
	}
}
