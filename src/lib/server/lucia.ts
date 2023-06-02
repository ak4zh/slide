// lib/server/lucia.ts
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { dev } from '$app/environment';
import { pg } from "@lucia-auth/adapter-postgresql";
import { connectionPool } from './db/client';

export const auth = lucia({
	adapter: pg(connectionPool),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			email: userData.email,
			firstName: userData.first_name,
			lastName: userData.last_name,
			role: userData.role,
			verified: userData.verified,
			receiveEmail: userData.receive_email,
			token: userData.token
		};
	},
	generateCustomUserId: () => crypto.randomUUID()
});

export type Auth = typeof auth;
