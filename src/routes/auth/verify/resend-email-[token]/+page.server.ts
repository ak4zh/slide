import { db } from '$lib/server/db/client';
import * as table from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	try {
		const token = params.token as string;
		const users = await db.select().from(table.users).where(eq(table.users.token, token)).limit(1);
		const user = users?.[0]
		let heading = 'Email Verification Problem';
		let message = 'A new email could not be sent. Please contact support if you feel this was an error.';
		if (user) {
			await sendVerificationEmail(user.email, token);
			heading = 'Email Verification Sent';
			message = 'A new verification email was sent.  Please check your email for the message. (Check the spam folder if it is not in your inbox)';
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
