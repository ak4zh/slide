import { sendPasswordResetEmail } from '$lib/config/email-messages';
import { generatePasswordResetToken } from '$lib/server/tokens';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import * as tables from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { userSchema } from '$lib/config/zod-schemas.js';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { getBaseURL } from '$lib/utils/string';

const resetPasswordSchema = userSchema.pick({ email: true });

export const load = async (event) => {
	const form = await superValidate(event, resetPasswordSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, resetPasswordSchema);
		const email = form.data.email;
		if (!form.valid) return fail(400, { form });

		//add user to db
		try {
			const databaseUsers = await db
				.select()
				.from(tables.users)
				.where(eq(tables.users.email, email));
			if (!databaseUsers.length) return setError(form, 'email', 'Email does not exist');
			const databaseUser = databaseUsers[0];
			const userId = databaseUser.id;
			const token = await generatePasswordResetToken(userId);
			await sendPasswordResetEmail(getBaseURL(event.url), email, token);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'email',
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		redirect(302, '/auth/password/reset/success');
	}
};
