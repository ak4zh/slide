import { redirect } from '@sveltejs/kit';
import { validateEmailVerificationToken } from '$lib/server/tokens';
import { auth } from '$lib/server/lucia';

export const GET = async ({ params, locals }) => {
	try {
		const userId = await validateEmailVerificationToken(params.token);
		if (!userId) {
			return new Response('Invalid or expired token', {
				status: 422
			});
		}
		await auth.invalidateAllUserSessions(userId);
		await auth.updateUserAttributes(userId, {
			email_verified: true
		});
		const session = await auth.createSession({ userId, attributes: {} });
		console.log(session)
		locals.auth.setSession(session);
	} catch (err) {
		console.log(err)
	}

	throw redirect(302, '/');
};
