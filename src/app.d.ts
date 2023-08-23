// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
			user: Lucia.UserAttributes;
			startTimer: number;
			error: string;
			errorId: string;
			errorStackTrace: string;
			message: unknown;
			track: unknown;
		}
		interface Error {
			code?: string;
			errorId?: string;
		}
	}
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/lucia').Auth;
		type DatabaseSessionAttributes = {};
		type DatabaseUserAttributes = {
			role: string;
			first_name: string;
			last_name: string;
			domain: string;
			email: string;
			email_verified: boolean;
		};
	}
}

// THIS IS IMPORTANT!!!
export {};
