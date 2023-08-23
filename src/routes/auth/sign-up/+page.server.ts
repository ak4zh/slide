import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { generateEmailVerificationToken } from '$lib/server/tokens.js';
import { getBaseURL, getDomain, getProviderId } from '$lib/utils/string';

const signUpSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	password: true,
	terms: true
});

export const load = async (event) => {
	if (event.locals.user) throw redirect(302, '/dashboard');
	const form = await superValidate(event, signUpSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signUpSchema);
		if (!form.valid) return fail(400, { form });

		try {
			const user = await auth.createUser({
				userId: crypto.randomUUID(),
				key: {
					providerId: getProviderId('emailpass', event),
					providerUserId: form.data.email,
					password: form.data.password
				},
				attributes: {
					role: 'user',
					first_name: form.data.firstName,
					last_name: form.data.lastName,
					email: form.data.email,
					domain: getDomain(event),
					email_verified: false
				}
			});
			const token = await generateEmailVerificationToken(user.userId);
			await sendVerificationEmail(getBaseURL(event.url), form.data.email, token);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
		} catch (e) {
			console.error(e);
			// email already in use
			//might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'A user with that email already exists.');
		}

		return { form };
	}
};
