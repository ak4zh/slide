import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { getProviderId } from '$lib/utils/string';

const signInSchema = userSchema.pick({
	email: true,
	password: true
});

export const load = async (event) => {
	if (event.locals.user) redirect(302, '/dashboard');
	const form = await superValidate(event, signInSchema);
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signInSchema);
		//console.log(form);

		if (!form.valid) return fail(400, { form });

		//add user to db
		try {
			const key = await auth.useKey(
				getProviderId('emailpass', event),
				form.data.email,
				form.data.password
			);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
		} catch (e) {
			//TODO: need to return error message to client
			console.error(e);
			// email already in use
			//const { fieldErrors: errors } = e.flatten();
			return setError(form, 'The email or password is incorrect.');
		}
		return { form };
	}
};
