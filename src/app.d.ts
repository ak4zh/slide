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
		type UserAttributes = {
			email: string;
			first_name: string;
			last_name: string;
			role: string;
			verified: boolean;
			receive_email: boolean;
			token: string;
		};
	}
}

// THIS IS IMPORTANT!!!
export {};
