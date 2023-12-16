import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			redirect(302, '/auth/sign-in');
		}
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		redirect(302, '/auth/sign-in');
	}
};
