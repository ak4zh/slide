import { userUpdatePasswordSchema } from '$lib/config/zod-schemas.js';
import { auth } from '$lib/server/lucia';
import { isValidPasswordResetToken, validatePasswordResetToken } from '$lib/server/tokens';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const validToken = await isValidPasswordResetToken(event.params.token);
	if (!validToken) redirect(302, '/password-reset');
	const form = await superValidate(event, userUpdatePasswordSchema);
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, userUpdatePasswordSchema);
		if (!form.valid) return fail(400, { form });
		const password = form.data.password;
		const token = event.params.token as string;
		try {
			const userId = await validatePasswordResetToken(token);
			if (!userId) {
				return setError(
					form,
					'password',
					'Email address not found for this token. Please contact support if you need further help.'
				);
			}
			let user = await auth.getUser(userId);
			if (!user.emailVerified) {
				user = await auth.updateUserAttributes(user.userId, {
					emailVerified: true
				});
			}
			await auth.invalidateAllUserSessions(user.userId);
			await auth.updateKeyPassword('email', user.email, password);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'password',
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		redirect(302, `/auth/password-reset/update-${token}/success`);
	}
};
