import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userUpdatePasswordSchema } from '$lib/config/zod-schemas';
import { auth } from '$lib/server/lucia';
import { db } from '$lib/server/db/client';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const form = await superValidate(event, userUpdatePasswordSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, userUpdatePasswordSchema);
		if (!form.valid) return fail(400, { form });

		//add user to db
		try {
			const token = event.params.token as string;
			console.log('update user password');
			const newToken = crypto.randomUUID();
			//get email from token
			const users = await db.select().from(table.users).where(eq(table.users.token, token)).limit(1);
			const user = users?.[0]

			if (user?.email) {
				await auth.updateKeyPassword('emailpassword', user.email, form.data.password);
				// need to update with new token because token is also used for verification
				// and needs a new verification token in case user has not verified their account
				// and already forgot their password before verifying. Now they can get a new one resent.
				await db.update(table.users).set({ token: newToken }).where(eq(table.users.id, user.id))
			} else {
				return setError(
					form,
					null,
					'Email address not found for this token. Please contact support if you need further help.'
				);
			}
		} catch (e) {
			console.error(e);
			return setError(
				form,
				null,
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		const token = event.params.token as string;
		throw redirect(302, `/auth/password/update-${token}/success`);
		//		return { form };
	}
};
