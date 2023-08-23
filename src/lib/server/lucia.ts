// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import { connectionPool } from './db/client';

export const auth = lucia({
	adapter: pg(connectionPool, {
		user: 'auth_user',
		key: 'auth_key',
		session: 'auth_session'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			role: data.role,
			firstName: data.first_name,
			lastName: data.last_name,
			email: data.email,
			emailVerified: data.email_verified
		};
	}
});

export type Auth = typeof auth;
