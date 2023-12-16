import { generateEmailVerificationToken } from '$lib/server/tokens';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { redirect } from '@sveltejs/kit';
import { getBaseURL } from '$lib/utils/string';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const schema = z.object({});

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	const form = await superValidate(schema);

	if (!session) {
		redirect(302, '/login');
	}
	if (session.user.emailVerified) {
		redirect(302, '/');
	}
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, schema);
		const user = event.locals.user;
		if (!user) {
			redirect(302, '/auth/login');
		}
		if (user.emailVerified) {
			redirect(302, '/');
		}
		const token = await generateEmailVerificationToken(user.userId);
		await sendVerificationEmail(getBaseURL(event.url), user.email, token);
		return { form };
	}
};
