import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/config/zod-schemas';
import { sendPasswordResetEmail } from '$lib/config/email-messages';
import { db } from '$lib/server/db/client';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('reset user password');
			const token = crypto.randomUUID();
			await db.update(table.users).set({ token }).where(eq(table.users.email, form.data.email))
			await sendPasswordResetEmail(form.data.email, token);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				null,
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		throw redirect(302, '/auth/password/reset/success');
		//		return { form };
	}
};
