import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import type { HandleServerError } from '@sveltejs/kit';
import log from '$lib/server/log';
import { db } from "$lib/server/db/client";
import { migrate } from "drizzle-orm/node-postgres/migrator";

await migrate(db, { migrationsFolder: "./migrations" });

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	event.locals.error = error?.toString() || undefined;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	event.locals.errorStackTrace = error?.stack || undefined;
	event.locals.errorId = errorId;
	log(500, event);

	return {
		message: 'An unexpected error occurred.',
		errorId
	};
};

export const handle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	event.locals.auth = auth.handleRequest(event);
	if (event.locals?.auth) {
		const session = await event.locals.auth.validate();
		const user = session?.user;
		event.locals.user = user;
		if (event.route.id?.startsWith('/(protected)')) {
			if (!user) redirect(302, '/auth/sign-in');
			if (!user.emailVerified) redirect(302, '/auth/email-verification');
		}
	}

	const response = await resolve(event);
	log(response.status, event);
	return response;
};
